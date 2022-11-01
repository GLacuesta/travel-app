import { computeHarversineDistance } from "../haversineCalculation";

const mockResponse = [
  {
    origin: { lat: 48.856614, long: 2.352222 },
    destination: { lat: 43.296482, long: 5.36978 },
    result: 232.42805884053507
  },
  {
    origin: { lat: 43.296482, long: 5.36978 },
    destination: { lat: 48.573405, long: 7.752111 },
    result: 184.10762262333074
  },
]

test.each`
  expectedResponse            | origin                    | destination
  ${mockResponse[0].result}   | ${mockResponse[0].origin} | ${mockResponse[0].destination}
  ${mockResponse[1].result}   | ${mockResponse[1].origin} | ${mockResponse[1].destination}
`('Should return the correct params based on query', ({ expectedResponse, origin, destination }) => {
  const calculate = computeHarversineDistance(origin, destination);
  expect(calculate).toBe(expectedResponse);
});