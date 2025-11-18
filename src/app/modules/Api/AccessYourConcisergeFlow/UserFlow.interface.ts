export interface IUserFlow {
  firstName: string;
  lastName: string;
  email: string;
  flowType?: "buyer" | "seller" | "refinance" ;
  code?: string;
  verified?: boolean;
  createdAt?: Date;
}
