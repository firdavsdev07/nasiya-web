import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/config-global";

import { UsersView } from "src/sections/contract/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Shartnomalar - ${CONFIG.appName}`}</title>
      </Helmet>

      <UsersView />
    </>
  );
}
