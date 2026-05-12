export interface IBook {
  _id: string;
  authorId?: string; // <-- এই লাইনটি নতুন যোগ করুন
  title: string;
  slug: string;
  authorName: string;
  coverImage: string;
  read_credits: number;
  download_credits: number;
  hardCopyAvailable: boolean;
  hardCopyPrice?: number;
  averageRating: number;
  totalReviews: number;
}