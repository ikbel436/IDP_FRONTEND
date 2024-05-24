export interface Company {
  id?: string;
  logo?: string;
  name: string;
  email: string;
  location: string;
  country: string;
  industry: string;
  foundationDate: string;
  phone: {
    countryCode: string;
    phoneNumber: string;
  };
  website: string;
  socialLinks: SocialLink[];
  companySize?: number;
  revenue?: number;
  parentCompany?: string;
  description: string;
  status: string;
  isVerified: boolean;
  numSiren?: string;
  numSiret?: string;
  desiredJobCategories: string[];
  desiredContractTypes: string[];
  desiredSkills: string[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number
}
export interface SocialLink {
  id?: string;
  url: string;
  type: string;
}
