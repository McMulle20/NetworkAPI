import express from 'express';
import routes from './routes/index'; // Make sure 'routes/index' is correctly imported  // Correct path to the routes

const app = express();

app.use(express.json());  // Middleware to parse JSON bodies

// Mount the routes at /api/thoughts
app.use('/api/thoughts', routes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
