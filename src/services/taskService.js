const Task = require("../models/taskModel");

const statusOrder = ["todo", "doing", "done"];
const allowedSortFields = ["createdAt", "dueDate"];
const mutableFields = ["title", "description", "status", "priority", "dueDate"];

const buildTaskQuery = ({ priority, search, status }) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  return query;
};

const sanitizeUpdateData = (data) => {
  const sanitizedData = {};

  for (const field of mutableFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      sanitizedData[field] = data[field];
    }
  }

  return sanitizedData;
};

const isValidStatusTransition = (currentStatus, nextStatus) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextIndex = statusOrder.indexOf(nextStatus);

  return nextIndex === currentIndex + 1;
};

const getTasks = async (queryParams) => {
  const page = Math.max(Number(queryParams.page) || 1, 1);
  const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const sortBy = allowedSortFields.includes(queryParams.sortBy)
    ? queryParams.sortBy
    : "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;
  const query = buildTaskQuery(queryParams);

  const [tasks, total] = await Promise.all([
    Task.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
    Task.countDocuments(query),
  ]);

  return {
    data: tasks,
    pagination: {
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTaskById = (id) => {
  return Task.findById(id);
};

const createTask = (data) => {
  return Task.create(data);
};

const updateTask = async (id, data) => {
  const task = await Task.findById(id);

  if (!task) {
    return null;
  }

  const updateData = sanitizeUpdateData(data);

  if (updateData.status && updateData.status !== task.status) {
    if (!isValidStatusTransition(task.status, updateData.status)) {
      const error = new Error("Invalid status transition");
      error.statusCode = 400;
      throw error;
    }
  }

  Object.assign(task, updateData);
  return task.save();
};

const deleteTask = (id) => {
  return Task.findByIdAndDelete(id);
};

const updateTaskStatus = async (id, status) => {
  const task = await Task.findById(id);

  if (!task) {
    return null;
  }

  if (!isValidStatusTransition(task.status, status)) {
    const error = new Error("Invalid status transition");
    error.statusCode = 400;
    throw error;
  }

  task.status = status;
  return task.save();
};

module.exports = {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
};
