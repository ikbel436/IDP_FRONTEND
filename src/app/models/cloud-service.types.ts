export interface CloudService {
    _id?: string;
    provider: string;
    serviceName: string;
    serviceType: string;
    location: string;
    available: boolean;
}