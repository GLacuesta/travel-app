import { LoadingButton } from '@mui/lab';
import { Autocomplete, CircularProgress, FormHelperText, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Formik } from 'formik';
import { debounce, get, isEmpty, set } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  resetSpecificError, rtkFetchCities, rtkPostTravelPlan, selectCityOptions, selectErrorInCities, selectFetchCitiesStatus
} from '../features/city/citySlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { IFormError, IFormValue } from '../interface';
import { buildParams, generateCityQuery } from '../utils';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cityOptions = useAppSelector((state) => selectCityOptions(state, 'originCity')) || [];
  const intermediateCityOptions = useAppSelector((state) => selectCityOptions(state, 'intermediateCity')) || [];
  const destinationCityOptions = useAppSelector((state) => selectCityOptions(state, 'destinationCity')) || [];
  const originStatus = useAppSelector((state) => selectFetchCitiesStatus(state, 'originCity')) || '';;
  const intermediateStatus = useAppSelector((state) => selectFetchCitiesStatus(state, 'intermediateCity')) || '';;
  const destinationStatus = useAppSelector((state) => selectFetchCitiesStatus(state, 'destinationCity')) || '';;
  const originError = useAppSelector((state) => selectErrorInCities(state, 'originCity')) || '';;
  const intermediateError = useAppSelector((state) => selectErrorInCities(state, 'intermediateCity')) || '';;
  const destinationError  = useAppSelector((state) => selectErrorInCities(state, 'destinationCity')) || '';;
  const travelPlanStatus = useAppSelector((state) => selectFetchCitiesStatus(state, 'travelPlan')) || '';
  const travelPlanError = useAppSelector((state) => selectErrorInCities(state, 'travelPlan')) || '';

  const [formValue, setFormValue] = useState<IFormValue>({
    originCity: undefined,
    intermediateCity: undefined,
    destinationCity: undefined,
    tripDate: moment(new Date().setDate(new Date().getDate() + 1)).format('MM/DD/YYYY'),
    passengers: undefined,
  });

  const location = useLocation();

  useEffect(() => {
    const search = get(location, 'search', '');
    const queryParams = search && buildParams(new URLSearchParams(search));
    if (isEmpty(queryParams)) { return; }

    const originCity = get(queryParams, 'originCity', '');
    const intermediateCity = get(queryParams, 'intermediateCity', '')?.split('|');
    const destinationCity = get(queryParams, 'destinationCity', '');
    const tripDate = get(queryParams, 'tripDate', moment(new Date().setDate(new Date().getDate() + 1)).format('MM/DD/YYYY'));
    const passengers = get(queryParams, 'passengers', undefined);

    Promise.all([
      !!originCity ? getCityOptions(originCity, 'originCity') : [],
      !!intermediateCity ? getCityOptions('', 'intermediateCity') : [],
      !!destinationCity ? getCityOptions(destinationCity, 'destinationCity') : [],
    ])
    .then(([originOption, intermediateOption, destinationOption]) => {
      setFormValue({
        // @ts-ignore
        originCity: originOption && originOption?.find(c => c.name.toLowerCase() === originCity?.toLowerCase()),
        // @ts-ignore
        intermediateCity: (intermediateOption && !isEmpty(intermediateCity)) ? intermediateCity?.map(n => intermediateOption?.find(c => c.name.toLowerCase() === n.toLowerCase())) : [],
        // @ts-ignore
        destinationCity: destinationOption && destinationOption?.find(c => c.name.toLowerCase() === destinationCity?.toLowerCase()),
        tripDate: moment(tripDate).format('MM/DD/YYYY') || moment(new Date().setDate(new Date().getDate() + 1)).format('MM/DD/YYYY'),
        passengers: passengers,
      });
    })
    .catch(e => console.error(e));
  }, [location]);

  const getCityOptions = async (value?: string, name?: string) => {
    const response = await dispatch(rtkFetchCities({ value, name }));
    const data = get(response, 'payload.data', {});
    return data;
  }

  const submitHandler = async (values: IFormValue) => {
    const response = await dispatch(rtkPostTravelPlan(values));
    if (!get(response, 'error.message', '')) {
      const query = generateCityQuery(values);
      navigate(`details/${query}`);
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={formValue as IFormValue}
      validate={values => {
        const errors: IFormError = {
          originCity: isEmpty(get(values, 'originCity', {})) ? 'Required' : '',
          intermediateCity: isEmpty(get(values, 'intermediateCity', [])) ? 'Required' : '',
          destinationCity: isEmpty(get(values, 'destinationCity', {})) ? 'Required' : '',
          passengers: get(values, 'passengers', 0) <= 0 ? 'Required' : '',
        };
        return Object.values(errors).find(v => !!v) ? errors : {};
      }}
      onSubmit={(values) => {
        set(values, 'name', 'travelPlan');
        submitHandler(values);
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        touched,
      }) => (
        <div className="flex justify-center mt-10">
          <div className="flex flex-col border border-[#34558B] rounded-md" data-testid="home">
            <div className="bg-white mb-4 mt-10 mx-10 rounded-lg text-blacklight">
              <Autocomplete
                id="search-orign-cities"
                data-testid="search-orign-cities-dropdown"
                options={cityOptions}
                loading={(!!originStatus && originStatus ==='pending')}
                fullWidth
                sx={{ width: 300 }}
                onChange={(event, values) => {
                  dispatch(resetSpecificError('originCity'));
                  setFieldValue('originCity', values);
                }}
                value={values.originCity || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City of Origin"
                    onChange={debounce(event => getCityOptions(event?.target?.value, 'originCity'), 700)}
                    onBlur={handleBlur}
                    data-testid="search-orign-cities-input"
                    name="originCity"
                    error={!!originError || !!errors.originCity && touched.originCity}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(!!originStatus && originStatus ==='pending') ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(!!originError || !!errors.originCity && touched.originCity) && (
                <FormHelperText error style={{ textAlign: 'center'}}>
                  {originError || errors.originCity}
                </FormHelperText>
              )}
            </div>
            <div className="bg-white mb-4 mt-10 mx-10 rounded-lg text-blacklight">
              <Autocomplete
                id="search-intermediate-cities"
                multiple
                data-testid="search-intermediate-cities-dropdown"
                options={intermediateCityOptions}
                loading={(!!intermediateStatus && intermediateStatus ==='pending')}
                fullWidth
                sx={{ width: 300 }}
                onChange={(event, values) => {
                  dispatch(resetSpecificError('intermediateCity'));
                  setFieldValue('intermediateCity', values);
                }}
                // @ts-ignore
                value={!isEmpty(values.intermediateCity) ? values.intermediateCity : []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Intermediate Cities"
                    onChange={debounce(event => getCityOptions(event?.target?.value, 'intermediateCity'), 700)}
                    onBlur={handleBlur}
                    data-testid="search-intermediate-cities-input"
                    name="intermediateCity"
                    error={!!intermediateError || !!errors.intermediateCity && touched.intermediateCity}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(!!intermediateStatus && intermediateStatus ==='pending') ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(!!intermediateError || !!errors.intermediateCity && touched.intermediateCity) && (
                <FormHelperText error style={{ textAlign: 'center'}}>
                  {intermediateError || errors.intermediateCity}
                </FormHelperText>
              )}
            </div>
            <div className="bg-white mb-4 mt-10 mx-10 rounded-lg text-blacklight">
              <Autocomplete
                id="search-destination-cities"
                data-testid="search-destination-cities-dropdown"
                options={destinationCityOptions}
                loading={(!!destinationStatus && destinationStatus === 'pending')}
                fullWidth
                sx={{ width: 300 }}
                onChange={(event, values) => {
                  dispatch(resetSpecificError('destinationCity'));
                  setFieldValue('destinationCity', values);
                }}
                value={values.destinationCity || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City of Destination"
                    onChange={debounce(event => getCityOptions(event?.target?.value, 'destinationCity'), 700)}
                    onBlur={handleBlur}
                    data-testid="search-destination-cities-input"
                    name="destinationCity"
                    error={!!destinationError || !!errors.destinationCity && touched.destinationCity}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(!!destinationStatus && destinationStatus === 'pending') ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(!!destinationError || !!errors.destinationCity && touched.destinationCity) && (
                <FormHelperText error style={{ textAlign: 'center'}}>
                  {destinationError || errors.destinationCity}
                </FormHelperText>
              )}
            </div>
            <div className="bg-white mb-4 mt-10 mx-10 rounded-lg text-blacklight">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                  disablePast
                  label="Date"
                  inputFormat="MM/DD/YYYY"
                  data-testid="tripdate-picker"
                  value={values.tripDate}
                  onChange={(value) => {
                    setFieldValue('tripDate', moment(value).format('MM/DD/YYYY'))
                  }}
                  minDate={new Date().setDate(new Date().getDate() + 1)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{width: '100%'}}
                      name="tripDate"
                      />
                  )}
                />
              </LocalizationProvider>
            </div>
            <div className="bg-white mb-4 mt-10 mx-10 rounded-lg text-blacklight">
              <TextField
                label="Passengers"
                placeholder="Passengers"
                data-testid="passengers-input"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                name="passengers"
                value={get(values, 'passengers', '')}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                error={!!errors.passengers && touched.passengers}
              />
              {(!!errors.passengers && touched.passengers) && (
                <FormHelperText error style={{ textAlign: 'center'}}>
                  {errors.passengers}
                </FormHelperText>
              )}
            </div>
            <div className="bg-white mb-10 mt-4 mx-10 rounded-lg">
              <LoadingButton
                color="primary"
                disabled={
                  !isEmpty(errors)
                  || !!originError
                  || !!intermediateError
                  || !!destinationError
                  || (!!travelPlanStatus && travelPlanStatus === 'pending')
                }
                fullWidth
                loading={(!!travelPlanStatus && travelPlanStatus === 'pending')}
                onClick={() => handleSubmit()}
                variant="outlined"
                data-testid="travel-submit"
              >
                SUBMIT
              </LoadingButton>
              <FormHelperText error style={{ textAlign: 'center'}}>
                  {travelPlanError}
              </FormHelperText>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default Home;