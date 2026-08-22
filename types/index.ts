// ==========================================
// Lost & Found Types
// ==========================================
export enum ItemStatus {
    LOST = "LOST",
    FOUND = "FOUND"
}

export interface LostFoundItem {
    id: number;
    title: string;
    description: string;
    category: string; // e.g., "Electronics", "Accessories", "Documents", etc.
    status: ItemStatus; // LOST or FOUND
    location: string; // Where it was lost/found
    imageUrl?: string;
    userId: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    createdAt: string; // ISO
    resolved: boolean; // If claimed/found
    resolvedAt?: string;
}

export type CreateLostFoundItemDto = Omit<LostFoundItem, 'id' | 'createdAt' | 'resolved' | 'resolvedAt'>;
export type UpdateLostFoundItemDto = Partial<CreateLostFoundItemDto>;

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface ApiResponse<T> {
    data: T;
    status: "success" | "error";
    message: string;
}

export enum UserRole {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT"
}