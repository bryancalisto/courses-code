import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

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

it('marks an order as cancelled', async () => {
  const ticket = await createTicket();

  const user = globalThis.signin();
  const { body: order } = await createOrder(user, ticket.id);

  // Make request to get orders for user
  await request(app)
    .delete('/api/orders/' + order.id)
    .set('Cookie', user)
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an cancelled order event', async () => {
  const ticket = await createTicket();

  const user = globalThis.signin();
  const { body: order } = await createOrder(user, ticket.id);

  // Make request to get orders for user
  await request(app)
    .delete('/api/orders/' + order.id)
    .set('Cookie', user)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});