// Add dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const warehouseRoutes = require("./routes/warehouseRoute");
const inventoryRoutes = require("./routes/inventoryRoute");

// Create an instance of express
const app = express();

// Define variables
const PORT = process.env.PORT || 8000;

// Add middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use("/warehouses", warehouseRoutes);
app.use("/inventory", inventoryRoutes);

// Bootstrap server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
