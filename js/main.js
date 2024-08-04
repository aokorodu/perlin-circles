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
let multiplier = 300;
let hsl = `hsl(${Math.random() * 360}, 50%, 50%)`;

const initPaths = (num) => {
  for (let i = 0; i < num; i++) {
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", "");
    p.setAttribute("stroke", hsl);
    p.setAttribute("stroke-width", 2);
    p.setAttribute("stroke-opacity", i / num);
    p.setAttribute("fill-opacity", 0.3);
    p.setAttribute("fill", "none");
    p.setAttribute("transform", `translate(${w / 2},${9 * i})`);

    circleHolder.appendChild(p);
    paths.push(p);
  }
};
const getCirclePoints = (radius) => {
  const arr = [];
  let startAngle = 0;
  for (let i = 0; i < 360; i++) {
    const angle = (Math.PI / 180) * (i + startAngle);
    const xval = (Math.sin(angle) * radius) / multiplier;
    const yval = (Math.sin(angle) * radius) / multiplier;
    const roffset = noise(xval + t / multiplier, yval + t, t) * 40;
    const xpos = Math.sin(angle) * (radius + roffset);
    const ypos = Math.cos(angle) * (radius + roffset);
    const pt = { x: xpos, y: ypos };
    arr.push(pt);
    startAngle += 1;
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
  t += 0.01;
};

const update = () => {
  drawConcentricCircles(40, 5);
  window.requestAnimationFrame(update);
};

initPaths(70);
update();
