import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import {Provider} from "react-redux";
import Page from "./Page.js";

function Index() {
  if (window.location.hash === "#old_bb") {
    return <App/>
  } else {
    return <Page/>
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Index/>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
