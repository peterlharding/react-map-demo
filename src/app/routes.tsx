import {Navigate, type RouteObject} from 'react-router';

import Layout   from '../components/Layout';
import MapView  from '../components/MapView';
import MapEdit  from '../components/MapEdit';
import Mapper   from '../components/Mapper';
import Mapper2  from '../components/Mapper2';
import NotFound from '../components/NotFound';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {path: '/',         element: <Navigate to='/map-view' replace />},
      {path: '/map-view', element: <MapView />},
      {path: '/mapper',   element: <Mapper />},
      {path: '/mapper2',  element: <Mapper2 />},
      {path: '/map-edit', element: <MapEdit />},
      {path: '*',         element: <NotFound />}
    ]
  }
];
