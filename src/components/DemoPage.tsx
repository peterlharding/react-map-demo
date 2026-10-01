import type {ReactNode} from 'react';

import type {Demo} from '../app/demos';

interface Props {
  demo: Demo;
  children: ReactNode;
}

// Shared heading and description for every demo page
export const DemoPage = ({demo, children}: Props) => (
  <section>
    <title>{`${demo.title} - React Map Demo`}</title>
    <h1 className='text-info h2 mb-2'>{demo.title}</h1>
    <p className='mb-1'>{demo.summary}</p>
    <p className='text-body-secondary'><strong>Try:</strong> {demo.tryIt}</p>
    {children}
  </section>
);

export default DemoPage;
