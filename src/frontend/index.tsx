import Main from "./main";
import React from "react";
import ReactDOM from "react-dom";

const root = document.createElement("div");
document.body.appendChild(root);
root.id = "root";

ReactDOM.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>,
    root
);

