import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/config-global";

import { EmployeessView } from "src/sections/employee/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Xodimlar - ${CONFIG.appName}`}</title>
      </Helmet>

      <EmployeessView />
    </>
  );
}
