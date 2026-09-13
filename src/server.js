require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./config/db");
const swaggerDocument = require("./docs/swagger");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());

app.get("/api-docs.json", (req, res) => {
  res.status(200).json(swaggerDocument);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Task Management API Docs",
  })
);

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
