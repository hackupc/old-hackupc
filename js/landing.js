var GOF = require('game-of-life-logic')
require('pixi.js')
var GOFStage = require('./game-of-life-stage')

var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.view)

var MAX_CELL_EDGE = Math.floor(window.innerWidth / 120)
var CELL_EDGE = Math.min(10, MAX_CELL_EDGE)
var CELLS_X = Math.ceil(window.innerWidth / CELL_EDGE)
var CELLS_Y = Math.ceil(window.innerHeight / CELL_EDGE)

var BLUE = '#2C31F6'

var gof = new GOF(CELLS_X, CELLS_Y)
var gofStage = new GOFStage(gof, {
  cellEdge: CELL_EDGE,
  colors:[
    'white',  // dead
    '#ddd',   // alive
    BLUE // indestructible
  ]
})

var header = document.querySelector('header')
function repositionHeader () {
  var width = header.clientWidth
  var height = header.clientHeight
  var x = (window.innerWidth - width) / 2
  var y = (window.innerHeight - height) / 2
  var transform = 'translate(' + x + 'px, ' + y + 'px)'
  header.style.transform = transform
  header.style.webkitTransform = transform
  setTimeout(function () {
    header.style.transition = 'transform 0.5s'
    header.style.webkitTransition = '-webkit-transform 0.5s'
  }, 0)
}

function onWindowResize () {
  var w = window.innerWidth
  var h = window.innerHeight
  //this part resizes the canvas but keeps ratio the same
  renderer.view.style.width = w + "px";
  renderer.view.style.height = h + "px";
  //this part adjusts the ratio:
  renderer.resize(w,h);
  repositionHeader()
}
window.onresize = onWindowResize
onWindowResize()

var oldCellX = -1
var oldCellY = -1
document.addEventListener('mousemove', function (e) {
  var x = e.pageX
  var y = e.pageY
  var cellX = Math.floor(x / CELL_EDGE)
  var cellY = Math.floor(y / CELL_EDGE)
  if (cellX != oldCellX || cellY != oldCellY) {
    oldCellX = cellX
    oldCellY = cellY
    var state = gof.getCell(cellY, cellX)
    if (state === GOF.states.DEAD) {
      gof.setCell(cellY, cellX, GOF.states.ALIVE)
    }
  }
})

var last = Date.now()
function renderLoop () {
  requestAnimationFrame(renderLoop)
  var now = Date.now()
  var dt = now - last
  if (dt > 100) {
    gof.tick()
    if (oldCellX !== -1 && oldCellY !== -1) {
      var cellState = gof.getCell(oldCellY, oldCellX)
      if (cellState !== GOF.states.INDESTRUCTIBLE) {
        gof.setCell(oldCellY, oldCellX, GOF.states.ALIVE)
      }
    }
    gofStage.render()
    renderer.render(gofStage.stage)
    last = now
  }
}
requestAnimationFrame(renderLoop)
