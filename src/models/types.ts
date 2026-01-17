export interface Cat {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: 'Male' | 'Female' | 'MALE' | 'FEMALE';
    location: string;
    imageUrl?: string;
    images?: string[];
    status: 'Available' | 'Adopted' | 'Pending' | 'AVAILABLE' | 'ADOPTED' | 'PENDING' | 'NOT_AVAILABLE';
    color?: string;
    weight?: number;
    description?: string;
    isVaccinated?: boolean;
    isNeutered?: boolean;
    specialNeeds?: string;
    shelter?: {
        id: string;
        userId: string;
        name: string;
        city: string;
        isVerified?: boolean;
    };
    adoptions?: {
        completedAt: string;
    }[];
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
    homeType?: string;
    hasOtherPets?: boolean;
    otherPetsInfo?: string;
    experience?: string;
    aboutMe?: string;
    shelter?: {
        id: string;
        name: string;
    };
}

export interface FeatureIcon {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

export enum ApplicationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface AdoptionApplication {
    id: string;
    catId: string;
    cat: Partial<Cat>;
    adopterId?: string;
    adopter?: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
        address?: string;
    };
    status: ApplicationStatus;
    message: string;
    reviewNotes?: string;
    reviewedAt?: string;
    completedAt?: string;
    createdAt: string;
}


export interface CreateApplicationData {
    catId: string;
    message: string;
    homeType?: string;
    hasOtherPets?: boolean;
    otherPetsInfo?: string;
    experience?: string;
}

export enum MedicalRecordType {
    VACCINATION = 'VACCINATION',
    VET_VISIT = 'VET_VISIT',
    HEALTH_CHECK = 'HEALTH_CHECK',
    TREATMENT = 'TREATMENT',
    SURGERY = 'SURGERY'
}

export interface MedicalRecord {
    id: string;
    catId: string;
    type: MedicalRecordType;
    date: string;
    description: string;
    veterinarian?: string;
    nextVisitDate?: string;
    cost?: number;
    createdAt: string;
}

export interface CreateMedicalRecordData {
    type: MedicalRecordType;
    date: string;
    description: string;
    veterinarian?: string;
    nextVisitDate?: string;
    cost?: number;
}

export interface Donation {
    id: string;
    amount: number;
    currency: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    donorId: string;
    shelterId?: string;
    catId?: string;
    createdAt: string;
    cat?: Partial<Cat>;
    shelter?: Partial<Shelter>;
}

export enum RequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
}

export interface ShelterRequest {
    id: string;
    userId: string;
    shelterId: string;
    catName: string;
    breed: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    description?: string;
    images: string[];
    status: RequestStatus;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
    user?: Partial<User>;
    shelter?: Partial<Shelter>;
}

export interface CreateShelterRequestData {
    shelterId: string;
    catName: string;
    breed: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    description?: string;
}

