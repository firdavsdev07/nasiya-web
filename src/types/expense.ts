import type { CurrencyDetails } from "./cash";

export interface IExpense {
  _id: string;
  isActive: boolean;
  notes: string;
  createdAt: string;
  currencyDetails: CurrencyDetails;
}
