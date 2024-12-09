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
  

  return (
    <div
      id="root"
      style={{
        position: "absolute",
        width: "100vw",
        backgroundColor: "white",
      }}
    >
    <br/>
    <h1>THIS IS THE HOME OF CHIGGAS</h1>
    HELLO
    </div>
  );
}
