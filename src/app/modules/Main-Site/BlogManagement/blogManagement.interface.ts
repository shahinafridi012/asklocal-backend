export interface IBlog {
  title: string;
  category: string;
  description?: string;
  heroUrl?: string;
  contentHtml: string;
  showOnHome?: boolean;
  wordCount?: number;
  readingTime?: number;
  status: "draft" | "published";
  createdAt?: Date;
  updatedAt?: Date;
}
