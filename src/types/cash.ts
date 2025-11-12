export type CurrencyDetails = {
  dollar: number;
  sum: number;
  hasCurrencyRate?: boolean;
  currencyRate?: number | null;
};

// Payment Types and Enums (matching backend)
export enum PaymentStatus {
  PAID = "PAID",
  UNDERPAID = "UNDERPAID",
  OVERPAID = "OVERPAID",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export enum PaymentType {
  INITIAL = "initial",
  MONTHLY = "monthly",
  EXTRA = "extra",
}

export enum PaymentReason {
  MONTHLY_PAYMENT_INCREASE = "monthly_payment_increase",
  MONTHLY_PAYMENT_DECREASE = "monthly_payment_decrease",
  INITIAL_PAYMENT_CHANGE = "initial_payment_change",
  TOTAL_PRICE_CHANGE = "total_price_change",
}

// IPayment interface - matches backend Payment schema with populated fields
export interface IPayment {
  _id: string;
  amount: number;
  date: Date | string;
  isPaid: boolean;
  paymentType: PaymentType;
  notes: string | { _id: string; text: string }; // Can be string or populated object
  customerId: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address?: string;
    passportSeries?: string;
    telegramName?: string;
  };
  managerId: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  contractId?: string | null; // ✅ YANGI - shartnoma ID
  status?: PaymentStatus;
  remainingAmount?: number;
  excessAmount?: number;
  expectedAmount?: number;
  confirmedAt?: Date | string;
  confirmedBy?: string | { _id: string; firstName: string; lastName: string };
  linkedPaymentId?: string;
  reason?: PaymentReason;
  prepaidAmount?: number;
  appliedToPaymentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Yangi interface - Debtor uchun
export interface IDebtor {
  _id: string;
  contractId: string;
  debtAmount: number;
  dueDate: Date;
  overdueDays: number;
  createBy: string;
  createdAt: Date;
  updatedAt: Date;
}
