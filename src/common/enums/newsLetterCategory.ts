export enum ENewsLetterCategory {
  DEVELOPER = 'DEVELOPER',
}

export const NewsLetterCategoryDropdown = [
  {
    label: 'IT/개발',
    description: 'IT/개발 관련 뉴스를 구독합니다.',
    value: ENewsLetterCategory.DEVELOPER,
  },
] as INewsLetterCategoryDropdown[];

export interface INewsLetterCategoryDropdown {
  label: string;
  description: string;
  value: ENewsLetterCategory.DEVELOPER;
}
