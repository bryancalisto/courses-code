import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

describe('ticket search', () => {
  it('Returns 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .expect(404);
  });

  it('Returns found ticket', async () => {
    const title = 'title';
    const price = 10;

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price
      })
      .expect(201);

    const ticketResp = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .expect(200);

    expect(ticketResp.body.title).toEqual(title);
    expect(ticketResp.body.price).toEqual(price);
  });
});