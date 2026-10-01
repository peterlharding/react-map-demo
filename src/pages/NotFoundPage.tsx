import {Link, useLocation} from 'react-router';

export const NotFoundPage = () => {
  const {pathname} = useLocation();

  return (
    <section>
      <title>Page Not Found - React Map Demo</title>
      <h1 className='text-info h2 mb-3'>Page Not Found</h1>
      <p>There is no page at <code>{pathname}</code>. See the <Link to='/'>list of demos</Link>.</p>
    </section>
  );
};

export default NotFoundPage;
