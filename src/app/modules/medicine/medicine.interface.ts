export interface IMedicine {
  name: string;
  description: string;
  price: number;
  stock: number;
  requiredPrescription: boolean;
  manufacturer: string;
  expiryDate: Date;
  image?: string; 
  createdAt: Date;
  updatedAt: Date;
}
