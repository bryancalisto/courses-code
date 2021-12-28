import express from 'express';

const app = express();
app.use(express.json());

const port = 3000;

app.get('/api/users/currentUser', (req, res) => {
  res.send('hoLA');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
