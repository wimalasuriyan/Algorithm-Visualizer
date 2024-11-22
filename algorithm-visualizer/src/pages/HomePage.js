import React from "react";
import { Component, useState, useEffect, useContext, useRef } from "react";
import Grid from "../components/Grid.js";
var tods = require("../backend/tods.js");

export default function HomePage(props) {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [msg, setMsg] = useState("");

  const [srcfocused, setsrcfocus] = useState(false);

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  function djik_traverse(event) {
    event.preventDefault();
    //let src = event.target[0].value; //source cell
    let intgrid = [];
    let src = 0;
    let colorgrid = document.getElementById("grid");
    let i = 0;
    for (let tr of colorgrid.children[0].children) {
      let row = [];
      for (let td of tr.children) {
        let color = td.style.backgroundColor;
        row.push(color == "black" ? 1 : 0);
        if (color == "red") src = i;
        i++;
      }
      intgrid.push(row);
    }
    let graph = tods.gridToGraph(intgrid);
    let steps = graph.djikstra(src)[1];

    console.log(steps.length);

    function showstep(step, i) {
      setTimeout(function () {
        document.getElementById(step[0] + "").style.backgroundColor = step[3];
      }, 500 * i);
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
      <Grid
        srcfocused={srcfocused}
        setsrcfocus={setsrcfocus}
        rows={50}
        cols={50}
      />
      <br />
      <br />
      DJIKSTRA TRAVERSAL
      <br />
      <button onClick={(e) => setsrcfocus(true)}>SELECT SOURCE</button>
      <button type="submit" onClick={djik_traverse}>
        Traverse
      </button>
    </div>
  );
}
