export enum ENewsLetterProvider {
  DOT_NET_DEV = 'DOT_NET_DEV',
  SUPPLE = 'SUPPLE',
  GEEK_NEWS = 'GEEK_NEWS',
}

export const OriginSiteURL = {
  [ENewsLetterProvider.DOT_NET_DEV]: 'https://forum.dotnetdev.kr/',
  [ENewsLetterProvider.SUPPLE]: 'https://supple.kr/',
  [ENewsLetterProvider.GEEK_NEWS]: 'https://news.hada.io/',
};

export const SiteIcon = {
  [ENewsLetterProvider.DOT_NET_DEV]: '',
  [ENewsLetterProvider.SUPPLE]:
    'https://firebasestorage.googleapis.com/v0/b/eggbot-7bf3a.appspot.com/o/supple.png?alt=media&token=38306310-237b-4d0d-9efd-2ee2e0a55be7',
  [ENewsLetterProvider.GEEK_NEWS]:
    'https://firebasestorage.googleapis.com/v0/b/eggbot-7bf3a.appspot.com/o/geeknews.png?alt=media&token=d4e85e8a-2de3-4aac-8f45-790dc9c8b28b',
};

export const FriendlySiteName = {
  [ENewsLetterProvider.DOT_NET_DEV]: '닷넷데브',
  [ENewsLetterProvider.SUPPLE]: '서플',
  [ENewsLetterProvider.GEEK_NEWS]: '긱뉴스',
};
