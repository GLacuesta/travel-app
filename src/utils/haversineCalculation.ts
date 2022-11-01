import { get } from 'lodash';
import { IDestinationCoordinates, IOriginCoordinates } from '../interface';

export const computeHarversineDistance = (origin: IOriginCoordinates, destination: IDestinationCoordinates) => {
  const radiusKm = 6371; // Earth's radius in km, 3959 if in miles

  /*
  * let { lat: originLat, long: originLong } = origin;
  * let { lat: destinationLat, long: destinationLong } = destination;
  *
  * either use above or use lodash get for safe extraction
  */
  let originLat = get(origin, 'lat', 0);
  const originLong = get(origin, 'long', 0);
  let destinationLat = get(destination, 'lat', 0);
  const destinationLong = get(destination, 'long', 0);

  originLat = degreesToRad(originLat);
  destinationLat = degreesToRad(destinationLat);

  const rLat = degreesToRad(destinationLat-originLat);
  const rLong = degreesToRad(destinationLong-originLong);

  const trigoCalc = Math.sin(rLat/2) * Math.sin(rLat/2) + Math.sin(rLong/2)
    * Math.sin(rLong/2) * Math.cos(originLat) * Math.cos(destinationLat); 
  const arctangent = 2 * Math.atan2(
    Math.sqrt(trigoCalc),
    Math.sqrt(1-trigoCalc)
  ); 
  return radiusKm * arctangent;
}

export const degreesToRad = (degrees: number) => degrees * Math.PI / 180;
