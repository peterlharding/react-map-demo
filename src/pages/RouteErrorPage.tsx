import {Link, useRouteError} from 'react-router';
import {Alert, Button} from 'react-bootstrap';

import {describeError, isStaleModule, redactKeys} from '../app/errors';

// Shown instead of a page that failed to load or render
export const RouteErrorPage = () => {
  const error = useRouteError();
  const stale = isStaleModule(error);

  return (
    <section>
      <title>Something Went Wrong - React Map Demo</title>
      <h1 className='text-info h2 mb-3'>Something went wrong</h1>
      <Alert variant='danger'>
        <p>
          {stale
            ? 'A newer version of this app is available. Reload the page to use it.'
            : 'This page hit an unexpected error. Reloading usually fixes it; if not, try another demo.'}
        </p>
        <div className='d-flex flex-wrap gap-2'>
          <Button variant='danger' onClick={() => window.location.reload()}>Reload page</Button>
          <Link to='/' className='btn btn-outline-danger'>Back to the demo list</Link>
        </div>
      </Alert>
      <details>
        <summary>Error details</summary>
        <pre className='error-details small mt-2 p-3 bg-body-tertiary rounded'>{redactKeys(describeError(error))}</pre>
      </details>
    </section>
  );
};

export default RouteErrorPage;
