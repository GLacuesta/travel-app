import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Loading from './components/Loading';
import RoutesHOC from './routes';

function App() {
  return (
    <div className="mx-auto justify-center">
      <BrowserRouter>
        <Suspense fallback={
          <>
            <div className="flex justify-center mt-10">
              <div className="flex flex-col rounded-md" data-testid="loading">
                <Loading />
              </div>
            </div>
          </>
        }>
          <RoutesHOC />
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App;
