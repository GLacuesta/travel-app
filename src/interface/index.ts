export interface IOriginCoordinates {
  lat?: number;
  long?: number;
}

export interface IDestinationCoordinates extends IOriginCoordinates {}

export interface IFetchCityParams {
  value?: string;
  name?: string;
}

export interface ICityStateSharedObject {
  originCity: string;
  intermediateCity: string;
  destinationCity: string;
  travelPlan: string;
}

export interface ICityState {
  originCityOptions: Object;
  intermediateCityOptions: Object;
  destinationCityOptions: Object;
  cityPayload: Object;
  status: ICityStateSharedObject,
  error: ICityStateSharedObject,
}

export interface ICityRecord {
  id?: string | number;
  label?: string;
  lat?: number;
  long?: number;
  name?: string;
  value?: string | number;
}

export interface IFormValue {
  originCity?: ICityRecord;
  intermediateCity?: Array<ICityRecord> | undefined[];
  destinationCity?: ICityRecord;
  tripDate?: string | number;
  passengers?: number;
  name?: string;
}

export interface IFormError {
  originCity?: string;
  intermediateCity?: string;
  destinationCity?: string;
  tripDate?: string;
  passengers?: string;
}

export interface ICustomObjectFunction {
  [k: string]: Function;
}

export interface ICustomObjectString {
  [k: string]: string;
}

export interface ICityProp {
  state: ICityState,
  requestStatus: string;
  data: object;
  message: string;
}