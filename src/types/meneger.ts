export interface IMeneger {
  _id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  telegramId: string;
  clientCount: number;
  totalDebt: number;
  kpi: number;
}

export interface IAddMeneger {
  full_name: string;
  refId: string;
  phone_number: string;
}

export interface IEditMeneger {
  full_name: string;
  refId: string;
  phone_number: string;
  // status: boolean;
}
