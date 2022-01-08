import request from 'supertest';
import { app } from '../../app';
const route = '/api/users/signin';

it('Fails when email that does not exist is supplied', async () => {
  await request(app)
    .post(route)
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
});

it('Fails when incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  return request(app)
    .post(route)
    .send({
      email: 'test@test.com',
      password: 'passwordi'
    })
    .expect(400);
});

it('Responds with a cookie when given invalid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app)
    .post(route)
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});