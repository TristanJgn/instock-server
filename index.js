// Add dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create an instance of express
const app = express();

// Define variables
const PORT = process.env.PORT || 8000;

// Add middleware
app.use(cors());
app.use(express.json());

// Bootstrap server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
