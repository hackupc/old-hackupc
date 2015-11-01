var GOF = require('game-of-life-logic')
var GOFRenderer = require('./game-of-life-renderer')

var dpr = window.devicePixelRatio
var CELL_EDGE = 10 * dpr
var CELLS_X = Math.ceil(window.innerWidth * dpr / CELL_EDGE)
var CELLS_Y = Math.ceil(window.innerHeight * dpr / CELL_EDGE)

var gof = new GOF(CELLS_X, CELLS_Y)
var gofRenderer = new GOFRenderer(gof, {
  cellEdge: CELL_EDGE,
  width: window.innerWidth * dpr,
  height: window.innerHeight * dpr,
  colors:[
    'white',  // dead
    '#ddd',   // alive
    '#2C31F6' // indestructible
  ]
})
document.body.appendChild(gofRenderer.canvas)
gofRenderer.canvas.style.width =  '100%'

var last = Date.now()
function renderLoop () {
  requestAnimationFrame(renderLoop)
  var now = Date.now()
  if (now - last > 100) {
    gof.tick()
    gofRenderer.render()
    last = now
  }
}
requestAnimationFrame(renderLoop)

var oldCellX = -1
var oldCellY = -1
document.addEventListener('mousemove', function (e) {
  var x = e.pageX * dpr
  var y = e.pageY * dpr
  var cellX = Math.floor(x / CELL_EDGE)
  var cellY = Math.floor(y / CELL_EDGE)
  if (cellX != oldCellX || cellY != oldCellY) {
    oldCellX = cellX
    oldCellY = cellY
    var state = gof.getCell(cellY, cellX)
    if (state !== GOF.states.INDESTRUCTIBLE) {
      console.log(GOF.states.INDESTRUCTIBLE)
      gof.setCell(cellY, cellX, GOF.states.INDESTRUCTIBLE)
      console.log(gof.getCell(cellY, cellX))
    }
  }
})
