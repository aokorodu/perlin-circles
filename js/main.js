import { createNoise3D } from "simplex-noise";
import "../css/style.css";

const noise = createNoise3D();
const w = 1000;
const h = 1000;
const r = 300;
const ns = "http://www.w3.org/2000/svg";
const circleHolder = document.querySelector("#circleHolder");
const paths = [];
let t = 0;
let hsl = `hsl(${Math.random() * 360}, 100%, 50%)`;

let smoothness = 300;
let tilt = 0;
let gap = 5;
let zoom = -100;

const startColor = document.querySelector("#startColor");
const stopColor = document.querySelector("#stopColor");
startColor.setAttribute("stop-color", hsl);
stopColor.setAttribute("stop-color", hsl);
const svg = document.querySelector("svg");
const smoothnessRange = document.querySelector("#smoothness");
const tiltRange = document.querySelector("#tilt");
tiltRange.setAttribute("value", tilt);
const gapRange = document.querySelector("#gap");
const zoomRange = document.querySelector("#zoom");

smoothnessRange.addEventListener("input", (e) => {
  smoothness = e.target.value * 10;
});

gapRange.addEventListener("input", (e) => {
  gap = parseFloat(e.target.value);
});

tiltRange.addEventListener("input", (e) => {
  console.log(e.target.value);
  tilt = parseFloat(e.target.value);
});

zoomRange.addEventListener("input", (e) => {
  zoom = -1 * (1000 - parseInt(e.target.value));
  const str = `${zoom} ${zoom} ${1000 + -2 * zoom} ${1000 + -2 * zoom}`;
  svg.setAttribute("viewBox", str);
  console.log(zoom);
});

const initPaths = (num) => {
  for (let i = 0; i < num; i++) {
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", "");
    p.setAttribute("stroke-width", 2);
    p.setAttribute("stroke-opacity", i / num);
    p.setAttribute("fill", "none");
    p.setAttribute("transform", `translate(${w / 2},${h / 2})`);
    p.setAttribute("stroke", "url(#gradient)");
    circleHolder.appendChild(p);
    paths.push(p);
  }
};
const getCirclePoints = (radius) => {
  const arr = [];
  let startAngle = 0;
  for (let i = 0; i < 360; i++) {
    const angle = (Math.PI / 180) * (startAngle + i);
    const xval = (Math.sin(angle) * radius) / smoothness;
    const yval = (Math.sin(angle) * radius) / smoothness;
    const roffset = noise(xval + t / smoothness, yval + t, t) * 40;
    const xpos = Math.sin(angle) * (radius + roffset);
    const ypos = Math.cos(angle) * (radius + roffset);
    const pt = { x: xpos, y: ypos };
    arr.push(pt);
    startAngle += 1;
    if (startAngle > 360) startAngle = 360 - startAngle;
  }

  return arr;
};

const getPathString = (array) => {
  let str = "";
  const num = array.length;
  for (let i = 0; i < num; i++) {
    if (i === 0) {
      str = `M${array[0].x},${array[0].y}`;
    } else {
      str = `${str} L${array[i].x},${array[i].y}`;
    }
  }

  str = `${str} Z`;
  return str;
};

const drawConcentricCircles = (startRadius, gap) => {
  let radius = startRadius;
  paths.forEach((path, index) => {
    const str = getPathString(getCirclePoints(radius));
    path.setAttribute("d", str);
    path.setAttribute("transform", `translate(${w / 2},${tilt * index})`);
    const newY = h / 2 - (tilt / 10) * (h / 2);
    circleHolder.setAttribute("transform", `translate(0, ${newY})`);
    radius += gap;
  });
  t += 0.01;
};

const update = () => {
  drawConcentricCircles(40, gap);
  window.requestAnimationFrame(update);
};

initPaths(70);
update();
