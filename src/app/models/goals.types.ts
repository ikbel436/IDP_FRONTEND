export type Goals = (Job | Training)[];

export interface Job {
  goal: string;
  details: JobDetails;
}

export interface Training {
  goal: string;
  details: TrainingDetails;
}

export interface JobDetails {
  contractTypes: string[];
  jobTitle: string;
  industry: string;
  jobCategory: string;
  experience: string;
  workMode: {
    remote: boolean;
    onSite: boolean;
    mixed: boolean;
  };
}

export interface TrainingDetails {
  domaine: string;
  availability: string;
  budget: string;
  level: string;
  objective: string;
  training: string;
}

export interface GoalsPayload {
  goalId: string[];
  jobDetails?: JobDetails;
  trainingDetails?: TrainingDetails;
}
