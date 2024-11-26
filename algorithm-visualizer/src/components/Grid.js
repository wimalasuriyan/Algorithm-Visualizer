import React from "react";
import "../stylesheets/grid.css";
import { useState, createContext, useContext } from "react";
import { ColorContext } from "../pages/HomePage.js";

export default function Grid(props) {
  let rows = props.rows;
  let cols = props.cols;
  const [color, setColor] = useContext(ColorContext);

  let dragging = false;
  function handle(event) {
    // console.log("HANDLE",event.target,props.srcfocused, event.target.style.backgroundColor);
    console.log(event, event.target);
    event.preventDefault();

      if (event.target.style.backgroundColor !== "white")
        event.target.style.backgroundColor = "white";
      else if (event.target.style.backgroundColor === "white") {
        event.target.style.backgroundColor = color;
        setColor("black");
      }
  }

  let tablerows = [];
  for (let row = 0; row < rows; row++) {
    let tablecols = [];
    for (let col = 0; col < cols; col++) {
      tablecols.push(
        <td
          key={row * cols + col}
          id={row * cols + col}
          style={{ backgroundColor: "white", border: "solid" }}
        ></td>
      );
    }
    tablerows.push(<tr key={"row"+row}>{tablecols}</tr>);
  }

  return (
    <div
      draggable={true} onDragStart={e=>{e.preventDefault(); dragging=true;}} onMouseUp={()=>dragging=false}
      style={{
        margin: "0 auto",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      <table onMouseMove={event=>{if (dragging) event.target.style.backgroundColor="black";}} 
      onClick={handle}
        style={{
          backgroundColor: "black",
          width: "100%",
          height: "100%",
        }}
        id="grid"
      >
        <tbody>{tablerows}</tbody>
      </table>
    </div>
  );
}
