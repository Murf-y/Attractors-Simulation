import getRandomColor from '../js/colors.js'
import attractors from '../js/attractors.js'

const canvas = document.getElementById('canvas')
const navbar = document.getElementById('navbar')
canvas.width = window.innerWidth
canvas.height = window.innerHeight - navbar.clientHeight;
const ctx = canvas.getContext('2d')


const dt = 0.01

const FPS = 60
const scale_factor = Math.min(canvas.width, canvas.height) / 2 - 10


var q = 0
var a = canvas.width/7
var b = canvas.width/6
var c = canvas.width/2


let paths = []
let colors = []
let chosenAttractorFunction = attractors[0]

const attractorChoice = document.getElementById('attractorChoice')
attractorChoice.addEventListener('change', (e) => {
  updatePaths()
  chosenAttractorFunction = attractors[e.target.value - 1]
})

const numberOfPathsBox = document.getElementById("numberOfPathsBox")
const numberOfPathsSlider = document.getElementById("numberOfPathsSlider")
var number_of_paths = numberOfPathsBox.value;
updatePaths()

numberOfPathsBox.addEventListener('change', (e) => {
  if(e.target.value >= 0 && e.target.value <= 10){
    number_of_paths = e.target.value
    updatePaths()
  }
})
numberOfPathsSlider.addEventListener('input', (e) => {
  if(e.target.value >= 0){
    number_of_paths = e.target.value
    updatePaths()
  }
})

const speedBox = document.getElementById("speedBox")
const speedSlider = document.getElementById("speedSlider")
var steps_per_frame = speedBox.value
speedBox.addEventListener('change', (e) => {
  if(e.target.value >= 0 && e.target.value <= 15){
    steps_per_frame = e.target.value
    updatePaths()
  }
})
speedSlider.addEventListener('input', (e) => {
  if(e.target.value >= 0){
    steps_per_frame = e.target.value
    updatePaths()
  }
})



const densityBox = document.getElementById('densityBox')
const densitySlider = document.getElementById('densitySlider')
var duration_till_replace_path = densityBox.value;
densityBox.addEventListener('change', (e) => {
    if(e.target.value > 0 && e.target.value  <= 100000) duration_till_replace_path = e.target.value
})
densitySlider.addEventListener('input', (e) => {
    if(e.target.value > 0) duration_till_replace_path = e.target.value
})



const rotationBox = document.getElementById('rotationBox')
const rotationSlider = document.getElementById('rotationSlider')
var rotation_speed = rotationBox.value;
rotationSlider.addEventListener('input', (e) => {
    if(e.target.value >= 0 && e.target.value <= 1) {
        rotation_speed = e.target.value
    } 
})
rotationBox.addEventListener('change', (e) => {
    if(e.target.value >= 0) {
        rotation_speed = e.target.value
    }
})


function updatePaths(){
  paths = []
  colors = []
  let epsilon_base = Math.random() - Math.random()
  for(var i = 0; i < number_of_paths; i++){
    let epsilon = epsilon_base + (Math.random() - 0.01) * 0.001
    let withing_point_epsilon = (Math.random() - 0.01) * 0.001
    paths.push([{x: epsilon + withing_point_epsilon ,y: epsilon +  withing_point_epsilon,z: epsilon + withing_point_epsilon}])
    colors.push(getRandomColor());
  }
}


function extendPath(path, steps){
  for(var i = 0 ; i < steps; i++){
    const lastP = path[path.length - 1]
    const p = chosenAttractorFunction(lastP, dt)
    path.push(p)
  }
  return path
}

function scale(points, size){
  const mx = Math.min(...points.slice(1).map( ({x,y,z}) => x) )
  const Mx = Math.max(...points.slice(1).map( ({x,y,z}) => x) )
  const my = Math.min(...points.slice(1).map( ({x,y,z}) => y) )
  const My = Math.max(...points.slice(1).map( ({x,y,z}) => y) )
  const mz = Math.min(...points.slice(1).map( ({x,y,z}) => z) )
  const Mz = Math.max(...points.slice(1).map( ({x,y,z}) => z) )

  const s = (v, mv, Mv) => size * (v - mv) / (Mv - mv)
  return points.slice(1).map( ({x,y,z}) => {
    x=s(x, mx, Mx)
    y=s(y, my, My)
    z=s(z, mz, Mz)
    return {x, y, z}
  })
}


function draw(path, i){
  if(q > 2 * Math.PI) q = 0
  const map = ({x,y,z}) => [(x - a)*Math.cos(q) - (y - b)*Math.sin(q) + c, z]
  ctx.beginPath();
  ctx.strokeStyle = colors[i]
  path.slice(1).map(map).forEach( p => ctx.lineTo(p[0], p[1]))
  ctx.stroke()
}


function update(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  q -= rotation_speed
  for(var i = 0 ; i < paths.length; i++){
    paths[i] = extendPath(paths[i], steps_per_frame)
    draw(scale(paths[i], scale_factor), i)
    while(paths[i].length > duration_till_replace_path) paths[i].shift()
  }
}

function main(){
    resize()
    setInterval(update, 1000/FPS)
}
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - navbar.clientHeight;
    a = canvas.width/7
    b = canvas.width/6
    c = canvas.width/2
}
window.addEventListener('resize', resize, false); 
main()