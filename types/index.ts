// ==========================================
// 1. Part 1 Interfaces (Keep yours here!)
// ==========================================
export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole; // Using the enum below
}

export interface Course {
    id: string;
    title: string;
    description: string;
}

export interface Submission {
    id: number;
    courseId: string;
    studentId: number;
    grade?: number;
}

// ==========================================
// 2. Add ONE Generic Interface ApiResponse<T>
// ==========================================
export interface ApiResponse<T> {
    data: T;
    status: "success" | "error";
    message: string;
}

// ==========================================
// 3. Add ONE Enum (Regular or Const)
// ==========================================
export enum UserRole {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT"
}

// ==========================================
// 4. Add at least TWO Utility Type Uses
// ==========================================
// Example 1: Partial<T> (useful for update actions where fields are optional)
export type UpdateUserDto = Partial<User>;

// Example 2: Omit<T, K> (creates a new type by omitting the 'id' for item creation)
export type CreateSubmissionDto = Omit<Submission, "id">;