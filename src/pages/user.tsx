import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/config-global";

import CustomersView from "src/sections/customer/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Mijozlar - ${CONFIG.appName}`}</title>
      </Helmet>

      <CustomersView />
    </>
  );
}
