const taskExample = {
  _id: "66b437c9ce982033cd76a63",
  title: "Hoc Express.js",
  description: "Hoan thanh REST API",
  status: "todo",
  priority: "high",
  dueDate: "2026-08-20T00:00:00.000Z",
  createdAt: "2026-08-16T08:00:00.000Z",
  updatedAt: "2026-08-16T08:00:00.000Z",
};

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description:
      "REST API for managing tasks. The current source code does not implement JWT, API Key, or any other authentication mechanism.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Local development server",
    },
  ],
  security: [],
  tags: [
    {
      name: "Documentation",
      description: "OpenAPI/Swagger documentation endpoints",
    },
    {
      name: "Health",
      description: "Application health check",
    },
    {
      name: "Tasks",
      description: "Task CRUD, filtering, pagination, sorting, and status workflow",
    },
  ],
  paths: {
    "/api-docs.json": {
      get: {
        tags: ["Documentation"],
        summary: "Get OpenAPI document",
        description: "Returns the OpenAPI 3.0 document used by Swagger UI.",
        operationId: "getOpenApiDocument",
        responses: {
          200: {
            description: "OpenAPI document",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: true,
                },
                example: {
                  openapi: "3.0.3",
                  info: {
                    title: "Task Management API",
                    version: "1.0.0",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/": {
      get: {
        tags: ["Health"],
        summary: "Check API status",
        description: "Returns a simple message when the API server is running.",
        operationId: "healthCheck",
        responses: {
          200: {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
                example: {
                  message: "BE_TaskManagement API is running",
                },
              },
            },
          },
        },
      },
    },
    "/api/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Get task list",
        description:
          "Returns tasks with optional status/priority filters, title search, pagination, and sorting. Invalid sort fields fall back to createdAt in the service layer.",
        operationId: "getTasks",
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            description: "Filter tasks by status.",
            schema: {
              type: "string",
              enum: ["todo", "doing", "done"],
            },
            example: "todo",
          },
          {
            name: "priority",
            in: "query",
            required: false,
            description: "Filter tasks by priority.",
            schema: {
              type: "string",
              enum: ["low", "medium", "high"],
            },
            example: "high",
          },
          {
            name: "search",
            in: "query",
            required: false,
            description: "Case-insensitive search by task title.",
            schema: {
              type: "string",
            },
            example: "Express",
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Current page. Values lower than 1 are normalized to 1.",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            example: 1,
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Items per page. The service clamps the value between 1 and 100.",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
            example: 10,
          },
          {
            name: "sortBy",
            in: "query",
            required: false,
            description: "Field used for sorting.",
            schema: {
              type: "string",
              enum: ["createdAt", "dueDate"],
              default: "createdAt",
            },
            example: "dueDate",
          },
          {
            name: "sortOrder",
            in: "query",
            required: false,
            description: "Sort direction. Any value other than asc is treated as desc.",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
            example: "asc",
          },
        ],
        responses: {
          200: {
            description: "Tasks fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskListSuccessResponse",
                },
                example: {
                  success: true,
                  message: "Tasks fetched successfully",
                  data: [taskExample],
                  meta: {
                    pagination: {
                      limit: 10,
                      page: 1,
                      total: 1,
                      totalPages: 1,
                    },
                  },
                },
              },
            },
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        description:
          "Creates a new task. title is required; status and priority use model defaults when omitted.",
        operationId: "createTask",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskCreateRequest",
              },
              examples: {
                minimal: {
                  summary: "Minimal payload",
                  value: {
                    title: "Hoc Express.js",
                  },
                },
                full: {
                  summary: "Full payload",
                  value: {
                    title: "Hoc Express.js",
                    description: "Hoan thanh REST API",
                    status: "todo",
                    priority: "high",
                    dueDate: "2026-08-20",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskSuccessResponse",
                },
                example: {
                  success: true,
                  message: "Task created successfully",
                  data: taskExample,
                },
              },
            },
          },
          400: {
            description: "Validation error or invalid task data",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                examples: {
                  missingTitle: {
                    summary: "Missing title",
                    value: {
                      success: false,
                      message: "Title is required",
                    },
                  },
                  invalidPriority: {
                    summary: "Invalid priority",
                    value: {
                      success: false,
                      message: "Priority must be one of: low, medium, high",
                    },
                  },
                  mongooseValidation: {
                    summary: "Model validation error",
                    value: {
                      success: false,
                      message: "Invalid task data",
                      error: "Task validation failed: priority: Priority must be one of: low, medium, high",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get task detail",
        description: "Returns one task by MongoDB ObjectId.",
        operationId: "getTask",
        parameters: [
          {
            $ref: "#/components/parameters/TaskId",
          },
        ],
        responses: {
          200: {
            description: "Task fetched successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskSuccessResponse",
                },
                example: {
                  success: true,
                  message: "Task fetched successfully",
                  data: taskExample,
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/InvalidTaskId",
          },
          404: {
            $ref: "#/components/responses/TaskNotFound",
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
      put: {
        tags: ["Tasks"],
        summary: "Update a task",
        description:
          "Updates mutable task fields: title, description, status, priority, and dueDate. createdAt cannot be updated. If status is included, the same forward-only transition rule is enforced: todo -> doing -> done.",
        operationId: "updateTask",
        parameters: [
          {
            $ref: "#/components/parameters/TaskId",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskUpdateRequest",
              },
              examples: {
                updateDetails: {
                  summary: "Update title, description, priority and due date",
                  value: {
                    title: "Hoc Express.js - Updated",
                    description: "Hoan thanh REST API va viet tai lieu",
                    priority: "medium",
                    dueDate: "2026-08-22",
                  },
                },
                updateStatus: {
                  summary: "Forward status transition",
                  value: {
                    status: "doing",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Task updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskSuccessResponse",
                },
                example: {
                  success: true,
                  message: "Task updated successfully",
                  data: {
                    ...taskExample,
                    title: "Hoc Express.js - Updated",
                    priority: "medium",
                    dueDate: "2026-08-22T00:00:00.000Z",
                    updatedAt: "2026-08-16T09:00:00.000Z",
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid id, invalid body, forbidden field, or invalid status transition",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                examples: {
                  invalidTaskId: {
                    summary: "Invalid ObjectId",
                    value: {
                      success: false,
                      message: "Invalid task id",
                    },
                  },
                  createdAt: {
                    summary: "createdAt cannot be updated",
                    value: {
                      success: false,
                      message: "createdAt cannot be updated",
                    },
                  },
                  invalidTransition: {
                    summary: "Invalid status transition",
                    value: {
                      success: false,
                      message: "Invalid status transition",
                    },
                  },
                  invalidDueDate: {
                    summary: "Invalid due date",
                    value: {
                      success: false,
                      message: "Due date must be a valid date",
                    },
                  },
                },
              },
            },
          },
          404: {
            $ref: "#/components/responses/TaskNotFound",
          },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        description: "Deletes one task by MongoDB ObjectId.",
        operationId: "deleteTask",
        parameters: [
          {
            $ref: "#/components/parameters/TaskId",
          },
        ],
        responses: {
          200: {
            description: "Task deleted successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DeleteTaskSuccessResponse",
                },
                example: {
                  success: true,
                  message: "Task deleted successfully",
                  data: null,
                },
              },
            },
          },
          400: {
            $ref: "#/components/responses/InvalidTaskId",
          },
          404: {
            $ref: "#/components/responses/TaskNotFound",
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
    "/api/tasks/{id}/status": {
      patch: {
        tags: ["Tasks"],
        summary: "Update task status",
        description:
          "Updates task status using a strict forward-only workflow. Allowed transitions are todo -> doing and doing -> done. Reverse transitions and skipped transitions are rejected.",
        operationId: "updateTaskStatus",
        parameters: [
          {
            $ref: "#/components/parameters/TaskId",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TaskStatusUpdateRequest",
              },
              examples: {
                todoToDoing: {
                  summary: "todo to doing",
                  value: {
                    status: "doing",
                  },
                },
                doingToDone: {
                  summary: "doing to done",
                  value: {
                    status: "done",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Task status updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TaskSuccessResponse",
                },
                example: {
                  success: true,
                  message: "Task status updated successfully",
                  data: {
                    ...taskExample,
                    status: "doing",
                    updatedAt: "2026-08-16T09:00:00.000Z",
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid id, invalid status, or invalid status transition",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                examples: {
                  invalidTaskId: {
                    summary: "Invalid ObjectId",
                    value: {
                      success: false,
                      message: "Invalid task id",
                    },
                  },
                  invalidStatus: {
                    summary: "Invalid status value",
                    value: {
                      success: false,
                      message: "Status must be one of: todo, doing, done",
                    },
                  },
                  invalidTransition: {
                    summary: "Invalid transition",
                    value: {
                      success: false,
                      message: "Invalid status transition",
                    },
                  },
                },
              },
            },
          },
          404: {
            $ref: "#/components/responses/TaskNotFound",
          },
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
  },
  components: {
    parameters: {
      TaskId: {
        name: "id",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the task.",
        schema: {
          type: "string",
          pattern: "^[a-fA-F0-9]{24}$",
        },
        example: "66b437c9ce982033cd76a63",
      },
    },
    responses: {
      InvalidTaskId: {
        description: "Invalid MongoDB ObjectId",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              message: "Invalid task id",
            },
          },
        },
      },
      TaskNotFound: {
        description: "Task not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              message: "Task not found",
            },
          },
        },
      },
      ServerError: {
        description: "Server or database error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              message: "Server error",
              error: "Database error detail",
            },
          },
        },
      },
    },
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "BE_TaskManagement API is running",
          },
        },
      },
      Task: {
        type: "object",
        required: ["_id", "title", "description", "status", "priority", "createdAt", "updatedAt"],
        properties: {
          _id: {
            type: "string",
            description: "MongoDB ObjectId.",
            example: "66b437c9ce982033cd76a63",
          },
          title: {
            type: "string",
            description: "Task title. Required and trimmed.",
            example: "Hoc Express.js",
          },
          description: {
            type: "string",
            description: "Task description. Defaults to an empty string.",
            example: "Hoan thanh REST API",
          },
          status: {
            type: "string",
            enum: ["todo", "doing", "done"],
            default: "todo",
            example: "todo",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            default: "medium",
            example: "high",
          },
          dueDate: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: "2026-08-20T00:00:00.000Z",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            example: "2026-08-16T08:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            example: "2026-08-16T08:00:00.000Z",
          },
        },
      },
      TaskCreateRequest: {
        type: "object",
        required: ["title"],
        additionalProperties: false,
        properties: {
          title: {
            type: "string",
            minLength: 1,
            example: "Hoc Express.js",
          },
          description: {
            type: "string",
            example: "Hoan thanh REST API",
          },
          status: {
            type: "string",
            enum: ["todo", "doing", "done"],
            default: "todo",
            example: "todo",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            default: "medium",
            example: "high",
          },
          dueDate: {
            type: "string",
            format: "date",
            nullable: true,
            example: "2026-08-20",
          },
        },
      },
      TaskUpdateRequest: {
        type: "object",
        additionalProperties: false,
        minProperties: 1,
        description: "createdAt is intentionally not accepted by the controller.",
        properties: {
          title: {
            type: "string",
            minLength: 1,
            example: "Hoc Express.js - Updated",
          },
          description: {
            type: "string",
            example: "Hoan thanh REST API va viet tai lieu",
          },
          status: {
            type: "string",
            enum: ["todo", "doing", "done"],
            description: "Must follow todo -> doing -> done when changed.",
            example: "doing",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            example: "medium",
          },
          dueDate: {
            type: "string",
            format: "date",
            nullable: true,
            example: "2026-08-22",
          },
        },
      },
      TaskStatusUpdateRequest: {
        type: "object",
        required: ["status"],
        additionalProperties: false,
        properties: {
          status: {
            type: "string",
            enum: ["todo", "doing", "done"],
            description: "Next status. Must be exactly one step after the current status.",
            example: "doing",
          },
        },
      },
      Pagination: {
        type: "object",
        required: ["limit", "page", "total", "totalPages"],
        properties: {
          limit: {
            type: "integer",
            example: 10,
          },
          page: {
            type: "integer",
            example: 1,
          },
          total: {
            type: "integer",
            example: 1,
          },
          totalPages: {
            type: "integer",
            example: 1,
          },
        },
      },
      TaskSuccessResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Task fetched successfully",
          },
          data: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
      TaskListSuccessResponse: {
        type: "object",
        required: ["success", "message", "data", "meta"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Tasks fetched successfully",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Task",
            },
          },
          meta: {
            type: "object",
            required: ["pagination"],
            properties: {
              pagination: {
                $ref: "#/components/schemas/Pagination",
              },
            },
          },
        },
      },
      DeleteTaskSuccessResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Task deleted successfully",
          },
          data: {
            nullable: true,
            example: null,
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Task not found",
          },
          error: {
            type: "string",
            description: "Optional technical detail returned by some controller branches.",
            example: "Database error detail",
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
