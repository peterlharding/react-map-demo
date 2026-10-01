import {createBrowserRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';

import {routes} from './routes';

const router = createBrowserRouter(routes);

export const App = () => <RouterProvider router={router} />;

export default App;

// Also see:
// * https://developers.google.com/maps/documentation/javascript/using-typescript
// * https://developers.google.com/maps/documentation/javascript/events
// * https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
// * https://reactrouter.com/start/data/routing
//
