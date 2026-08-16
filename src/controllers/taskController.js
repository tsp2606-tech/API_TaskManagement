const mongoose = require("mongoose");
const taskService = require("../services/taskService");

const allowedStatuses = ["todo", "doing", "done"];
const allowedPriorities = ["low", "medium", "high"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendSuccess = (res, statusCode, data, message = "Success", meta) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};

const sendError = (res, statusCode, message, error) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error ? { error } : {}),
  });
};

const validateTaskBody = (body, { partial = false } = {}) => {
  if (!partial && (!body.title || !body.title.trim())) {
    return "Title is required";
  }

  if (body.title !== undefined && !body.title.trim()) {
    return "Title cannot be empty";
  }

  if (body.status !== undefined && !allowedStatuses.includes(body.status)) {
    return "Status must be one of: todo, doing, done";
  }

  if (body.priority !== undefined && !allowedPriorities.includes(body.priority)) {
    return "Priority must be one of: low, medium, high";
  }

  if (body.dueDate !== undefined && body.dueDate !== null && Number.isNaN(Date.parse(body.dueDate))) {
    return "Due date must be a valid date";
  }

  return null;
};

const getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(req.query);
    return sendSuccess(res, 200, result.data, "Tasks fetched successfully", {
      pagination: result.pagination,
    });
  } catch (error) {
    return sendError(res, 500, "Server error", error.message);
  }
};

const createTask = async (req, res) => {
  try {
    const validationError = validateTaskBody(req.body);

    if (validationError) {
      return sendError(res, 400, validationError);
    }

    const task = await taskService.createTask(req.body);
    return sendSuccess(res, 201, task, "Task created successfully");
  } catch (error) {
    return sendError(res, 400, "Invalid task data", error.message);
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    const task = await taskService.getTaskById(id);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    return sendSuccess(res, 200, task, "Task fetched successfully");
  } catch (error) {
    return sendError(res, 500, "Server error", error.message);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "createdAt")) {
      return sendError(res, 400, "createdAt cannot be updated");
    }

    const validationError = validateTaskBody(req.body, { partial: true });

    if (validationError) {
      return sendError(res, 400, validationError);
    }

    const task = await taskService.updateTask(id, req.body);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    return sendSuccess(res, 200, task, "Task updated successfully");
  } catch (error) {
    return sendError(res, error.statusCode || 400, error.message || "Invalid task data");
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    const task = await taskService.deleteTask(id);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    return sendSuccess(res, 200, null, "Task deleted successfully");
  } catch (error) {
    return sendError(res, 500, "Server error", error.message);
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    if (!allowedStatuses.includes(status)) {
      return sendError(res, 400, "Status must be one of: todo, doing, done");
    }

    const task = await taskService.updateTaskStatus(id, status);

    if (!task) {
      return sendError(res, 404, "Task not found");
    }

    return sendSuccess(res, 200, task, "Task status updated successfully");
  } catch (error) {
    return sendError(res, error.statusCode || 500, error.message || "Server error");
  }
};

module.exports = {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  updateTaskStatus,
};
