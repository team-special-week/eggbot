export enum ENewsLetterCategory {
  DEVELOPER = 'DEVELOPER',
  OVERWATCH2 = 'OVERWATCH2',
}

export const NewsLetterCategoryDropdown = [
  {
    label: 'IT/개발',
    description: 'IT/개발 관련 뉴스를 구독합니다.',
    value: ENewsLetterCategory.DEVELOPER,
  },
  {
    label: '오버워치2',
    description: '오버워치2 관련 뉴스를 구독합니다.',
    value: ENewsLetterCategory.OVERWATCH2,
  },
] as INewsLetterCategoryDropdown[];

export interface INewsLetterCategoryDropdown {
  label: string;
  description: string;
  value: ENewsLetterCategory.DEVELOPER;
}
