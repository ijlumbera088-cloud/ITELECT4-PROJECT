# Project Name: DLSL Academy Manager

### Project Concept
This application serves as a backend foundation for managing school components, including users (students, teachers, admins), course enrollments, and assignment submissions. Built entirely with TypeScript, it establishes strong static typing patterns for data integrity across the platform.

### Defined Interfaces and Types
* `User`: Interface defining platform users.
* `Course`: Interface outlining available subjects.
* `Submission`: Interface representing student coursework uploads.
* `ApiResponse<T>`: A generic wrapper for standard API responses.
* `UserRole`: Enum for system access privileges.
* `UpdateUserDto`: Utility type mapping optional user fields (`Partial`).
* `CreateSubmissionDto`: Utility type omitting standard IDs for resource creation (`Omit`).

### How to Install and Run
1. Install dependencies:
   ```bash
   npm install