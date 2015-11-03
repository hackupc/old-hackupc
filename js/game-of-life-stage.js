/* globals PIXI */
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
  this.width = this.height = 0
  this.resize(this.gof.width, this.gof.height)
}

GameOfLifeStage.prototype.resize = function GameOfLifeStage$prototype$resize (width, height) {
  var i, j, row, state, sprite
  var newWidth = Math.ceil(width / this.cellEdge)
  var newHeight = Math.ceil(height / this.cellEdge)

  if (this.width < newWidth) {
    for (i = 0; i < this.height; ++i) {
      row = this.sprites[i]
      for (j = this.width; j < newWidth; ++j) {
        state = this.gof.getCell(i, j)
        sprite = new PIXI.Sprite()
        sprite.position.x = j * this.cellEdge
        sprite.position.y = i * this.cellEdge
        sprite.texture = this.colors[state]
        this.stage.addChild(sprite)
        row.push(sprite)
      }
    }
  }
  this.width = newWidth

  if (this.height < newHeight) {
    for (i = this.height; i < newHeight; ++i) {
      row = []
      for (j = 0; j < this.width; ++j) {
        state = this.gof.getCell(i, j)
        sprite = new PIXI.Sprite()
        sprite.position.x = j * this.cellEdge
        sprite.position.y = i * this.cellEdge
        sprite.texture = this.colors[state]
        this.stage.addChild(sprite)
        row.push(sprite)
      }
      this.sprites.push(row)
    }
  }
  this.height = newHeight
  this.forceRepaint = true
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
  var oldState = this.oldGOF && this.oldGOF.getCell(i, j)
  if (!this.forceRepaint && state === oldState) {
    return
  }
  this.sprites[i][j].texture = this.colors[state]
}

GameOfLifeStage.prototype.render = function GameOfLifeStage$prototype$render () {
  for (var i = 0; i < this.height; ++i) {
    for (var j = 0; j < this.width; ++j) {
      this.renderCell(i, j)
    }
  }
  this.oldGOF = this.gof.clone()
  this.forceRepaint = false
}

module.exports = GameOfLifeStage
