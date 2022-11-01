import { get, isEmpty } from 'lodash';
import { IFormValue } from '../interface';
import { computeHarversineDistance, degreesToRad } from './haversineCalculation';

export const buildOptions = (data: any) => {
  if (isEmpty(data)) { return []; }
  return data.map(((i: any) => {
    return {
      ...i,
      label: i.name,
      value: i.id,
    }
  }));
}

export const buildParams = (params: URLSearchParams) => {
  let queryObject = {};
  params.forEach((value, key) => {
    queryObject = {
      ...queryObject,
      [key]: value,
    }
  });
  return queryObject;
}

export const generateCityQuery = (values: IFormValue) => {
  const originCity = get(values, 'originCity.name', '');
  const intermediateCity = get(values, 'intermediateCity', []).map(c => c.name).join('|');
  const destinationCity = get(values, 'destinationCity.name', '');
  const tripDate = get(values, 'tripDate', '');
  const passengers = get(values, 'passengers', '');
  return `?originCity=${originCity}&intermediateCity=${intermediateCity}&destinationCity=${destinationCity}&tripDate=${tripDate}&passengers=${passengers}`;
}


export { computeHarversineDistance, degreesToRad };
