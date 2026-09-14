import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // create a DOM with our app
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

/*document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});*/
