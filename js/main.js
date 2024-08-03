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
let multiplier = 150;

const initPaths = (num) => {
  for (let i = 0; i < num; i++) {
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", "");
    p.setAttribute("stroke", "white");
    p.setAttribute("stroke-width", 1);
    p.setAttribute("stroke-opacity", 0.5);
    p.setAttribute("fill-opacity", 0.3);
    p.setAttribute("fill", "none");
    p.setAttribute("transform", `translate(${w / 2},${h / 2})`);

    circleHolder.appendChild(p);
    paths.push(p);
  }
};
const getCirclePoints = (radius) => {
  const arr = [];
  for (let i = 0; i < 360; i++) {
    const angle = (Math.PI / 180) * i;
    const xval = (Math.sin(angle) * radius) / 200;
    const yval = (Math.sin(angle) * radius) / 200;
    const roffset =
      noise(xval + t / multiplier, yval + t / multiplier, t / multiplier) * 40;
    const xpos = Math.sin(angle) * radius;
    const ypos = Math.cos(angle) * (radius + roffset);
    const pt = { x: xpos, y: ypos };
    arr.push(pt);
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
  paths.forEach((path) => {
    const str = getPathString(getCirclePoints(radius));
    path.setAttribute("d", str);
    radius += gap;
  });
  t += 1;
};

const update = () => {
  drawConcentricCircles(100, 5);
  window.requestAnimationFrame(update);
};

initPaths(30);
update();
