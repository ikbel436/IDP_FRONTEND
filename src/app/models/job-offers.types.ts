import { Company } from './company.types';
import { Employee } from './employee.types';

export interface JobOffer {
  id?: string;
  title: string;
  description: string;
  location: string;
  reference?: string;
  employmentType: string;
  jobLevel: string;
  workType: {
    hybrid: boolean;
    remote: boolean;
    onSite: boolean;
  };
  recruiter?: Employee;
  recruiterId?: string;
  contractType: string;
  desiredSkills: string[];
  desiredJobCategories: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  company?: Company;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
