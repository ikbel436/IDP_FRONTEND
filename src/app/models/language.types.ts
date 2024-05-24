export interface Language {
  id?: string;
  name: {
    en: string;
    fr: string;
  };
  proficiency: string;
}

export interface LanguageEntity {
  id?: string;
  languageId: string;
  proficiency: string;
}
