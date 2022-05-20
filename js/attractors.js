function lorenz({x,y,z}, dt){
  
    const sigma = 10
    const rho = 28
    const beta = 8/3
    x += (sigma*(y-x)) * dt
    y += (x*(rho-z) - y)*dt
    z += (x*y - beta*z)*dt
    return {x,y,z}
}


function halvorsen({x,y,z}, dt){
  const a = 1.4
  x += (- a * x - 4 * y - 4 * z - (y*y) ) * dt
  y += (- a * y - 4 * z - 4 * x - (z*z) )   * dt
  z += (- a * z - 4 * x - 4 * y - (x*x) ) * dt
  return {x,y,z}
}

function newton_leipnik({x,y,z}, dt){
  const a = 0.4
  const b = 0.175
  const c = 10
  const d = 5
  x += (- a * x + y + c * y * z ) * dt
  y += (- x - a * y + d * x * z ) * dt
  z += (b * z - d * x * y ) * dt
  return {x,y,z}
}


function threeCellsCNN({x,y,z}, dt){
  const p1 = 1.24
  const p2 = 1.1
  const r = 4.4
  const s = 3.21

  let h1 = 1/2 * (abs(x+1) - abs(x-1))
  let h2 = 1/2 * (abs(y+1) - abs(y-1))
  let h3 = 1/2 * (abs(z+1) - abs(z-1))

  x+= ( -x + p1 * h1 - s * h2 - s * h3 ) * dt
  y+= ( -y - s * h1 + p2 * h2 - r * h3 ) * dt
  z+= ( -z - s * h1 + r * h2 +  h3 ) * dt
  return {x,y,z}
}

function aizawa({x,y,z}, dt){
    const a = 0.95
    const b = 0.7
    const c = 0.6
    const d = 3.5
    const e = 0.25
    const f = 0.1

    x += ((z - b)*x - d * y) * dt
    y += (d*x + (z-b)*y) * dt
    z += (c + a*z - (z*z*z)/3 - (x*x + y*y)*(1 + e*z) + f*z*(x*x*x)) * dt
    return {x,y,z}
}
function arneodo({x,y,z}, dt){
    const a = -5.5
    const b = 3.5
    const c = -1.0

    x += (y) * dt
    y += (z) * dt
    z += (-a*x -b*y -z +c*(x*x*x)) * dt
    return {x,y,z}
}
function burke_shaw({x,y,z}, dt){
    const s = 10
    const v = 4.272

    x += (-s*(x+y)) * dt
    y += (-y-s*x*z) * dt
    z += (s*x*y + v) * dt

    return {x,y,z}
}
function finance({x,y,z}, dt){
    const a = 0.001
    const b = 0.2
    const c = 1.1


    x += ((1/b  - a)*x +z+ x*y) * dt
    y += (-b*y - x*x) * dt
    z += (-x - c*z) * dt

    return {x,y,z}
}

function rucklidge({x,y,z}, dt){
    const k = 2
    const a = 6.7
    x += (-k*x +a*y -y*z) * dt
    y += (x) * dt
    z += (-z + y*y) * dt
    return {x,y,z}
}

function sprott_linz_a({x,y,z}, dt){
    x += (y) * dt
    y += (-x +y*z) * dt
    z += (1-y*y) * dt
    return {x,y,z}
}

function sprott_linz_e({x,y,z}, dt){
    const a = 4
    x += (y*z) * dt
    y += (x*x - y) * dt
    z += (1 - a*x) * dt
    return {x,y,z}
}

function sprott_linz_j({x,y,z}, dt){
    const a = 2
    x += (a*z) * dt
    y += (- a*y + z) * dt
    z += (-x + y*y + y) * dt
    return {x,y,z}
}

function sprott_linz_l({x,y,z}, dt){
    const a = 3.9
    const b = 0.9
    x += (y + a*z) * dt
    y += (b*x*x - y) * dt
    z += (1-x) * dt
    return {x,y,z}
}

function sprott_linz_r({x,y,z}, dt){
    const a = 0.9
    const b = 0.4
    x += (a - y) * dt
    y += (b + z) * dt
    z += (x*y - z) * dt
    return {x,y,z}
}

function sprott_linz_s({x,y,z}, dt){
    const a = 4
    x += (-x -a*y) * dt
    y += (x + z*z) * dt
    z += (1 + x) * dt
    return {x,y,z}
}


function thomas({x,y,z}, dt){
    const b = 0.19

    x += (-b*x + Math.sin(y)) * dt
    y += (-b*y + Math.sin(z)) * dt
    z += (-b*z + Math.sin(x)) * dt

    return {x,y,z}
}
function yu_wang({x,y,z}, dt){
    const a = 10
    const b = 40
    const c = 2
    const d = 2.5

    x += (a*(y-x)) * dt
    y += (b*x - c*x*z) * dt
    z += (Math.pow(Math.E, x*y) -d*z) * dt

    return {x,y,z}
}

function zhou_chen({x,y,z}, dt){
    const a = 2.97
    const b = 0.15
    const c = -3
    const d = 1
    const e = -8.78

    x += (a*x +b*y +y*z) * dt
    y += (c*y -x*z +d*y*z) * dt
    z += (e*z -x*y) * dt

    return {x,y,z}
}

function multi_sprott({x,y,z}, dt){
    const a = 2.5
    const b = 1.5

    x += (a*(y - x)) * dt
    y += (x*z) * dt
    z += (b - y*y) * dt

    return {x,y,z}
}

function abs(x){
  return Math.abs(x)
}


var attractors = [lorenz,
    halvorsen,
    threeCellsCNN,
    newton_leipnik,
    aizawa,
    arneodo,
    burke_shaw,
    finance,
    rucklidge,
    sprott_linz_a,
    sprott_linz_e,
    sprott_linz_j,
    sprott_linz_l,
    sprott_linz_r,
    sprott_linz_s,
    thomas,
    yu_wang,
    zhou_chen,
    multi_sprott]
export default attractors