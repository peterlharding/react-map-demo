import type {ComponentType} from 'react';
import {Navigate, type RouteObject} from 'react-router';
import {Container} from 'react-bootstrap';

import Layout         from '../components/Layout';
import HomePage       from '../pages/HomePage';
import NotFoundPage   from '../pages/NotFoundPage';
import RouteErrorPage from '../pages/RouteErrorPage';
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
    // Only if the layout itself fails, so there is no navigation bar to keep
    errorElement: <Container className='py-4'><RouteErrorPage /></Container>,
    children: [
      {
        // Errors in any page, including a lazy page that fails to load, render
        // here inside the layout, keeping the navigation bar usable
        errorElement: <RouteErrorPage />,
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
              {path: demos.addPlaces.path,    lazy: page(() => import('../pages/AddPlacesPage'))},
              {path: demos.shapes.path,       lazy: page(() => import('../pages/ShapesPage'))}
            ]
          },
          ...redirects.map(([from, to]) => ({path: from, element: <Navigate to={to} replace />})),
          {path: '*', element: <NotFoundPage />}
        ]
      }
    ]
  }
];
