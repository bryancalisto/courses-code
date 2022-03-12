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

it('fetches orders for a particular user ', async () => {
  // Create 3 tickets
  const ticket1 = await createTicket();
  const ticket2 = await createTicket();
  const ticket3 = await createTicket();

  const user1 = globalThis.signin();
  const user2 = globalThis.signin();
  // Create 1 order for user 1
  const { body: order1 } = await createOrder(user1, ticket1.id);

  // Create 2 order for user 2
  const { body: order2 } = await createOrder(user2, ticket2.id);
  const { body: order3 } = await createOrder(user2, ticket3.id);

  // Make request to get request for user 2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);


  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order2.id);
  expect(response.body[1].id).toEqual(order3.id);
});