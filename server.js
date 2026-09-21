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
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


app.use(express.json());
app.use("/api/categories",categoryRoutes);
app.use("/api/test", testRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/bookings", bookingRoutes);
app.get("/",(req,res) =>{
  res.json({
    message : "api is running"
  })
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
