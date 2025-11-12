import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/config-global";

import { CashesView } from "src/sections/cash/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Kassa - ${CONFIG.appName}`}</title>
      </Helmet>

      <CashesView />
    </>
  );
}
