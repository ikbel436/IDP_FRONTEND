export interface School {
  id: string;
  key: string;
  name: {
    en: string;
    fr: string;
  };
  address: string;
}

export interface Education {
  id?: string;
  schoolId: string;
  degree: string;
  grade: string;
  location: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}
