//import Grid from '../components/Grid.js';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";

export default function App() {
  return (<div className="App" style={{backgroundColor:"black"}} >
      <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage/>}/>
            </Routes>
      </BrowserRouter>
  </div>);
}
