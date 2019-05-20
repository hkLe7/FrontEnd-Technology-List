
function main() {
  // example.1
  // var canvas = document.getElementById('webgl')
  // var ctx = canvas.getContext('2d')

  // ctx.fillStyle = 'rgba(255, 0, 0, 1.0)'
  // ctx.fillRect(120, 10, 150, 150)

  // example.2
  var canvas = document.getElementById('webgl')
  var gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Fail to get the rendering context for WebGL')
    return
  }
  // 指定清空<canvas>的颜色
  gl.clearColor(0.68, 0.0, 1.0, 1.0)
  // 清空<canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // example.3
}