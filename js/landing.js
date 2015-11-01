var GOF = require('game-of-life-logic')
require('pixi.js')
var GOFStage = require('./game-of-life-stage')
var TextToMatrix = require('./text-to-matrix')

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

function spriteFromText (text, size, color) {
  var textMatrix = TextToMatrix.textToMatrix(text, size, 0, 2)
  var canvas = document.createElement('canvas')
  canvas.height = textMatrix.length * CELL_EDGE
  canvas.width = textMatrix[0].length * CELL_EDGE
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = color
  for (var i = 0; i < textMatrix.length; ++i) {
    var row = textMatrix[i]
    for (var j = 0; j < row.length; ++j) {
      var n = row[j]
      if (n !== 0) {
        ctx.fillRect(j * CELL_EDGE, i * CELL_EDGE, CELL_EDGE, CELL_EDGE)
      }
    }
  }
  var texture = PIXI.Texture.fromCanvas(canvas)
  var textSprite = new PIXI.Sprite(texture)
  return textSprite
}

var header = new PIXI.Container()

var logoSprite = spriteFromText('HACKUPC', '8x14', BLUE)
logoSprite.position.y = CELL_EDGE * 6

var logoShadowSprite = new PIXI.Sprite(logoSprite.texture)
logoShadowSprite.position.y = logoSprite.position.y + CELL_EDGE
logoShadowSprite.tint = 0x1D14DC
header.addChild(logoShadowSprite)
header.addChild(logoSprite)

var dateSprite = spriteFromText('FEB 19-21', '3x5', BLUE)
header.addChild(dateSprite)

var timeSprite = spriteFromText('36H', '3x5', BLUE)
timeSprite.position.x = logoSprite.width - timeSprite.width
header.addChild(timeSprite)

var locationSprite = spriteFromText('BARCELONA', '3x5', BLUE)
locationSprite.position.y = logoSprite.position.y + logoSprite.height + CELL_EDGE * 3
header.addChild(locationSprite)

var yearSprite = spriteFromText('2016', '3x5', BLUE)
yearSprite.position.y = locationSprite.position.y
yearSprite.position.x = logoSprite.width - yearSprite.width
header.addChild(yearSprite)

var applySprite = spriteFromText('APPLY', '3x5', BLUE)
applySprite.position.y = logoSprite.position.y + logoSprite.height + CELL_EDGE * 3
//header.addChild(applySprite)

var sponsorSprite = spriteFromText('SPONSOR', '3x5', BLUE)
sponsorSprite.position.y = applySprite.position.y
sponsorSprite.position.x = logoSprite.width - sponsorSprite.width
//header.addChild(sponsorSprite)

gofStage.stage.addChild(header)

var actionsHeight = 80

header.position.x = (window.innerWidth - header.width) / 2
header.position.x -= header.position.x % CELL_EDGE

header.position.y = (window.innerHeight - header.height - actionsHeight) / 2
header.position.y -= header.position.y % CELL_EDGE

headerActions.style.width = emailInput.style.width = header.width
headerActions.style.top = (header.position.y + header.height + 2 * CELL_EDGE) + 'px'
headerActions.style.left = header.position.x + 'px'
setTimeout(function () {
  headerActions.style.transition = '0.5s, left 0.5s';
}, 0)

var headerTargetX = header.position.x
var headerTargetY = header.position.y

function onWindowResize () {
  headerTargetX = (window.innerWidth - header.width) / 2
  headerTargetX -= headerTargetX % CELL_EDGE

  headerTargetY = (window.innerHeight - header.height - actionsHeight) / 2
  headerTargetY -= headerTargetY % CELL_EDGE

  headerActions.style.top = (headerTargetY + header.height + 2 * CELL_EDGE) + 'px'
  headerActions.style.left = headerTargetX + 'px'
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
    last = now
  }

  // TODO: better interpolation
  var hp = header.position
  hp.x += (headerTargetX - hp.x) / 10
  hp.y += (headerTargetY - hp.y) / 10
  var dist = Math.abs(hp.x - headerTargetX) + Math.abs(hp.y - headerTargetY)
  if (dt > 100 || dist > 1) {
    renderer.render(gofStage.stage)
  }
}
requestAnimationFrame(renderLoop)
