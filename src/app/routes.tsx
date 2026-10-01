import type {ComponentType} from 'react';
import {Navigate, type RouteObject} from 'react-router';

import Layout       from '../components/Layout';
import HomePage     from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import {demos} from './demos';

// The demo pages and the Maps library load on first use, keeping them out of the
// home page bundle
const page = (load: () => Promise<{default: ComponentType}>) =>
  () => load().then(({default: Component}) => ({Component}));

// Paths used before 0.3.0, kept working for old links
const redirects: [string, string][] = [
  ['/mapper',   demos.basicMap.path],
  ['/mapper2',  demos.marker.path],
  ['/map-edit', demos.pickLocation.path],
  ['/map-view', demos.myLocation.path]
];

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {path: '/', element: <HomePage />},
      {
        // Only the demo pages wait for the Maps API, so the home page works without a key
        lazy: page(() => import('../components/MapsLayout')),
        children: [
          {path: demos.basicMap.path,     lazy: page(() => import('../pages/BasicMapPage'))},
          {path: demos.marker.path,       lazy: page(() => import('../pages/MarkerPage'))},
          {path: demos.pickLocation.path, lazy: page(() => import('../pages/PickLocationPage'))},
          {path: demos.myLocation.path,   lazy: page(() => import('../pages/MyLocationPage'))},
          {path: demos.addPlaces.path,    lazy: page(() => import('../pages/AddPlacesPage'))}
        ]
      },
      ...redirects.map(([from, to]) => ({path: from, element: <Navigate to={to} replace />})),
      {path: '*', element: <NotFoundPage />}
    ]
  }
];
