# LorenzAttractor
Check it out here : https://murf-y.github.io/LorenzAttractor
## How it works
For a given initial state, the Lorenz Attractor is a chaotic system that exhibits chaotic behavior.
it is a system of differential equations that can be used to generate a sequence of points in a 3D space.
the equations are:
$$ 
\begin{align}
x' &= \sigma (y - x) \\
y' &= x(r - z) - y \\
z' &= xy - bz
\end{align}
$$

For this specific case, the parameters are:
$$
\begin{align}
\sigma &= 10 \\
r &= 28 \\
b &= 8/3
\end{align}
$$

I used javascript canvas to draw the attractor.

More information about the Lorenz Attractor can be found here:
https://en.wikipedia.org/wiki/Lorenz_system

## Preview

<div style="display: flex; align-items:center; gap: 1.5rem" >

<img src = "assets/images/purple.png"></img>

<img src = "assets/images/green.png"></img>

<img src = "assets/images/orange.png"></img>

</div>