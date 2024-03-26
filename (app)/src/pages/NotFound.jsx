import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h4>Page not found</h4>
    </div>
  );
}

export default NotFound;