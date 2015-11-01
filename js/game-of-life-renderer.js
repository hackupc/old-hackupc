var GOF = require('game-of-life-logic')
var imgdye = require('imgdye')

function GameOfLifeRenderer (gof, options) {
  this.gof = gof
  this.cellEdge = options.cellEdge
  this.colors = options.colors

  this.canvas = document.createElement('canvas')
  this.canvas.width = options.width
  this.canvas.height = options.height
  this.ctx = this.canvas.getContext('2d')

  for (var i = 0; i < this.gof.height; ++i) {
    for (var j = 0; j < this.gof.width; ++j) {
      var state = Number(Math.random() > 0.8)
      this.gof.setCell(i, j, state)
    }
  }

  var cellTexture = this.generateCellTexture()
  debugger
  this.colors = this.colors.map(function (color) {
    var texture = imgdye(cellTexture, color)
    var ctx = texture.getContext('2d')
    ctx.globalCompositeOperation = 'destination-atop'
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, texture.width, texture.height)
    return texture
  })
}

GameOfLifeRenderer.prototype.generateCellTexture = function GameOfLifeRenderer$prototype$generateCellTexture () {
  var cellTexture = document.createElement('canvas')
  cellTexture.width = cellTexture.height = this.cellEdge
  var ctx = cellTexture.getContext('2d')
  /* circle
  var halfEdge = this.cellEdge / 2
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(halfEdge,halfEdge, halfEdge, 0, Math.PI*2, true)
  ctx.closePath()
  ctx.fill()
  */
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, this.cellEdge, this.cellEdge)
  return cellTexture
}

GameOfLifeRenderer.prototype.renderCell = function GameOfLifeRenderer$prototype$renderCell (i, j) {
  var state = this.gof.getCell(i, j)
  var oldState = this.oldMatrix && this.oldMatrix[i][j]
  if (state === oldState) {
    return
  }
  this.ctx.drawImage(this.colors[state], j * this.cellEdge, i * this.cellEdge)
}

GameOfLifeRenderer.prototype.render = function GameOfLifeRenderer$prototype$render () {
  for (var i = 0; i < this.gof.height; ++i) {
    for (var j = 0; j < this.gof.width; ++j) {
      this.renderCell(i, j)
    }
  }
  this.oldMatrix = this.gof.clone().matrix
}

module.exports = GameOfLifeRenderer
