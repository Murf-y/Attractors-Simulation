function getRandomColor(){
    var r = Math.floor(Math.random() * 256)
    var g = Math.floor(Math.random() * 256)
    var b = Math.floor(Math.random() * 256)
    var color = "rgb(" + r + "," + g + "," + b + ")"
    return color
}

export default getRandomColor;