import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('test-cluster', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});