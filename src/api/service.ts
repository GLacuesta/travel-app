import { get, isEmpty, uniq } from 'lodash';
import moment from 'moment';
import { parseResponse } from '.';
import { IFormValue } from '../interface';
import { buildOptions, computeHarversineDistance } from '../utils';
import { CITIES, UNSUPPORTED_CITIES, UNSUPPORTED_PHRASE } from '../utils/constants';


/*
* usually defined in env file
* only the domain but here we're using location.origin for fake backend
*/
const MOCKED_CITIES_ENDPOINT = new URL(`${window.location.origin}/cities`);
const MOCKED_CALCULATE_ENDPOINT = new URL(`${window.location.origin}/calculate`);


const fetchCities = async (name?: string) => {
  let url = new URL(MOCKED_CITIES_ENDPOINT);
  const requestOptions = {
    method: 'GET',
    headers: { 'Custom-Interceptor': 'true' }
  };
  if (name) {
    const params = [['city', name]];
    url.search = new URLSearchParams(params).toString();
  }

  const response =
    await fetch(url, requestOptions).then(parseResponse)
      .catch(e => {
        console.error(e);
        return e;
      });

  const message = get(response, 'message', '');
  if (message) {
    throw(response);
  }
  const data = get(response, 'data', '');
  const options = buildOptions(data);
  return options;
}

const postTravelPlan = async (payload: IFormValue) => {
  let url = new URL(MOCKED_CALCULATE_ENDPOINT);
  const requestOptions = {
    method: 'POST',
    headers: { 'Custom-Interceptor': 'true' },
    body: JSON.stringify(payload)
  };

  const response =
    await fetch(url, requestOptions).then(parseResponse)
      .catch(e => {
        console.error(e);
        return e;
      });

  const message = get(response, 'message', '');
  if (message) {
    throw(response);
  }
  return get(response, 'data', {});
}

const getAllCities = (record: any, okCb: Function) => {
  return okCb({
    params: record,
    data: CITIES,
  });
}

const getCities = (record: any, okCb: Function, errorCb: Function) => {
  const city = get(record, 'city', '').toLocaleLowerCase();
  if (UNSUPPORTED_PHRASE.includes(city)) {
    return errorCb({
      ...record,
    });
  }
  return okCb({
    params: record,
    data: CITIES.filter(c => c.name.toLocaleLowerCase().includes(city)) || [],
  });
}


/*
* segregate two array mapping to lessen
* perfomance to simulate post delay for a little;
* normally in backend, it'll be computed in one go or via multithread
*/
const calculateDistance = (payload: IFormValue, okCb: Function, errorCb: Function) => {
  /*
  * we can use 
  *
  * const { originCity, intermediateCity, destinationCity } = payload;
  * const { }
  * 
  * or lodash get for safe extraction
  */

  const originCity = get(payload, 'originCity', {});
  const intermediateCity = get(payload, 'intermediateCity', []);
  const destinationCity = get(payload, 'destinationCity', {});
  const passengers = get(payload, 'passengers', 0);
  const tripDate = get(payload, 'tripDate', '');
  const validDate = moment(tripDate, 'MM/DD/YYYY');
  const citiesToTravel = intermediateCity?.map(c => ({ ...c, source: 'intermediateCity' }));
  citiesToTravel.push({ ...originCity, source: 'originCity' });
  citiesToTravel.push({ ...destinationCity, source: 'destinationCity' });


  /*
  * error checking
  */
  if (isEmpty(originCity)
    || isEmpty(intermediateCity)
    || isEmpty(destinationCity)
    || passengers <= 0
    || !validDate.isValid()
  ) {
    return errorCb({
      name: 'travelPlan',
    });
  }

  let isUnsupported = UNSUPPORTED_CITIES.every(city => citiesToTravel.find(c => c.name?.toLocaleLowerCase() === city));
  if (isUnsupported) {
    const unsupportedCities = citiesToTravel.filter(c =>
      UNSUPPORTED_CITIES.includes(
        get(c, 'name', '').toLowerCase()
      )
    ).map(c => c.name);
    const uniqueUnsupportedCities = uniq(unsupportedCities).join(' ');
    return errorCb({
      error: uniqueUnsupportedCities,
      name: 'travelPlan',
    });
  }
  /*
  * create array with distance to originCity
  * and sort by nearest
  */
  const recordedCities = citiesToTravel
    .map(city => ({
      ...city,
      distanceToOrgin: computeHarversineDistance(
        { lat: get(originCity, 'lat', 0), long: get(originCity, 'long', 0) },
        { lat: get(city, 'lat', 0), long: get(city, 'long', 0) }
      ),
    })
  ).sort((a, b) => a.distanceToOrgin - b.distanceToOrgin);


  /*
  * compuate distance to each other and add total distance
  */
  const travelRecords = recordedCities.map((city, idx) => {
    if (idx === 0) {
      return {
        ...city,
        distanceFromPrevCity: city.distanceToOrgin,
      };
    }
    return {
      ...city,
      distanceFromPrevCity: computeHarversineDistance(
        { lat: get(city, 'lat', 0), long: get(city, 'long', 0) },
        { lat: get(recordedCities, `[${idx - 1}].lat`, 0), long: get(recordedCities, `[${idx - 1}].long`, 0) }
      ),
    };
  })

  const totalDistance = travelRecords.reduce((prev, current) => prev + current.distanceFromPrevCity, 0);

  return okCb({
    data: {
      cities: travelRecords,
      total: totalDistance,
      name: 'travelPlan',
    },
  })
}

export { calculateDistance, getAllCities, getCities, fetchCities, postTravelPlan };

