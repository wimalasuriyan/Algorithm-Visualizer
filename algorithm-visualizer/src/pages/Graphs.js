import React from "react";
import Button from "react-bootstrap/Button";
import Slider from '@mui/material/Slider';
import { ArcherContainer, ArcherElement } from 'react-archer';

import {
  Component,
  useState,
  useEffect,
  useContext,
  useRef,
  createRef,
  forwardRef,
  createContext,
} from "react";


var tods = require("../backend/tods.js");
var ds = require("../backend/ds.js");

const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = { margin: '20px 0', display: 'flex', justifyContent: 'space-between' };
const boxStyle = { padding: '10px', border: '1px solid black' };

var count = 0;
export default function GraphPage(props) {
  const graph = useRef(new ds.Graph([],[]));
  const [trig, trigger] = useState(false);
  const [color, setColor] = useState("black"); //black for adding blocks, red for source, blue for target cell

  let speed = useRef(5); //simulation speed
  const algo = useRef("djik");
  const steps = useRef([]);
  const step = useRef(0);
  const frameId = useRef(-1);
  const src = useRef(null);
  const dst = useRef(null);
  let nodecount = Array.from(graph.current.adj_list.keys()).length;

  useEffect(()=>{
    updatenodes(5);
    trigger(!trig);
  },[]);

  function fillcell(nodeid, paint) {
    let node = document.getElementById("node"+nodeid);
    node.style.fill = paint;
  }

  function updatenodes(newnodes) {
    src.current = 0;
    dst.current = 0;
    if (newnodes >= 2) {
      document.getElementById("nodes").value = newnodes;
      let nodevals = [];
      for (let nodeno=0; nodeno<newnodes;nodeno++) nodevals.push(nodeno);
      graph.current = tods.toGraph(nodevals,[]);
      trigger(!trig);
   }
   else
    updatenodes(2);
  }

  function clear() {
    if (frameId.current !== -1)
      cancelAnimationFrame(frameId.current);
    steps.current = [];
    src.current = 0;
    dst.current = 0;
    updatenodes(2); //deletes all edges
    updatenodes(5);
  }

  const animate = (timestamp) => {
    let adjspeed = speed.current/50;
    let oldstep = step.current;
    let newstep = step.current+adjspeed;
    step.current += adjspeed;
    if (Math.floor(newstep) > oldstep) {
      let i = Math.ceil(oldstep); 
      while (i < steps.current.length && i <= newstep) {
          document.getElementById("node"+steps.current[i][0] + "").style.color 
          = steps.current[i][4];
         // if (steps.current[i][1])
          //  document.getElementById("edge"+steps.current[i][1]).style.color = steps.current[i][4]; 
          i++;
      }
    }
    if (step.current < steps.current.length)
      frameId.current = requestAnimationFrame(animate);
};

function reset() {
  if (frameId.current !== -1)
    cancelAnimationFrame(frameId.current);
  steps.current = [];
  for (let i = 0; i < nodecount; i++) {
    let node = document.getElementById("node"+i);
    let cellcolor = node.style.color;    
    if (cellcolor !== "red" && cellcolor !== "blue") 
      fillcell(i, "white");
  }
}

function traverse(event) {
    event.preventDefault();
    let srcval = src.current?src.current:0;
    let dstval = dst.current?dst.current:1;
    console.log(algo.current, "src:",srcval, "dst:",dstval, "graph!:", graph.current.adj_list);
    if (algo.current === "djik")
      steps.current = graph.current.djikstra(srcval, dstval)[1];
    else if (algo.current === "bfs")
      steps.current = graph.current.bfs(srcval, dstval)[1];
    else if (algo.current === "dfs")
      steps.current = graph.current.dfs(srcval, dstval)[1];
    console.log("algo traversed:",srcval,"->",dstval,"[",steps.current.length,"]", steps.current);
    step.current = 0;
    frameId.current = requestAnimationFrame(animate);
  }

  function handle(event) {
    event.preventDefault();
    if (color === "red") {
      let newsrc = (event.target.id+"").substring(4);
      let oldsrc = document.getElementById("node"+src.current);
      if (oldsrc !== null) {
        oldsrc.style.backgroundColor = "white";
      }
      src.current = Math.floor(newsrc);
      document.getElementById("node"+src.current).style.fill=color;
    }
    if (color === "blue") {
      let newdst = (""+event.target.id).substring(4);
      let olddst = document.getElementById("node"+dst.current);
      if (olddst !== null) {
        olddst.style.backgroundColor = "white";
      }
      dst.current = Math.floor(newdst);
      document.getElementById("node"+dst.current).style.fill=color;
    }

    setColor("white");
  }


  useEffect(()=>{

    return () => {
      clear();
    };
  },[]);

  function addEdge(e) {
    e.preventDefault();
    let node1 = Math.floor(e.target[0].value);
    let node2 = Math.floor(e.target[1].value);
    let weight = Math.floor(e.target[2].value);
    graph.current.adj_list.get(node1).push(new ds.GraphEdge(node1, node2, weight));
    trigger(!trig);
  }

  let spacing = window.innerWidth/(nodecount+1);
 // console.log("refreshed",nodecount, count++);
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
      }}
    >
    <h2>GRAPHS</h2>

    <div>
    <form onSubmit={e=>{e.preventDefault(); updatenodes(e.target[0].value);}}>
    <label htmlFor="nodes">Nodes</label>
    <input id="nodes" name="nodes" style={{width:"50px"}}/>
    <button type="submit">Enter</button>
    </form>


    </div>
      
      <div style={{margin: '50px'}}>
      <ArcherContainer>
      <div style={rowStyle}>
      {Array.from(graph.current.adj_list.keys()).map((nodeval,nodeno)=>(  
        <div key={"arrow"+nodeno}>
        <ArcherElement style={{marginTop:nodeno*50}}
         id={"arrow"+nodeno}
              relations={graph.current.adj_list.get(nodeval).map(edge=>(
              {
                id:"edge"+edge.node1+""+edge.node2+""+edge.weight,
                targetId: 'arrow'+(edge.node2),
                targetAnchor: edge.node2>edge.node1?'left':'right',
                sourceAnchor: edge.node2>edge.node1?'bottom':'top',
                label:<p style={{alignment:"center", 
                marginTop: edge.node2>edge.node1?(edge.node2-edge.node1)*18:(edge.node2-edge.node1)*18, 
                color:"red"}}>{edge.node2}</p>
              })
              )}
          >
          <div onClick={handle} style={{marginTop:nodeno*40}}>
          <svg  height="50px" width="50px" xmlns="http://www.w3.org/2000/svg">
            <circle
            id={"node"+nodeno} cx="25px" cy="25px" r="20px" style={{fill:"white",
            stroke:"black", strokeWidth:"3"}}/>
            <text style={{pointerEvents:"none"}} x="50%" y="50%" textAnchor="middle" stroke="black" 
            strokeWidth="2px" dy=".3em">{nodeval}</text>

          </svg>

          </div>
        </ArcherElement>
        </div>
        ))
      }
      </div>
        </ArcherContainer>
        </div>
     
        <form onSubmit={addEdge}>
      <label htmlFor="srcnode">Source:</label>
      <input required defaultValue="0" name="srcnode" style={{width:"50px"}}/><br/>
      <label htmlFor="dstnode">Target:</label>
      <input required name="dstnode" style={{width:"50px"}}/><br/>
      <label htmlFor="weight">Weight:</label>
      <input required defaultValue="1" name="weight" style={{width:"50px"}}/><br/>
      <button type="submit">ADD</button>
    </form>

    <div
        style={{
          /*position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",=
*/
          bottom: 10,
          padding: "10px",
          margin:"0 auto",
          width: "100%",
          zIndex: 1050, // Ensures it stays above most elements
          backgroundColor: "white",
          border: "solid 0.5px",
          width: "400px",
          borderRadius: "6px",
        }}
      >
        <Button
          style={{ marginRight: "2px" }}
          onClick={(e)=>{setColor("red");}}
          variant="danger"
        >
          SELECT SOURCE
        </Button>
        <Button
          style={{ marginRight: "2px" }}
          variant="primary"
          onClick={(e) => {setColor("blue");}}
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

//<div key={"nodediv"+nodeno} style={{marginLeft:(nodeno+1)*spacing, justifyContent:'center', display: 'flex'}}> 