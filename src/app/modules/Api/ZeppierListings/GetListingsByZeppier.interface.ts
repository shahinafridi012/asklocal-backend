export interface IListings {
  _id?: string;
  data: any;        // raw Zapier property payload
  expiresAt?: Date | null;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
