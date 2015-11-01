var GOF = require('game-of-life-logic')
var imgdye = require('imgdye')
require('pixi.js')

function GameOfLifeStage (gof, options) {
  this.gof = gof
  this.cellEdge = options.cellEdge
  this.colors = options.colors

  this.stage = new PIXI.Container()

  var cellTexture = this.generateCellTexture()
  this.colors = this.colors.map(function (color) {
    var texture = imgdye(cellTexture, color)
    var ctx = texture.getContext('2d')
    ctx.globalCompositeOperation = 'destination-atop'
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, texture.width, texture.height)
    texture = PIXI.Texture.fromCanvas(texture)
    return texture
  })

  this.sprites = []
  for (var i = 0; i < this.gof.height; ++i) {
    var row = []
    for (var j = 0; j < this.gof.width; ++j) {
      var state = Number(Math.random() > 0.9)
      this.gof.setCell(i, j, state)
      var sprite = new PIXI.Sprite()
      sprite.position.x = j * this.cellEdge
      sprite.position.y = i * this.cellEdge
      sprite.texture = this.colors[state]
      this.stage.addChild(sprite)
      row.push(sprite)
    }
    this.sprites.push(row)
  }
}

GameOfLifeStage.prototype.generateCellTexture = function GameOfLifeStage$prototype$generateCellTexture () {
  var cellTexture = document.createElement('canvas')
  cellTexture.width = cellTexture.height = this.cellEdge
  var ctx = cellTexture.getContext('2d')
  // circle
  /*
  var halfEdge = this.cellEdge / 2
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(halfEdge,halfEdge, halfEdge, 0, Math.PI*2, true)
  ctx.closePath()
  ctx.fill()
  */
  /**/
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, this.cellEdge, this.cellEdge)
  /**/
  return cellTexture
}

GameOfLifeStage.prototype.renderCell = function GameOfLifeStage$prototype$renderCell (i, j) {
  var state = this.gof.getCell(i, j)
  var oldState = this.oldMatrix && this.oldMatrix[i][j]
  if (state === oldState) {
    return
  }
  this.sprites[i][j].texture = this.colors[state]
}

GameOfLifeStage.prototype.render = function GameOfLifeStage$prototype$render () {
  for (var i = 0; i < this.gof.height; ++i) {
    for (var j = 0; j < this.gof.width; ++j) {
      this.renderCell(i, j)
    }
  }
  this.oldMatrix = this.gof.clone().matrix
}

module.exports = GameOfLifeStage
