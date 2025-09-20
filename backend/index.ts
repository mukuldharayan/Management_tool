import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');

const PORT = process.env.PORT || 9000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);

  });
}

start().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});
