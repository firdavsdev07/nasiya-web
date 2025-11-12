import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/config-global";

import ConntrctView from "src/sections/seller/contract/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Shartnomalar - ${CONFIG.appName}`}</title>
      </Helmet>

      <ConntrctView />
    </>
  );
}
