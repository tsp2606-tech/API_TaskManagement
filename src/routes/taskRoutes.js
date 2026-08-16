const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

router
  .route("/")
  .get(taskController.getTasks)
  .post(taskController.createTask);

router.patch("/:id/status", taskController.updateTaskStatus);

router
  .route("/:id")
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
