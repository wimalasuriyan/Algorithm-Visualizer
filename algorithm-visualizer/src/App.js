//import Grid from '../components/Grid.js';
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GridPage from "./pages/Grids";
import Navbar from "./Navbar.js";
import HomePage from "./pages/HomePage.js";
import GraphPage from "./pages/Graphs.js";


export default function App() {
  return (
    <div className="App" style={{ backgroundColor: "white", minHeight: "100vh"}}>
    <BrowserRouter>
    <div>
    <Navbar/>
    <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="graphs" element={<GraphPage/>} />
        <Route path="grids" element={<GridPage/>} />
        <Route path="*" element={<HomePage/>} />
      </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}
