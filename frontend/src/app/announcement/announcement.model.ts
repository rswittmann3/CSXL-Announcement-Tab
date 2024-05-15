export interface Announcement {
  id: number | null;
  author: string;
  organization: string | null;
  slug: string;
  img: string | null;
  published_date: string | null;
  modified_date: string;
  headline: string;
  synopsis: string;
  main_story: string;
  state: string;
}