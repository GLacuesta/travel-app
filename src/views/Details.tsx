import { Box, FormHelperText, Paper, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import {
  rtkFetchCities, rtkPostTravelPlan, selectCityPayload
} from '../features/city/citySlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { IFormValue } from '../interface';
import { buildParams } from '../utils';
import { UNSUPPORTED_PHRASE } from '../utils/constants';

const Details = () => {
  const dispatch = useAppDispatch();
  const travelPlan = useAppSelector(selectCityPayload);

  const [plan, setPlan] = useState<IFormValue>({
    originCity: undefined,
    intermediateCity: undefined,
    destinationCity: undefined,
    tripDate: moment(new Date().setDate(new Date().getDate() + 1)).format('MM/DD/YYYY'),
    passengers: undefined,
    name: 'travelPlan',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [pageError, setPageError] = useState<string>('');

  const location = useLocation();

  useEffect(() => {
    const search = get(location, 'search', '');
    const queryParams = search && buildParams(new URLSearchParams(search));
    if (isEmpty(queryParams) || !isEmpty(travelPlan)) { return; }
    setLoading(true);
    const runAsync = async () => {
      const origin = get(queryParams, 'originCity', '') || '';
      const beforesplit = get(queryParams, 'intermediateCity', '') || '';
      const intermediate = beforesplit?.split('|');
      const destination = get(queryParams, 'destinationCity', '') || '';

      if (UNSUPPORTED_PHRASE.includes(origin || destination || beforesplit)) {
        setPageError('Unsupported Phrase');
        setLoading(false);
        return;
      }

      const cities = await dispatch(rtkFetchCities({ value: '', name: 'originCity' }));
      if (!!get(cities, 'error.message', '')) {
        setPageError(get(cities, 'error.message', '') || '');
        setLoading(false);
        return;
      }
      const options = get(cities, 'payload.data', []);
      const values = {
        // @ts-ignore
        originCity: !isEmpty(options) ? options.find(c => c.name.toLowerCase() === origin.toLowerCase()) : undefined,
        // @ts-ignore
        intermediateCity: (!isEmpty(options) && !isEmpty(intermediate)) ? intermediate.map(n => options.find(c => c.name.toLowerCase() === n.toLowerCase())) : [],
        // @ts-ignore
        destinationCity: !isEmpty(options) ? options.find(c => c.name.toLowerCase() === destination.toLowerCase())  : undefined,
        tripDate: moment(get(queryParams, 'tripDate', '')).format('MM/DD/YYYY') || moment(new Date().setDate(new Date().getDate() + 1)).format('MM/DD/YYYY'),
        passengers: get(queryParams, 'passengers', 0),
        name: 'travelPlan',
      };
      setPlan(values);
      const response = await dispatch(rtkPostTravelPlan(values));
      if (!!get(response, 'error.message', '')) {
        setPageError(get(response, 'error.message', '') || '');
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    runAsync();
  }, [location]);


  const renderTravelPlan = (travelPlan) => {
    const cities = get(travelPlan, 'cities', []);
    const total = get(travelPlan, 'total', []);
    return (
      <>
        <Box sx={{ maxWidth: 400 }}>
          <Paper square elevation={0} sx={{ p: 3 }} className="flex flex-col text-lg">
            <label>{`Total Distance: ${total.toFixed(2)} KM`}</label>
            <label>{`Date of Trip: ${plan?.tripDate}`}</label>
            <label>{`Number of Passengers: ${plan?.passengers}`}</label>
          </Paper>
        </Box>
        <Stepper orientation="vertical">
          {cities.map((city, idx) => (
            <Step active key={nanoid()}>
              <StepLabel>
                {city.name}
              </StepLabel>
              {
                (idx + 1 < cities.length) && (
                  <StepContent>
                    <label>{`Distance: ${cities[idx + 1].distanceFromPrevCity.toFixed(2)} KM`}</label>
                  </StepContent>
                )
              }
            </Step>
          ))}

        </Stepper>
      </>
    )
  }
  return (
    <div className="flex justify-center mt-10">
      <div className={`flex flex-col rounded-md ${loading ? '' : 'border'}`}>
        <div data-testid="details" className="flex flex-col flex-wrap m-4">
          {loading && <Loading />}
          {!!pageError && (
            <FormHelperText error style={{ textAlign: 'center'}}>
              {pageError}
            </FormHelperText>
          )}
          {!loading && !isEmpty(travelPlan) && renderTravelPlan(travelPlan)}
        </div>
      </div>
    </div>
  );
}

export default Details;