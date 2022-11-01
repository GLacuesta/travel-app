import { setupFakeEndpoint, parseResponse } from '../';

beforeEach(() => {
  setupFakeEndpoint();
});

const mockResponse = {
  default: {},
  custom: { id: 'id-here', data: 'data here' },
  coordinates: { lat: 35.696233, long: 139.57043 },
  cities: { id: 1, name: 'Paris', lat: 48.856614, long: 2.352222 },
};

test.each`
  expectedResponse            | uri
  ${mockResponse.default}     | ${'http://localhost:3000/endpoint'}
  ${mockResponse.custom}      | ${'http://localhost:3000/endpoint/?id=id-here&data=data-here'}
  ${mockResponse.coordinates} | ${'http://localhost:3000/endpoint/?lat=35.696233&long=139.57043'}
  ${mockResponse.cities}      | ${'http://localhost:3000/endpoint/?id=1&name=Paris&lat=48.856614&long=2.352222'}
`('Should return the correct params based on query', ({ expectedResponse, uri }) => {

  /* Hack!!
  * runAsync here because test async 
  * function is throwing a JSON error in terminal
  */
  const runAsync = async () => {
    const res = await fetch(uri, { method: 'GET' }).then(parseResponse);
    expect(JSON.stringify(res)).toBe(JSON.stringify(expectedResponse));
  }
  runAsync();
});