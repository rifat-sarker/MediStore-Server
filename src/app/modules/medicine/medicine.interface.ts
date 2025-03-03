export interface IMedicine {
  name: string;
  description: string;
  price: number;
  stock: number;
  availability: boolean;
  requiredPrescription: boolean;
  manufacturer: string;
  expiryDate: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
