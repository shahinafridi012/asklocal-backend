export interface AsklocalMcSoapUserData {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  amount: number;
  zipCode: string;
  additionalMassage?: string;

  // New fields for verification
//   otp?: string;
  isVerified?: boolean;
}
