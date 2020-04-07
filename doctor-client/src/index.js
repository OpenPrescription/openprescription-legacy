import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import AppProviders from "./contexts";
import Layout from "./components/Layout";
import "./helpers/i18n";
import "./helpers/polyfill";

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <Layout>
        <App />
      </Layout>
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
