export interface Employee {
    id?: string;
    name: string;
    currentPost: string;
    email: string;
    enabled?: boolean;
    phone: {
        countryCode: string;
        phoneNumber: string;
    };
    roles: string[];
    country?: string;
    address?: string;
    codePostal?: string;
    gender?: string;
    birthDate?: string;
    profilePicture?: string;
    createdAt?: string;
    updatedAt?: string;
    companyId?: string;
}
