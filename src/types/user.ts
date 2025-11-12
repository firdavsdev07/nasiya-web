// import type { ICourse } from "./course";
// import type { IService } from "./service";
// import type { ITutorial } from "./tutorial";

export interface IUser {
  _id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  address: string;
  passport: string;
  birthday: string;
  managerId: string;
  telegramId: string;
  // image: string;
  // role: string;
  // isActivated: boolean;
  // isApproved: boolean;
  // myCourses: UserCourse[];
  // myTutorials: UserTutorial[];
  // myServices: UserService[];
}

export interface IUserApproved {
  userId: string;
  isApproved: boolean;
}

// interface UserCourse {
//   course: ICourse;
//   hasPaid: boolean;
// }

// interface UserTutorial {
//   tutorial: ITutorial;
//   hasPaid: boolean;
// }

// interface UserService {
//   service: IService;
//   hasPaid: boolean;
// }

export interface IUserAddCourse {
  userId: string;
  course: { courseId: string; isPaid: boolean };
}

export interface IUserAddTutorial {
  userId: string;
  tutorial: { tutorialId: string; isPaid: boolean };
}
