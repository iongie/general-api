# General Project API Documentation

This project is a NestJS application that includes a comprehensive User Management (UM) module. Below is the documentation for the available APIs.

## User Management Module

The User Management module handles Users, Roles, and Permissions.

### Base URL
All endpoints are relative to the base URL of the application (e.g., `http://localhost:3000`).

---

### 1. Permissions API
Manage system permissions.

**Base Path:** `/permissions`

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/permissions` | List all permissions with pagination and filtering. | **Query Params:**<br>- `search`: Search by name (string)<br>- `category`: Filter by category (enum)<br>- `isActive`: Filter by status (boolean)<br>- `page`: Page number (default: 1)<br>- `limit`: Items per page (default: 10)<br>- `sortBy`: Field to sort by (default: created_at)<br>- `sortOrder`: ASC or DESC (default: DESC) |
| `POST` | `/permissions` | Create a new permission. | **Body:**<br>`{`<br>  `"name": "string",`<br>  `"slug": "string",`<br>  `"displayName": "string",`<br>  `"description": "string",`<br>  `"category": "enum",`<br>  `"isActive": boolean`<br>`}` |
| `GET` | `/permissions/:id` | Get details of a specific permission. | - |
| `PATCH` | `/permissions/:id` | Update a permission. | **Body:** (Partial of Create Body) |
| `DELETE` | `/permissions/:id` | Delete a permission. | - |

---

### 2. Roles API
Manage user roles and their associated permissions.

**Base Path:** `/roles`

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/roles` | List all roles with pagination and filtering. | **Query Params:**<br>- `search`: Search by name<br>- `color`: Filter by color tag<br>- `isActive`: Filter by status<br>- `isSystem`: Filter system roles<br>- `page`, `limit`, `sortBy`, `sortOrder` |
| `POST` | `/roles` | Create a new role. | **Body:**<br>`{`<br>  `"name": "string",`<br>  `"slug": "string",`<br>  `"description": "string",`<br>  `"color": "enum",`<br>  `"sortOrder": number,`<br>  `"isActive": boolean,`<br>  `"isSystem": boolean,`<br>  `"permissionIds": ["ulid"]`<br>`}` |
| `GET` | `/roles/:id` | Get details of a specific role (includes permissions). | - |
| `PATCH` | `/roles/:id` | Update a role. | **Body:** (Partial of Create Body) |
| `DELETE` | `/roles/:id` | Delete a role. | - |
| `POST` | `/roles/:id/permissions` | Assign permissions to a role. | **Body:**<br>`{ "permissionIds": ["ulid"] }` |
| `DELETE` | `/roles/:id/permissions` | Remove permissions from a role. | **Body:**<br>`{ "permissionIds": ["ulid"] }` |

---

### 3. Users API
Manage users and their role assignments.

**Base Path:** `/users`

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | List all users with pagination and filtering. | **Query Params:**<br>- `search`: Search by username<br>- `status`: Filter by status (active, inactive, etc.)<br>- `roleId`: Filter by role<br>- `page`, `limit`, `sortBy`, `sortOrder` |
| `POST` | `/users` | Create a new user. | **Body:**<br>`{`<br>  `"username": "string",`<br>  `"email": "email",`<br>  `"password": "string",`<br>  `"firstName": "string",`<br>  `"lastName": "string",`<br>  `"phone": "string",`<br>  `"status": "enum",`<br>  `"roleIds": ["ulid"]`<br>`}` |
| `GET` | `/users/:id` | Get details of a specific user (includes roles). | - |
| `PATCH` | `/users/:id` | Update a user profile. | **Body:** (Partial of Create Body) |
| `DELETE` | `/users/:id` | Delete a user. | - |
| `POST` | `/users/:id/change-password` | Change user password. | **Body:**<br>`{ "newPassword": "string" }` |
| `POST` | `/users/:id/roles` | Assign roles to a user. | **Body:**<br>`{ "roleIds": ["ulid"] }` |
| `DELETE` | `/users/:id/roles` | Remove roles from a user. | **Body:**<br>`{ "roleIds": ["ulid"] }` |

---

## Data Transfer Objects (DTOs) Overview

### Enums
*   **PermissionCategory**: Categories for grouping permissions.
*   **RoleColor**: `blue`, `green`, `red`, `yellow`, `purple`, `pink`, `indigo`, `gray`.
*   **UserStatus**: `active`, `inactive`, `suspended`, `pending`.

### Validation
All inputs are validated using `class-validator`.
*   **ULID**: IDs are expected to be valid ULIDs.
*   **Pagination**: `page` and `limit` are numeric strings.
