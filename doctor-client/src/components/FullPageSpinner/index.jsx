import React from "react";

export default ({ message }) => {
  return (
    <div id="originalmy-pageloader-plugin">
      <div className="loader" id="loader-1"></div>
      <p
        id="originalmy-pageloader-text"
        className="originalmy-pageloader-plugin__text"
      >
        {message}
      </p>
    </div>
  );
};
