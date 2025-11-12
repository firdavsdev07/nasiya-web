export interface IDebt {
  _id: string;
  fullName: string;
  phoneNumber: string;
  totalPrice: number;
  totalPaid: number;
  remainingDebt: number;
  manager: string;
  status: string;
  nextPaymentDate: string;
  previousPaymentDate?: string; // Kechiktirilgan eski sana
  postponedAt?: string; // Qachon kechiktirilgan

  activeContractsCount: number;
  productName: string;
  startDate: string;
  delayDays: number;
  initialPayment: number;

  [key: string]: any;
}
