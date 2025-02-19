// Import required modules
const pkg = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;

// Create a new pool using the connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Removed ${...} and used normal property access
  ssl: { 
    rejectUnauthorized: false // Allow SSL connections
  },
});

// Export the pool for use in other files
module.exports = pool;
console.log("Database URL:", process.env.DATABASE_URL);
