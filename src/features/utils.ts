import { ICustomObjectFunction, ICityProp } from '../interface';

export const updateStateOnFetch: ICustomObjectFunction = {
  'originCity': ({ state, requestStatus, data, message}: ICityProp) => {
    state.status.originCity = requestStatus;
    if (requestStatus === 'fulfilled') {
      state.originCityOptions = data;
      state.error.originCity = '';
      return;
    }
    if (requestStatus === 'rejected') {
      state.error.originCity = message;
      return;
    }
    return;
  },
  'intermediateCity': ({ state, requestStatus, data, message}: ICityProp) => {
    state.status.intermediateCity = requestStatus;
    if (requestStatus === 'fulfilled') {
      state.intermediateCityOptions = data;
      state.error.intermediateCity = '';
      return;
    }
    if (requestStatus === 'rejected') {
      state.error.intermediateCity = message;
      return;
    }
    return;
  },
  'destinationCity': ({ state, requestStatus, data, message}: ICityProp) => {
    state.status.destinationCity = requestStatus;
    if (requestStatus === 'fulfilled') {
      state.destinationCityOptions = data;
      state.error.destinationCity = '';
      return;
    }
    if (requestStatus === 'rejected') {
      state.error.destinationCity = message;
      return;
    }
    return;
  }
};

export const updateStateOnPost: ICustomObjectFunction = {
  'travelPlan': ({ state, requestStatus, data, message}: ICityProp) => {
    state.status.travelPlan = requestStatus;
    if (requestStatus === 'fulfilled') {
      state.cityPayload = data;
      state.error.travelPlan = '';
      return;
    }
    if (requestStatus === 'rejected') {
      state.error.travelPlan = message;
      return;
    }
    return;
  },
};