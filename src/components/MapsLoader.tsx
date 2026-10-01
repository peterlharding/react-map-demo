import type {ReactNode} from 'react';
import {useJsApiLoader, type Libraries} from '@react-google-maps/api';
import {Alert, Spinner} from 'react-bootstrap';

import {GoogleMapsApiKey} from '../config';

// Must be a stable reference, the loader rejects changed options between renders
const libraries: Libraries = ['marker', 'geometry'];

interface Props {
  children: ReactNode;
}

// Loads the Maps JavaScript API once for the whole app, so pages can
// render <GoogleMap> without each one managing its own script tag
export const MapsLoader = ({children}: Props) => {
  if (!GoogleMapsApiKey) {
    return (
      <Alert variant='warning'>
        <Alert.Heading>Google Maps API key missing</Alert.Heading>
        Set <code>MAPS_API_KEY</code> in <code>.env</code> (run <code>make setup</code> to create it
        from <code>setup/env.template</code>) and restart the dev server.
      </Alert>
    );
  }

  return <ApiLoader apiKey={GoogleMapsApiKey}>{children}</ApiLoader>;
};

const ApiLoader = ({apiKey, children}: Props & {apiKey: string}) => {
  const {isLoaded, loadError} = useJsApiLoader({googleMapsApiKey: apiKey, libraries});

  if (loadError) {
    return (
      <Alert variant='danger'>
        <Alert.Heading>Google Maps failed to load</Alert.Heading>
        {loadError.message}
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className='d-flex justify-content-center align-items-center map-canvas'>
        <Spinner animation='border' variant='info' role='status'>
          <span className='visually-hidden'>Loading map...</span>
        </Spinner>
      </div>
    );
  }

  return children;
};

export default MapsLoader;
