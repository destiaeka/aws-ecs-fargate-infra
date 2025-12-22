import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), message: 'The server is running and healthy.'});
});

app.get('/', (_, res) => res.send('Cloud DevOps Project - Deploying a Node.js app to ECS'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});