export interface Source {
  iconKey?: string;
}

export default interface SuppleNodeType {
  id: string;
  url: string;
  title: string;
  author?: string;
  thumbnailKey: string;
  desc: string;
  releasedAt: Date;
  source: Source;
}
