import {Link} from 'react-router';
import {Card, Col, Row} from 'react-bootstrap';

import {demoList} from '../app/demos';

export const HomePage = () => (
  <section>
    <title>React Map Demo</title>
    <h1 className='text-info h2 mb-2'>React Map Demo</h1>
    <p className='mb-4'>
      Small, self-contained examples of Google Maps in React, using
      the <a href='https://github.com/JustFly1984/react-google-maps-api'>@react-google-maps/api</a> module.
      Each demo builds on the one before it.
    </p>
    <Row xs={1} md={2} className='g-3'>
      {demoList.map((demo, index) => (
        <Col key={demo.path}>
          <Card className='h-100 demo-card'>
            <Card.Body>
              <Card.Subtitle className='mb-2 text-body-secondary'>Demo {index + 1}</Card.Subtitle>
              <Card.Title as='h2' className='h5'>
                <Link to={demo.path} className='stretched-link text-decoration-none'>{demo.title}</Link>
              </Card.Title>
              <Card.Text>{demo.summary}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </section>
);

export default HomePage;
