const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content, status: 'pending' });
  commentsByPostId[req.params.id] = comments;

  try {
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentCreated',
      data: {
        id,
        content,
        status: 'pending',
        postId: req.params.id
      }
    });
  } catch (e) {
    console.log('error post COMMENTS');
    return res.status(500).end();
  }

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;

    try {
      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          status,
          postId,
          content
        }
      });
    } catch (e) {
      console.log(e);
      console.log('error post events comments (commentModerated)');
    }

  }

  res.send({});
});

app.listen(4001, () => {
  console.log('COMMENTS server listening on 4001');
});
