export interface Experience {
  id?: string;
  title: string;
  type: string;
  company: string;
  location: string;
  locationType: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  industry: string;
  description: string;
  skills: string[];
}


export interface Project{
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  links: string[];
  skills: string[];
}