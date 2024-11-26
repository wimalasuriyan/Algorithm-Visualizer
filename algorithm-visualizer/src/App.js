//import Grid from '../components/Grid.js';
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./Navbar.js";

export default function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div style={{ backgroundColor: "black" }}>
        <HomePage />
      </div>
    </div>
  );
}
