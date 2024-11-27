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

export default function HomePage(props) {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [msg, setMsg] = useState("");

  const [color, setColor] = useState("black"); //black for adding blocks, red for source, blue for target cell

  const algo = useRef("djik");
  const steps = useRef([]);
  const step = useRef(0);
  const requestId = useRef(-1);
  let speed = useRef(5); //simulation speed

  function clear() {
    if (requestId.current !== -1)
      cancelAnimationFrame(requestId.current);

    let colorgrid = document.getElementById("grid");
    for (let tr of colorgrid.children[0].children) {
      for (let td of tr.children) {
        td.style.backgroundColor = "white";
      }
    }
}

      const animate = (timestamp) => {
        let i = step.current; 
        while (i < steps.current.length && i < step.current+speed.current) {
            document.getElementById(steps.current[i][0] + "").style.backgroundColor 
            = steps.current[i][3];
            i+=1;
       }
        step.current = i;
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
    for (let tr of colorgrid.children[0].children) {
      let row = [];
      for (let td of tr.children) {
        let color = td.style.backgroundColor;
        row.push(color == "black" ? 1 : 0);
        if (color == "red") {
          src = i;
        }
        if (color == "blue") {
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
          onClick={(e) =>{steps.current=[]; clear();}}
          variant="danger"
        >
          CLEAR
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
        max={25}
      />
              <label>i Show Speed</label>

      </div>
    </div>
  );
}
