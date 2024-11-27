import React from "react";
import Button from "react-bootstrap/Button";

import {
  Component,
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
} from "react";
import Grid from "../components/Grid.js";
var tods = require("../backend/tods.js");

export const ColorContext = createContext();

export default function HomePage(props) {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [msg, setMsg] = useState("");

  const [color, setColor] = useState("black"); //black for adding blocks, red for source, blue for target cell

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  function djik_traverse(event) {
    event.preventDefault();
    //let src = event.target[0].value; //source cell
    let intgrid = [];
    let src = 0;
    let dst = null;
    let colorgrid = document.getElementById("grid");
    let i = 0;
    for (let tr of colorgrid.children[0].children) {
      let row = [];
      for (let td of tr.children) {
        let color = td.style.backgroundColor;
        row.push(color == "black" ? 1 : 0);
        if (color == "red") {
          src = i;
        }
        if (color == "blue") {
          duplicate();
          dst = i;
        }
        i++;
      }
      intgrid.push(row);
    }
    let graph = tods.gridToGraph(intgrid);
    let steps = graph.djikstra(src, dst)[1];

    console.log(steps.length);

    function showstep(step, i) {
      setTimeout(function () {
        //console.log("step[0]:",step[0]);
        document.getElementById(step[0] + "").style.backgroundColor = step[3];
      }, 10 * i);
    }
    let j = 0;
    for (let step of steps) {
      //console.log(step[0]+"");
      showstep(step, j);
      j++;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let r = event.target[0].value;
    let c = event.target[1].value;
    if (r * c <= 50000) {
      setRows(r);
      setCols(c);
      setMsg("Grid created. Happy traversing");
    } else {
      setMsg("Table is too big, maximum 50000 cells allowed");
    }
  }
  function duplicate() {
    //If there is a duplicate source/goal.
    console.log("bro");
  }

  return (
    <div
      id="root"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "yellow",
      }}
    >
      {msg}
      <ColorContext.Provider value={[color, setColor]}>
        <Grid rows={39} cols={39} />
      </ColorContext.Provider>

      <div
        style={{
          position: "fixed",
          bottom: 10,
          padding: "10px",
          width: "100%",
          zIndex: 1050, // Ensures it stays above most elements
          backgroundColor: "white",
          border: "solid 0.5px",
          width: "400px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "6px",
        }}
      >
        <Button
          style={{ marginRight: "2px" }}
          onClick={(e) => setColor("red")}
          variant="danger"
        >
          SELECT SOURCE
        </Button>
        <Button
          style={{ marginRight: "2px" }}
          variant="primary"
          onClick={(e) => setColor("blue")}
        >
          SELECT GOAL
        </Button>
        <Button variant="secondary" onClick={djik_traverse}>
          Traverse
        </Button>
      </div>
    </div>
  );
}
