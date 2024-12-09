import React from "react";
import Button from "react-bootstrap/Button";
import Slider from '@mui/material/Slider';

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

export default function GridPage(props) {
  const [rows, setRows] = useState(25);
  const [cols, setCols] = useState(40);
  const [msg, setMsg] = useState("");

  const [color, setColor] = useState("black"); //black for adding blocks, red for source, blue for target cell

  const algo = useRef("djik");
  const steps = useRef([]);
  const step = useRef(0);
  const requestId = useRef(-1);
  let speed = useRef(5); //simulation speed



  function fillgrid(grid) {
    let colorgrid = document.getElementById("grid");
    let row = 0;
    for (let tr of colorgrid.children) {
      let col = 0;
      for (let td of tr.children) {
        fillcell(td, grid[row][col]?"black":"white");
        col+=1;
      }
      row+=1;
    }
  }

  function unionize() {
    let grid = []
    let colorgrid = document.getElementById("grid");
    for (let tr of colorgrid.children) {
      let row = [];
      for (let td of tr.children) {
        let color = td.style.backgroundColor;
        row.push(color === "black" ? 1 : 0);
      }
      grid.push(row);
    }
    tods.unionize(grid);
    fillgrid(grid);
  }


  function fillcell(td, paint) {
    td.style.backgroundColor = paint;
  }

  function generate() {
    fillgrid(tods.randomGrid(rows, cols));   
    for (let src = 0; src < rows*cols; src++)
      if (document.getElementById(src).style.backgroundColor === "white") {
        break;
      }
  }

  function clear() {
    if (requestId.current !== -1)
      cancelAnimationFrame(requestId.current);
    steps.current = [];
    let colorgrid = document.getElementById("grid");
    if (colorgrid !== null)
    for (let tr of colorgrid.children) {
      for (let td of tr.children) {
        fillcell(td, "white");
      }
    }
  }

   function reset() {
    if (requestId.current !== -1)
      cancelAnimationFrame(requestId.current);
    steps.current = [];
    let colorgrid = document.getElementById("grid");
    for (let tr of colorgrid.children) {
      for (let td of tr.children) {
        let cellcolor = td.style.backgroundColor;
        if (cellcolor !== "black" && cellcolor !== "red" && cellcolor !== "blue") 
          fillcell(td, "white");
      }
    }
  }

    const animate = (timestamp) => {
        let adjspeed = speed.current/50;
        let oldstep = step.current;
        let newstep = step.current+adjspeed;
        step.current += adjspeed;
        if (Math.floor(newstep) > oldstep) {
          let i = Math.ceil(oldstep); 
          while (i < steps.current.length && i <= newstep) {
              document.getElementById(steps.current[i][0] + "").style.backgroundColor 
              = steps.current[i][3];
              i++;
          }
        }
        if (step.current < steps.current.length)
          requestId.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
          clear();
        };
      }, []);
 


  function traverse(event) {
    event.preventDefault();
    //let src = event.target[0].value; //source cell
    let intgrid = [];
    let src = 0;
    let dst = null;
    let colorgrid = document.getElementById("grid");
    let i = 0;
    for (let tr of colorgrid.children) {
      let row = [];
      for (let td of tr.children) {
        let color = td.style.backgroundColor;
        row.push(color === "black" ? 1 : 0);
        if (color === "red") {
          src = i;
        }
        if (color === "blue") {
          dst = i;
        }
        i++;
      }
      intgrid.push(row);
    }
    let graph = tods.gridToGraph(intgrid);
    if (algo.current === "djik")
      steps.current = graph.djikstra(src, dst)[1];
    else if (algo.current === "bfs")
      steps.current = graph.bfs(src, dst)[1];
    else if (algo.current === "dfs")
      steps.current = graph.dfs(src, dst)[1];

    step.current = 0;
    requestId.current = requestAnimationFrame(animate);
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
        backgroundColor: "white",
      }}
    >
      {msg}
      <ColorContext.Provider value={[color, setColor]}>
        <Grid rows={rows} cols={cols} />
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
          <select defaultValue="djik" onChange={event=>algo.current = event.target.value}>
         <option value="djik">Djikstra</option>
         <option value="bfs">Breadth First Search</option>
         <option value="dfs">Depth First Search</option>

       </select>

        <Button variant="secondary" onClick={traverse}>
          Traverse
        </Button>

        <Button
          style={{ marginRight: "2px" }}
          onClick={reset}
          variant="primary"
        >
          RESET
        </Button>
        <Button
          style={{ marginRight: "2px" }}
          onClick={clear}
          variant="danger"
        >
          DELETE
        </Button>
        <Button
          style={{ marginRight: "2px" }}
          onClick={generate}
          variant="primary"
        >
          GENERATE
        </Button>
        <Button
          style={{ marginRight: "2px" }}
          onClick={unionize}
          variant="primary"
        >
          UNIONIZE
        </Button>
        <Slider
        onChange={e=>speed.current = e.target.value}
        aria-label="Speed"
        defaultValue={5}
        valueLabelDisplay="auto"
        shiftStep={1}
        step={1}
        marks
        min={1}
        max={1000}
      />
              <label>i Show Speed</label>

      </div>
    </div>
  );
}
