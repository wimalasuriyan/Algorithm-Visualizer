import React from "react";
import "../stylesheets/grid.css";

export default function Grid(props) {

  let rows = props.rows;
  let cols = props.cols;

  function handle(event) {
   // console.log("HANDLE",event.target,props.srcfocused, event.target.style.backgroundColor);
    event.preventDefault();
    if (props.srcfocused) {
      if (event.target.style.backgroundColor === "red")
        event.target.style.backgroundColor="white";
      else if (event.target.style.backgroundColor === "white") {
        event.target.style.backgroundColor="red";
        props.setsrcfocus(false);
      }
    }
    else {
      if (event.target.style.backgroundColor === "black")
        event.target.style.backgroundColor="white";
      else if (event.target.style.backgroundColor === "white")
        event.target.style.backgroundColor="black";
      else if (event.target.style.backgroundColor === "red")
        event.target.style.backgroundColor="white";
    }
  }

  let tablerows = [];
  for (let row = 0; row < rows; row++) {
      let tablecols = [];
      for (let col = 0; col < cols; col++) {
        tablecols.push(<td key={row*cols+col} id={row*cols+col} style={{backgroundColor:"white"}} onClick={handle}></td>);
      }
      tablerows.push(<tr>{tablecols}</tr>);
  }
  
  return (
      <div
      style={{
        margin: "0 auto",
        width: "98vw",
      }}
    >
    <table id="grid">
    <tbody>
        {tablerows}
    </tbody>
    </table>
    </div>
  );
}


/*
        grid.push(<>|{row},{col}</>)


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
  );*/