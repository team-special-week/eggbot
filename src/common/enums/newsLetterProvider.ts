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
  [ENewsLetterProvider.DOT_NET_DEV]:
    'https://discourse-dotnetdev-upload.ewr1.vultrobjects.com/original/1X/733ba4d0a11f167d295a4a7257e40bcbc93d91bb.png',
  [ENewsLetterProvider.SUPPLE]: 'https://supple.kr/favicon.ico',
  [ENewsLetterProvider.GEEK_NEWS]: 'https://news.hada.io/favicon.ico',
};

export const FriendlySiteName = {
  [ENewsLetterProvider.DOT_NET_DEV]: '닷넷데브',
  [ENewsLetterProvider.SUPPLE]: '서플',
  [ENewsLetterProvider.GEEK_NEWS]: '긱뉴스',
};
