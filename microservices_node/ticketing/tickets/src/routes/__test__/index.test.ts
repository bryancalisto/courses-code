import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: String, price: Number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    });
}

describe('ticket list', () => {
  it('Returns list of tickets', async () => {
    const title = 'title';
    const price = 10;

    await createTicket(title, price);
    await createTicket(title, price);
    await createTicket(title, price);

    const tickets = await request(app)
      .get('/api/tickets')
      .set('Cookie', global.signin())
      .expect(200);

    expect(tickets.body.length).toEqual(3);
  });
});