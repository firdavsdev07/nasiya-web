import type { IContract } from "./contract";

export interface ICustomer {
  _id: string;
  firstName: string;
  lastName: string;
  passportSeries: string;
  phoneNumber: string;
  // percent: number;
  address: string;
  birthDate: Date;
  telegramName: string;
  telegramId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  managerId: string;
  manager?: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  contracts?: IContract[];
  files?: {
    passport?: string;
    shartnoma?: string;
    photo?: string;
  };
  [key: string]: any;
}

export interface IAddCustomer {
  firstName: string;
  lastName: string;
  passportSeries: string;
  phoneNumber: string;
  birthDate: Date;
  // percent: number;
  address: string;
  managerId: string;
}

export interface IEditCustomer {
  id: string;
  firstName: string;
  lastName: string;
  passportSeries: string;
  phoneNumber: string;
  birthDate: Date;
  // percent: number;
  address: string;
  managerId: string;
}
