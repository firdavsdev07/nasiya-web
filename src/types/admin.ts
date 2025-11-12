import type { IRole } from "./role";

export interface IProfile {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  telegramId: string;
  role: IRole;
}
