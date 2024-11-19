import React from "react";
import Cell from "./Cell.js";

const Grid = () => {
  var renderedItems = [];

  for (var i = 0; i < 9000; i++) {
    renderedItems.push(<Cell></Cell>);
  }
  return (
    <div
      style={{
        margin: "0 auto",
        width: "98vw",
        height: "88vh",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(100,1fr)",
          gridTemplateRows: "repeat(90, 1fr)",
          height: "100%",
          width: "100%",
          gap: "1.2px",
        }}
      >
        {renderedItems}
      </div>
    </div>
  );
};

export default Grid;
