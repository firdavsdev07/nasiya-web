import React from "react";

import ModalCurrency from "../modal/modal-currency";
import { OverviewAnalyticsView } from "./overview-analytics-view";

const DashboardView = () => (
    <>
      <OverviewAnalyticsView />
      <ModalCurrency />
    </>
  );

export default DashboardView;
