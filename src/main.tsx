/* eslint-disable import/no-extraneous-dependencies */
import { Suspense } from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./app";
import { store } from "./store";
import { ThemeProvider } from "./theme/theme-provider";

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={5}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Suspense>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </Suspense>
        </SnackbarProvider>
      </Provider>
    </BrowserRouter>
  </HelmetProvider>
);
