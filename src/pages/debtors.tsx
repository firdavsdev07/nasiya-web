import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/config-global";

import { UsersView } from "src/sections/debtor/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Qarzdorlar - ${CONFIG.appName}`}</title>
      </Helmet>

      <UsersView />
    </>
  );
}
