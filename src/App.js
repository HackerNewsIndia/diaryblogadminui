import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import Counter from "./components/Counter";

const App = () => (
  <div className="container">
    <Counter />
  </div>
);

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById("app"));
};

renderApp();

if (module.hot) {
  module.hot.accept("./App", renderApp);
}
