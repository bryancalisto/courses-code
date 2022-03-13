import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

const createTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  return ticket;
}

const createOrder = (cookie: string[], id: any) => {
  return request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: id })
    .expect(201);
}

it('fetches specific order', async () => {
  const ticket = await createTicket();

  const user = globalThis.signin();
  const { body: order } = await createOrder(user, ticket.id);

  // Make request to get request for user
  const { body: fetchedOrder } = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', user)
    .expect(200);


  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns error if one user tries to get an order from another user', async () => {
  const ticket = await createTicket();

  const user = globalThis.signin();
  const { body: order } = await createOrder(user, ticket.id);

  // Make request to get request for user
  const { body: fetchedOrder } = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', globalThis.signin())
    .send()
    .expect(401);
});