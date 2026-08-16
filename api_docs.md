# Task Management API Documentation

Tài liệu này mô tả toàn bộ route, query params, payload và response của API quản lý công việc để frontend có thể tích hợp.

## Base URL

Local:

```txt
http://localhost:3001
```

API prefix:

```txt
/api/tasks
```

## Response Format

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Optional technical detail"
}
```

## Task Model

```json
{
  "_id": "66b437c9ce982033cd76a63",
  "title": "Học Express.js",
  "description": "Hoàn thành REST API",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-08-20T00:00:00.000Z",
  "createdAt": "2026-08-16T08:00:00.000Z",
  "updatedAt": "2026-08-16T08:00:00.000Z"
}
```

Field rules:

- `title`: bắt buộc.
- `description`: không bắt buộc, mặc định `""`.
- `status`: `todo | doing | done`, mặc định `todo`.
- `priority`: `low | medium | high`, mặc định `medium`.
- `dueDate`: không bắt buộc.
- `createdAt`, `updatedAt`: backend tự sinh.

## 1. Health Check

```txt
GET /
```

Response `200`:

```json
{
  "message": "BE_TaskManagement API is running"
}
```

## 2. Lấy Danh Sách Task

```txt
GET /api/tasks
```

Query params hỗ trợ:

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | string | No | Filter theo `todo`, `doing`, `done` |
| `priority` | string | No | Filter theo `low`, `medium`, `high` |
| `search` | string | No | Search theo `title`, không phân biệt hoa thường |
| `page` | number | No | Trang hiện tại, mặc định `1` |
| `limit` | number | No | Số item mỗi trang, mặc định `10`, tối đa `100` |
| `sortBy` | string | No | `createdAt` hoặc `dueDate`, mặc định `createdAt` |
| `sortOrder` | string | No | `asc` hoặc `desc`, mặc định `desc` |

Ví dụ:

```txt
GET /api/tasks?status=todo&priority=high&page=1&limit=10&sortBy=dueDate&sortOrder=asc
```

Response `200`:

```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": [
    {
      "_id": "66b437c9ce982033cd76a63",
      "title": "Học Express.js",
      "description": "Hoàn thành REST API",
      "status": "todo",
      "priority": "high",
      "dueDate": "2026-08-20T00:00:00.000Z",
      "createdAt": "2026-08-16T08:00:00.000Z",
      "updatedAt": "2026-08-16T08:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "limit": 10,
      "page": 1,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

Response `500`:

```json
{
  "success": false,
  "message": "Server error",
  "error": "Database error detail"
}
```

## 3. Tạo Task

```txt
POST /api/tasks
```

Payload:

```json
{
  "title": "Học Express.js",
  "description": "Hoàn thành REST API",
  "priority": "high",
  "dueDate": "2026-08-20"
}
```

Payload đầy đủ có thể gửi:

```json
{
  "title": "Học Express.js",
  "description": "Hoàn thành REST API",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-08-20"
}
```

Response `201`:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "66b437c9ce982033cd76a63",
    "title": "Học Express.js",
    "description": "Hoàn thành REST API",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-08-20T00:00:00.000Z",
    "createdAt": "2026-08-16T08:00:00.000Z",
    "updatedAt": "2026-08-16T08:00:00.000Z"
  }
}
```

Response `400` khi thiếu title:

```json
{
  "success": false,
  "message": "Title is required"
}
```

Response `400` khi dữ liệu không hợp lệ:

```json
{
  "success": false,
  "message": "Invalid task data",
  "error": "Priority must be one of: low, medium, high"
}
```

## 4. Lấy Chi Tiết Task

```txt
GET /api/tasks/:id
```

Path params:

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | MongoDB ObjectId của task |

Response `200`:

```json
{
  "success": true,
  "message": "Task fetched successfully",
  "data": {
    "_id": "66b437c9ce982033cd76a63",
    "title": "Học Express.js",
    "description": "Hoàn thành REST API",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-08-20T00:00:00.000Z",
    "createdAt": "2026-08-16T08:00:00.000Z",
    "updatedAt": "2026-08-16T08:00:00.000Z"
  }
}
```

Response `400` khi ObjectId không hợp lệ:

```json
{
  "success": false,
  "message": "Invalid task id"
}
```

Response `404` khi không tìm thấy:

```json
{
  "success": false,
  "message": "Task not found"
}
```

## 5. Cập Nhật Task

```txt
PUT /api/tasks/:id
```

Payload:

```json
{
  "title": "Học Express.js - Updated",
  "description": "Hoàn thành REST API và viết tài liệu",
  "priority": "medium",
  "dueDate": "2026-08-22"
}
```

Payload có thể cập nhật các field:

- `title`
- `description`
- `status`
- `priority`
- `dueDate`

Không được cập nhật:

- `createdAt`

Lưu ý về `status`: nếu gửi `status` trong `PUT`, API vẫn kiểm tra rule chuyển trạng thái `todo -> doing -> done`.

Response `200`:

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "66b437c9ce982033cd76a63",
    "title": "Học Express.js - Updated",
    "description": "Hoàn thành REST API và viết tài liệu",
    "status": "todo",
    "priority": "medium",
    "dueDate": "2026-08-22T00:00:00.000Z",
    "createdAt": "2026-08-16T08:00:00.000Z",
    "updatedAt": "2026-08-16T09:00:00.000Z"
  }
}
```

Response `400` khi ObjectId không hợp lệ:

```json
{
  "success": false,
  "message": "Invalid task id"
}
```

Response `400` khi cố cập nhật `createdAt`:

```json
{
  "success": false,
  "message": "createdAt cannot be updated"
}
```

Response `400` khi chuyển trạng thái sai:

```json
{
  "success": false,
  "message": "Invalid status transition"
}
```

Response `404`:

```json
{
  "success": false,
  "message": "Task not found"
}
```

## 6. Xóa Task

```txt
DELETE /api/tasks/:id
```

Response `200`:

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

Response `400`:

```json
{
  "success": false,
  "message": "Invalid task id"
}
```

Response `404`:

```json
{
  "success": false,
  "message": "Task not found"
}
```

## 7. Cập Nhật Trạng Thái Task

```txt
PATCH /api/tasks/:id/status
```

Payload:

```json
{
  "status": "doing"
}
```

Rule chuyển trạng thái hợp lệ:

```txt
todo -> doing -> done
```

Không hợp lệ:

```txt
todo -> done
doing -> todo
done -> doing
```

Response `200`:

```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "_id": "66b437c9ce982033cd76a63",
    "title": "Học Express.js",
    "description": "Hoàn thành REST API",
    "status": "doing",
    "priority": "high",
    "dueDate": "2026-08-20T00:00:00.000Z",
    "createdAt": "2026-08-16T08:00:00.000Z",
    "updatedAt": "2026-08-16T09:00:00.000Z"
  }
}
```

Response `400` khi status không hợp lệ:

```json
{
  "success": false,
  "message": "Status must be one of: todo, doing, done"
}
```

Response `400` khi chuyển trạng thái sai:

```json
{
  "success": false,
  "message": "Invalid status transition"
}
```

Response `404`:

```json
{
  "success": false,
  "message": "Task not found"
}
```

## Frontend Integration Notes

Ví dụ gọi danh sách task:

```js
fetch("/api/tasks?page=1&limit=10&sortBy=createdAt&sortOrder=desc")
  .then((res) => res.json())
  .then((result) => {
    const tasks = result.data;
    const pagination = result.meta.pagination;
  });
```

Ví dụ chuyển trạng thái:

```js
fetch(`/api/tasks/${taskId}/status`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    status: "doing"
  })
});
```
