import type { ICustomer } from "./customer";

export interface IPayment {
  amount: number;
  date: Date;
  method?: string;
  isPaid: boolean;
  paymentType: "initial" | "monthly" | "extra"; // YANGI
  notes: string;
  _id: string;
  status?: "PAID" | "PENDING" | "REJECTED" | "UNDERPAID" | "OVERPAID"; // YANGI
  confirmedAt?: Date; // YANGI
  confirmedBy?: string; // YANGI
  remainingAmount?: number;
  excessAmount?: number;
  expectedAmount?: number;
}

export interface IContractInfo {
  box: boolean;
  mbox: boolean;
  receipt: boolean;
  iCloud: boolean;
}

export interface IContractChange {
  field: string;
  oldValue: number;
  newValue: number;
  difference: number;
}

export interface IImpactSummary {
  underpaidCount: number;
  overpaidCount: number;
  totalShortage: number;
  totalExcess: number;
  additionalPaymentsCreated: number;
}

export interface IContractEdit {
  date: string;
  editedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  changes: IContractChange[];
  affectedPayments: string[];
  impactSummary: IImpactSummary;
}

export interface IContract {
  customer?: ICustomer;
  productName: string;
  originalPrice: number;
  price: number;
  initialPayment: number;
  percentage: number;
  period: number;
  initialPaymentDueDate: string;
  monthlyPayment: number;
  notes: string;
  totalPrice: number;

  startDate: string;
  _id: string;
  clientId: string;
  remainingDebt: number;
  totalPaid: number;
  nextPaymentDate: string;
  previousPaymentDate?: string; // Kechiktirilgan eski sana
  postponedAt?: string; // Qachon kechiktirilgan
  isActive: boolean;
  isDelete: boolean;
  status: "active" | "completed" | "cancelled";
  payments: IPayment[] | [];
  info: IContractInfo;

  // YANGI FIELDLAR
  prepaidBalance?: number;
  editHistory?: IContractEdit[];
}

export interface IAddContract {
  customer: string;
  productName: string;
  originalPrice: number;
  price: number;
  initialPayment: number;
  percentage: number;
  period: number;
  initialPaymentDueDate: string;
  monthlyPayment: number;
  notes: string;
  box: boolean;
  mbox: boolean;
  receipt: boolean;
  iCloud: boolean;
  totalPrice: number;
}

export interface IEditContract extends IAddContract {
  id: string;
}
