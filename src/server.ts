//src/server.ts
import express from 'express';
import routes from './routes/index.js'; // Correct path to the routes
import db from './config/connection.js';

await db();

const app = express();

app.use(express.json());  // Middleware to parse JSON bodies

// Mount the routes at /api/thoughts
app.use(routes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});