// import { Label } from "src/components/label";
import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    width="100%"
    height="100%"
    src={`/assets/icons/navbar/${name}.svg`}
  />
);

export const navData = {
  admin: [
    {
      title: "Dashboard",
      path: "/admin",
      icon: icon("ic-analytics"),
    },
    {
      title: "Xodimlar",
      path: "/admin/employee",
      icon: icon("ic-meneger"),
    },
    {
      title: "Mijozlar",
      path: "/admin/user",
      icon: icon("ic-user"),
    },
    {
      title: "Shartnomalar",
      path: "/admin/contract",
      icon: icon("ic-debt"),
    },
    {
      title: "Qarzdorlar",
      path: "/admin/debtors",
      icon: icon("ic-contact"),
    },
    {
      title: "Kassa",
      path: "/admin/cash",
      icon: icon("ic-cash"),
    },
  ],
  moderator: [
    {
      title: "Dashboard",
      path: "/moderator",
      icon: icon("ic-analytics"),
    },
    {
      title: "Xodimlar",
      path: "/moderator/employee",
      icon: icon("ic-meneger"),
    },
    {
      title: "Mijozlar",
      path: "/moderator/user",
      icon: icon("ic-user"),
    },
    {
      title: "Shartnomalar",
      path: "/moderator/contract",
      icon: icon("ic-debt"),
    },
    {
      title: "Qarzdorlar",
      path: "/moderator/debtors",
      icon: icon("ic-contact"),
    },
    {
      title: "Kassa",
      path: "/moderator/cash",
      icon: icon("ic-cash"),
    },
  ],
  seller: [
    // {
    //   title: "Dashboard",
    //   path: "/seller",
    //   icon: icon("ic-analytics"),
    // },
    {
      title: "Mijozlar",
      path: "/seller",
      icon: icon("ic-user"),
    },
    {
      title: "Shartnomalar",
      path: "/seller/contract",
      icon: icon("ic-debt"),
    },
  ],
  manager: [
    {
      title: "Dashboard",
      path: "/manager",
      icon: icon("ic-analytics"),
    },
    {
      title: "Mijozlar",
      path: "/manager/user",
      icon: icon("ic-user"),
    },
    {
      title: "Shartnomalar",
      path: "/manager/contract",
      icon: icon("ic-debt"),
    },
    {
      title: "Qarzdorlar",
      path: "/manager/debtors",
      icon: icon("ic-contact"),
    },
    {
      title: "Kassa",
      path: "/manager/cash",
      icon: icon("ic-cash"),
    },
  ],
  no: [],

  // {
  //   title: "Darslar",
  //   path: "/tutorials",
  //   icon: icon("ic-blog"),
  // },
  // {
  //   title: "Xizmatlar",
  //   path: "/service",
  //   icon: icon("ic-service"),
  // },
  // {
  //   title: "Kanal savdosi",
  //   path: "/channel",
  //   icon: icon("ic-channel"),
  // },

  // {
  //   title: "Sign in",
  //   path: "/sign-in",
  //   icon: icon("ic-lock"),
  // },
  // {
  //   title: "Not found",
  //   path: "/404",
  //   icon: icon("ic-disabled"),
  // },
} as const;
