const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();
connectDB();

const categoryRoutes = require("./routes/categoryRoutes")
const testRoutes = require("./routes/testRoutes");
const eventRoutes = require("./routes/eventRoutes");


app.use(express.json());
app.use("/api/categories",categoryRoutes);
app.use("/api/test", testRoutes);
app.use("/api/events", eventRoutes);
app.get("/",(req,res) =>{
  res.json({
    message : "api is running"
  })
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
