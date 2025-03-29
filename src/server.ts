import express from 'express';
import routes from './routes/index';
import db from './config/connection';  // Correct way to import a TypeScript file


// Connect to the database
await db();

// Hard-code the port to 3001 (or any port you'd like)
const PORT = 3001;
const app = express();

// Middleware to handle URL encoding and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use routes
app.use(routes);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
