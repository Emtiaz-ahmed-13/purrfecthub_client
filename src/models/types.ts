export interface Cat {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: 'Male' | 'Female';
    location: string;
    imageUrl: string;
    status: 'Available' | 'Adopted' | 'Pending';
}

export interface Shelter {
    id: string;
    name: string;
    location: string;
    description?: string;
}

export enum UserRole {
    ADOPTER = 'ADOPTER',
    SHELTER = 'SHELTER',
    ADMIN = 'ADMIN'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    phone?: string;
    address?: string;
    avatar?: string;
}

export interface FeatureIcon {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}
