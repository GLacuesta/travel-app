import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';

afterEach(cleanup);

test('test app loading', async () => {
  render(<App />);
  const loading = screen.getByTestId('loading');
  expect(loading).toBeInTheDocument();
});

test('test app home page', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const loading = screen.getByTestId('home');
  expect(loading).toBeInTheDocument();
});

test('test app home page dropdown', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const loading = screen.getByTestId('search-orign-cities-dropdown');
  expect(loading).toBeInTheDocument();
});

test('test app home page submit button', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const loading = screen.getByTestId('travel-submit');
  expect(loading).toBeInTheDocument();
});

