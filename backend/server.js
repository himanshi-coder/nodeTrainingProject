const express = require("express");
const sequelize = require("sequelize"); // sequelize: An ORM (Object Relational Mapper) for Node.js that allows you to interact with SQL databases like MySQL, PostgreSQL, SQLite, etc., using JavaScript instead of raw SQL queries.
const dotenv = require("dotenv").config(); // dotenv: A library that loads environment variables from a .env file into process.env. Useful for managing sensitive data like API keys, database credentials, and configuration variables.
const cors = require("cors"); //(Cross-Origin Resource Sharing) To make your API accessible in Chrome, you need to allow CORS. CORS is a mechanism that controls which domains are allowed to access your server. By default, browsers block requests made from a different origin (domain, protocol, or port). Browsers enforce CORS for security reasons, but Postman bypasses it because it's designed for API testing.
const db = require('./Models'); // Import Sequelize models
const authRoutes = require ('./Routes/authRoutes')
const propertyRoutes = require ('./Routes/propertyRoutes')
const rentalRequestRoutes = require ('./Routes/rentalRequestRoutes')

//#region setting up port
// const PORT = process.env.port || 5000;
const PORT = 3000;

const app = express(); //app: Represents Express application. It’s used to define routes, middleware, and server logic.

// Enable CORS
app.use(cors());

//middleware 
app.use(express.json()); // Parses incoming JSON payloads in requests and makes them accessible via req.body
app.use(express.urlencoded({extended: true})) // for http request - Lets the app read form data

// Test the database connection on port - 5432 
// This method tests whether your application can successfully connect to the PostgreSQL database. It's particularly useful during the development or initial setup phase to confirm that: The database credentials (host, port, username, password, database name) are correct. The database server is reachable. You can keep it but use it primarily for testing. In production, you may want to remove it or wrap it in a condition that only runs during development.
if (process.env.NODE_ENV !== 'production') { // Only run in non-production environments
    db.sequelize.authenticate()
      .then(() => console.log('PostgreSQL database connected!'))
      .catch(err => console.error('Database connection error:', err));
  }
  
// Sync models with the database
// This method ensures that your Sequelize models and the actual database schema are in sync. It does this by: Creating tables if they don’t exist. (Optional) Dropping and recreating tables if { force: true } or { alter: true } is specified. (force: false):- Tables are created if they don't already exist. No data loss. (force: true):- Drops existing tables and recreates them based on the model definitions. This will erase all data. (alter: true):- Alters existing tables to match your model definitions without dropping tables or data. Useful for evolving schemas in production. You should keep this but set { force: false } or { alter: true } to avoid data loss, especially in production.
db.sequelize.sync({ alter: true }) // Adjust schema without dropping tables
    .then(() => console.log('Database synced!'))
    .catch(err => console.error('Database sync error:', err));

//routes 

app.use('/api/auth', authRoutes) //for the user API
app.use('/api', propertyRoutes); // Use the property routes
app.use('/api/rentals', rentalRequestRoutes); // Use the rental Requests routes
app.use('/', (req, res) => {
    return res.send('Hi from server');
});

app.listen(PORT, () => {console.log(`server is running on Port - http://localhost:${PORT}`)}) // Starts the server and logs a message to confirm it’s running

