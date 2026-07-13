# Worksync - Project Management Dashboard Application

## Overview
Worksync is a full-stack Project Management Application designed to manage users, workspaces, projects, and tasks with role-based access control. The application supports three user roles: Admin, Project Manager, and Member, each with different permissions and visibility rules.

The goal of Worksync is to provide a clean, organized, and secure workspace management system where Admins can manage the overall platform, Project Managers can manage workspace-level projects and tasks, and Members can view and update the progress of their assigned tasks.

## Status
Feature-complete. Deployment pending.

The core functionality, role-based authorization, dashboards, CRUD operations, task workflows, user management, and polished Material UI frontend are completed. Deployment and final production-level setup are currently pending.

## Tech Stack
Frontend
- React
- TypeScript
- Material UI
- React Router
- Axios
- Context API

Backend
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA / Hibernate
- PostgreSQL

## Key Features
Authentication and Authorization
- JWT-based authentication
- Role-based access control
- Separate dashboards and permissions for Admin, Project Manager, and Member
- Secure backend authorization checks for users, workspaces, projects, and tasks

User Management
- Admin-only user creation
- Admin can edit users
- Admin can activate or deactivate users
- Admin can reset user passwords
- Active and inactive user management
- All roles can view users

Workspace Management
- Admin can create, edit, and delete workspaces
- Admin can assign Project Managers and Members to workspaces
- Project Managers and Members can only view workspaces they are assigned to
- Project Manager can assign other Project Managers and Members to the workspaces after admin assign that Project Manager to the workspace

Project Management
- Projects belong to workspaces
- Admin can manage all projects
- Project Managers can manage projects only inside assigned workspaces
- Project Managers can create projects in their assigned workspaces
- Project Managers can edit projects if they are part of the workspace
- Project Managers can delete only projects they created
- Members can view projects they are part of

Task Management
- Tasks belong to projects
- Admin can view and manage all tasks
- Project Managers can create tasks inside projects within their assigned workspaces
- Project Managers can assign tasks to Members or other Project Managers in the same workspace
- Project Managers cannot assign tasks to Admins
- Only the Project Manager who created a task can edit or delete it
- Members can view assigned tasks
- Members can update the status of tasks assigned to them

Dashboards
- Admin dashboard with global overview
- Project Manager dashboard with workspace, project, and task summary
- Member dashboard focused on assigned tasks and progress

UI/UX
- Clean Material UI dashboard layout
- Responsive pages and forms
- Role-based navigation
- Search and filtering
- Status and role chips
- Professional cards, tables, dialogs, and action buttons
- Loading and empty states
- Snackbar-based success and error notifications

## User Roles & Permissions 

Admin

Admin has full access across the application.

Admin can:
- Create, edit, activate, and deactivate users
- Reset user passwords
- Create, edit, and delete workspaces
- Assign users to workspaces
- View all users, workspaces, projects, and tasks
- Can delete any workspace,project, or task
- Manage all platform data

Project Manager

Project Managers can manage projects and tasks only within workspaces assigned to them.

Project Manager can:
- View all users
- View assigned workspaces
- View projects they are part of
- Create projects in assigned workspaces
- Edit projects if they are part of the workspace
- Delete only projects they created
- Add Members or other Project Managers to workspace projects
- Create tasks inside projects within assigned workspaces
- Assign tasks to Members or Project Managers in the same workspace
- Edit or delete only tasks they created
- Update task status when assigned to a task

Project Manager cannot:
- Create users
- Manage Admin accounts
- Assign tasks to Admins
- Access workspaces they are not assigned to
- Delete projects created by other Project Managers
- Edit or delete tasks created by other Project Managers

Member

Members have limited access focused on viewing assigned work and updating task progress.

Member can:
- View all users
- View assigned workspaces
- View projects they are part of
- View tasks assigned to them
- Update the status of assigned tasks

Member cannot:
- Create users
- Create workspaces
- Create projects
- Create tasks
- Edit or delete projects
- Edit or delete tasks
- Access unassigned workspaces, projects, or tasks

## Visibility Rules

| Role | Users | Workspaces | Projects | Tasks |
|---|---|---|---|---|
| Admin | Can see all users | Can see all workspaces | Can see all projects | Can see all tasks |
| Project Manager | Can see all users | Only assigned workspaces | Only related projects | Created or assigned tasks |
| Member | Can see all users | Only assigned workspaces | Only related projects | Only assigned tasks |

## Project Structure
```txt
ProjectmanagementApp/
├── backend/
│   └── Spring Boot backend application
│
└── frontend/
    └── React + TypeScript frontend application
```

## API endpoints

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login user and return JWT token |
| POST | `/api/auth/register` | Register a new user |
| PATCH | `/api/auth/users/{userId}/reset-password` | Reset user password |

---

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/me` | Get currently authenticated user |
| GET | `/api/users/active` | Get all active users |
| GET | `/api/users/inactive` | Get all inactive users |
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user details |
| PATCH | `/api/users/{id}` | Activate/deactivate user |
| DELETE | `/api/users/{id}` | Delete/deactivate user |

---

### Workspaces

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workspaces` | Get all workspaces |
| GET | `/api/workspaces/{id}` | Get workspace by ID |
| GET | `/api/workspaces/my-workspaces` | Get workspaces assigned to current user |
| POST | `/api/workspaces` | Create workspace |
| PUT | `/api/workspaces/{workspaceId}` | Update workspace |
| DELETE | `/api/workspaces/{workspaceId}` | Delete workspace |

---

### Workspace Members

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workspaces/{workspaceId}/members/{userId}` | Add member to workspace |
| GET | `/api/workspaces/{workspaceId}/members` | Get workspace members |
| DELETE | `/api/workspaces/{workspaceId}/members/{userId}` | Remove member from workspace |

---

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workspaces/{workspaceId}/projects` | Create project inside workspace |
| GET | `/api/workspaces/{workspaceId}/projects` | Get projects by workspace |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/{id}` | Get project by ID |
| GET | `/api/projects/my-projects` | Get projects assigned to current user |
| PUT | `/api/projects/{projectId}` | Update project |
| PATCH | `/api/projects/{projectId}/status` | Update project status |
| DELETE | `/api/projects/{projectId}` | Delete project |

---

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/{projectId}/tasks` | Create task inside project |
| GET | `/api/projects/{projectId}/tasks` | Get tasks by project |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| GET | `/api/tasks/my-tasks` | Get tasks related to current user |
| GET | `/api/tasks/my-assigned-tasks` | Get tasks assigned to current user |
| PUT | `/api/tasks/{taskId}` | Update task |
| PATCH | `/api/tasks/{taskId}/status` | Update task status |
| DELETE | `/api/tasks/{taskId}` | Delete task |

## Screenshots

Login Page

<img width="1272" height="861" alt="Login Page" src="https://github.com/user-attachments/assets/8f5d958d-6693-4911-bee9-30dc3648adda" />

Admin Dashboard

<img width="1763" height="1185" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/cc1a3f45-774f-44ed-8db8-8d8c41875082" />

Project Manager Dashboard

<img width="1763" height="874" alt="PM dashboard" src="https://github.com/user-attachments/assets/5cf33263-0f4c-4763-a728-0cc008290af2" />

Member Dashboard

<img width="1763" height="874" alt="Member dashboard" src="https://github.com/user-attachments/assets/1f157531-220d-4bc8-860a-40ebc9a73770" />

User List

<img width="1763" height="2094" alt="UsersList" src="https://github.com/user-attachments/assets/3846b401-00b8-4d51-ab3d-76529e0aa0c1" />

User Details

<img width="1763" height="1171" alt="User details" src="https://github.com/user-attachments/assets/9597da47-58e3-4968-b082-5abfc9659a51" />

Workspace List

<img width="1763" height="1130" alt="Workspace list (admin dashboard)" src="https://github.com/user-attachments/assets/2112e5ec-72bd-41c3-b067-825ce62e36f5" />

Filtered Workspace List

<img width="1763" height="952" alt="filtered workspaces PM" src="https://github.com/user-attachments/assets/05fbbc5b-8e12-4d2d-937d-5fa364c5b3b4" />

Workspace Details

<img width="1763" height="2160" alt="Workspace Details" src="https://github.com/user-attachments/assets/064cb304-1dcd-4c12-ab9e-877d7d75cefa" />

Project List

<img width="1763" height="1042" alt="Project list" src="https://github.com/user-attachments/assets/beb6fa38-2347-4319-b463-6abdc5a79ef5" />

Filtered Project List (PM's and Members)

<img width="1763" height="1042" alt="filtered projects(PM)" src="https://github.com/user-attachments/assets/cd199607-b266-4680-9d72-e2f7398e54a9" />

Project Details

<img width="1763" height="1683" alt="Project details" src="https://github.com/user-attachments/assets/7379d6a1-af91-4f58-bb9b-f6ae0c6af977" />

Task List

<img width="1763" height="1032" alt="Task list" src="https://github.com/user-attachments/assets/5a3bae4a-40a6-4c7a-a2f7-512c579099e5" />

Filtered Task List(Task assigned by PM)

<img width="1763" height="874" alt="Task created by me(PM)" src="https://github.com/user-attachments/assets/af464050-8e11-4392-a196-153cf2005624" />

Filtered Task List(Task assigned to PM)

<img width="1763" height="874" alt="Task assigned list(PM)" src="https://github.com/user-attachments/assets/c683ad68-5f20-4b5f-88fd-f576757d1f38" />

Task Details

<img width="1763" height="1562" alt="Task details" src="https://github.com/user-attachments/assets/8ad7ead3-d7ec-47d5-a328-32e1341d7703" />

## Getting Started Locally

Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Java 17 or later
- PostgreSQL
- IntelliJ IDEA or another Java IDE

Frontend Setup

Navigate to the frontend folder:
cd frontend

Install dependencies:
npm install

Start the development server:
npm run dev

Frontend will run on:
http://localhost:5173

Backend Setup

Navigate to the backend folder:

cd backend

Open the backend project in IntelliJ IDEA.

Update the PostgreSQL database configuration in application.properties or application.yml.

Example:

spring.datasource.url=jdbc:postgresql://localhost:5432/worksync
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=your_jwt_secret

Run the Spring Boot application from IntelliJ.

Backend will run on:

http://localhost:8080

## Environment Notes

The frontend communicates with the backend API running on:

http://localhost:8080

If needed, update the Axios base URL in the frontend API configuration.

## Current Development Progress

Completed:

- Role-based login and routing
- Admin, Project Manager, and Member dashboards
- User management
- Active/inactive user handling
- Admin reset password
- Workspace CRUD
- Workspace member management
- Project CRUD
- Project status update
- Task CRUD
- Task status update
- Role-based visibility
- Backend authorization rules
- Material UI dashboard design
- Snackbar notifications

Pending:

- Deployment
- Final production configuration
- Optional forgot password by email
- Final README screenshot updates
- Demo credentials after deployment

Future Improvements

- Deploy frontend and backend
- Add forgot password by email
- Add email notifications for task assignments
- Add file attachments for tasks
- Add comments/activity logs on tasks
- Add advanced filtering and reporting
- Add project progress charts
- Add audit logs for Admin actions

## Author

Bhargav Fofandi


