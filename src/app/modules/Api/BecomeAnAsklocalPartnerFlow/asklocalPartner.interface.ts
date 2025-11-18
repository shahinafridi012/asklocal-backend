export interface IPartnerFlow {
  firstName: string;
  lastName: string;
  mlsLicense: string;
  email: string;
  code?: string;
  verified?: boolean;
  createdAt?: Date;
}
