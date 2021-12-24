const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const events = [];

app.post('/events', async (req, res) => {
  const event = req.body;

  events.push(event);

  try {
    await axios.post('http://posts-clusterip-srv:4000/events', event);
    // await axios.post('http://localhost:4001/events', event);
    // await axios.post('http://localhost:4002/events', event);
    // await axios.post('http://localhost:4003/events', event);

    res.send({ status: 'OK' });
  } catch (e) {
    console.log('event bus error: ', event);
    res.status(500).end();
  }
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('EVENT BUS listening on 4005');
});