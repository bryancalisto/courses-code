const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', async (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  try {
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: posts[id]
    });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('(posts) EVENT RECEIVED: ', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('v55');
  console.log('POSTS server listening on 4000');
});
