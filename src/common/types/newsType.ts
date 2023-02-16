export interface News {
  id: string;
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  thumbnailKey: string;
  sourceId: string;
  desc: string;
  favicon?: any;
  score: number;
  grade: number;
  adminPoint: number;
  clickCount: number;
  clickLinkCopyCount: number;
  clickFbShareCount: number;
  shareCount: number;
  releasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  bookmarkCount: number;
  historyCount: number;
  tagCount: number;
  published: boolean;
  publishedAt: Date;
  shuffle1: string;
  shuffle2: string;
  shuffle3: string;
  shuffle4: string;
  shuffle5: string;
  shuffle6: string;
  adminScore: number;
  recommendScore: number;
  readyToPublish: boolean;
  postViewCount: number;
  tags: any[];
  source: any;
  userBookmarks: any[];
  viewerHasBookmarked: boolean;
  viewerHasRead: boolean;
  commentCount: number;
}
