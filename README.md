# Simple Travel App - URL: https://travel-app-a1ee7.web.app/
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts
### `yarn start`
Runs the app in the development mode. \[http://localhost:3000](http://localhost:3000) to view it in the browser.
### `yarn test` - shallow and small testing currently in
### `yarn build and firebase deploy`- build and deployed

### e2e test via cypress - will push to a separate repo

## Specs
### Formik
### Redux, Redux Toolkit (modern approach - by feature and slice), (axios -optional)
### Typescript (not 100% due to never[] and typeof any[] instances in terminal)
### MUI and Tailwind

## Features
### Fill out form [OriginCity, IntermediateCity, DestinationCity, TripDate and Number of Passengers]
### Validates (presubmit and onsubmit) -> navigates to details page
### Deep linking via url query string (url/?originCity=Paris&destinationCity=Dijon)
### Error handling on fetch and post
### Uses fakebackend - window.fetch manipulation
### Has unsupported phrase (FAIL) and unsupported city (DIJON) - all case insensitive

## Challenges
### Validation more in backend rather than in frontend then applying to the state/props
### Getting query params then matching it to the options.. Intermediate City put me on a little break on this :)
### JS loading state is fast that I had to segragate some array manipulation to lessen computation performance since I need to mock bandwidth pending state
### whenever VS code re init typescript, typing errors pop out - never[], any[]; had to debug and apply workaround but usually go away away reloading window 


