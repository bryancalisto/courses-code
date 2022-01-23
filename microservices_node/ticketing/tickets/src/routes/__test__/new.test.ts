import request from "supertest";
import { app } from "../../app";

it('has a route handler listening to /api/tickets for post requests', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .send({});

  expect(resp.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('Returns a status that is not 401 if the user is authenticated', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(resp.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdffjdkla',
      price: -10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdffjdkla',
    })
    .expect(400);
});

// it('Creates a ticket with valid inputs', async () => {
//   // Add in a check to make sure a ticket was saved

//   await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'asdffjdkla',
//       price: 20
//     })
//     .expect(201);
// });
