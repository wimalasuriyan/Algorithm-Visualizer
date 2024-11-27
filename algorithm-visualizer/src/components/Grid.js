import React, { useRef } from "react";
import "../stylesheets/grid.css";
import { useState, createContext, useContext, useref } from "react";
import { ColorContext } from "../pages/HomePage.js";

export default function Grid(props) {
  let rows = props.rows;
  let cols = props.cols;
  const [color, setColor] = useContext(ColorContext);
  var redRef = useRef(null);
  var blueRef = useRef(null);

  let dragging = false;
  function handle(event) {
    // console.log("HANDLE",event.target,props.srcfocused, event.target.style.backgroundColor);
    console.log(event, event.target);
    event.preventDefault();

    if (color == "red") {
      if (redRef.current === null) {
        redRef.current = event.target;
      } else {
        redRef.current.style.backgroundColor = "white";
        redRef.current = event.target;
      }
    }
    if (color == "blue") {
      if (blueRef.current === null) {
        blueRef.current = event.target;
      } else {
        blueRef.current.style.backgroundColor = "white";
        blueRef.current = event.target;
      }
    }

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
          style={{ backgroundColor: "white", border: "solid 0.2px" }}
        ></td>
      );
    }
    tablerows.push(<tr key={"row" + row}>{tablecols}</tr>);
  }

  return (
    <div
      draggable={true}
      onDragStart={(e) => {
        e.preventDefault();
        dragging = true;
      }}
      onMouseUp={() => (dragging = false)}
      style={{
        margin: "0 auto",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      <table
        onMouseMove={(event) => {
          if (dragging) event.target.style.backgroundColor = "black";
        }}
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
