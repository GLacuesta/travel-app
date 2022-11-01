import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { get } from 'lodash';
import { fetchCities, postTravelPlan } from '../../api/service';
import { RootState } from '../../store';
import { ICityState, IFetchCityParams, IFormValue, ICityStateSharedObject, ICustomObjectString } from '../../interface';
import { updateStateOnFetch, updateStateOnPost } from '../utils';
import { Action } from 'redux';

const FETCH_CITY_ACTION_TYPE = 'cities/fetchCities';
const POST_TRAVEL_ACTION_TYPE = 'cities/postTravelPlan';

const updateState = (state: ICityState, action: any) => {
  const actionType = get(action, 'type', '');
  const requestStatus = get(action, 'meta.requestStatus', '');
  const data = get(action, 'payload.data', []);
  const message = get(action, 'error.message', '');
  const name = get(action, 'meta.arg.name', '');
  
  if (actionType.includes(FETCH_CITY_ACTION_TYPE)) {
    updateStateOnFetch[name]({
      state,
      requestStatus,
      data,
      message
    });
    return;
  }

  if (actionType.includes(POST_TRAVEL_ACTION_TYPE)) {
    updateStateOnPost[name]({
      state,
      requestStatus,
      data,
      message
    });
    return;
  }

}

export const rtkFetchCities = createAsyncThunk(
  FETCH_CITY_ACTION_TYPE,
  async ({ value, name }: IFetchCityParams) => {
    try {
      const cities = await fetchCities(value).catch(error => { throw(error); });
      return {
        data: cities,
        name
      };
    } catch (err) {
      throw(err.message);
    }
  }
)

export const rtkPostTravelPlan = createAsyncThunk(
  POST_TRAVEL_ACTION_TYPE,
  async (value: IFormValue) => {
    try {
      const cities = await postTravelPlan(value).catch(error => { throw(error); });
      return {
        data: cities,
        name: 'travelPlan'
      };
    } catch (err) {
      throw(err.message);
    }
  }
)

const initialState: ICityState = {
  originCityOptions: [],
  intermediateCityOptions: [],
  destinationCityOptions: [],
  cityPayload: {},
  status: {
    originCity: 'idle',
    intermediateCity: 'idle',
    destinationCity: 'idle',
    travelPlan: 'idle',
  },
  error: {
    originCity: '',
    intermediateCity: '', 
    destinationCity: '',
    travelPlan: '',
  },
}

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    resetAll: (state) => {
      state = initialState;
    },
    resetSpecificError: (state, action) => {
      state.error[action.payload] = '';
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        isAnyOf(rtkFetchCities.pending, rtkPostTravelPlan.pending),
        (state, action) => {
        updateState(state, action);
      })
      .addMatcher(
        isAnyOf(rtkFetchCities.fulfilled, rtkPostTravelPlan.fulfilled),
        (state, action) => {
        updateState(state, action);
      })
      .addMatcher(
        isAnyOf(rtkFetchCities.rejected, rtkPostTravelPlan.rejected),
        (state, action) => {
        updateState(state, action);
      })
  }
});

export const selectCityOptions = (state: RootState, name: string) => get(state, `city.${name}Options`, []);
export const selectFetchCitiesStatus = (state: RootState, name: string) => get(state, `city.status.${name}`, '');
export const selectErrorInCities = (state: RootState, name: string) => get(state, `city.error.${name}`, '');
export const selectCityPayload = (state: RootState) => get(state, 'city.cityPayload', {});

export const { resetAll, resetSpecificError } = citySlice.actions;

export default citySlice.reducer;