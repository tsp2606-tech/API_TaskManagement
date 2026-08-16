require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BE_TaskManagement API is running",
  });
});

app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
