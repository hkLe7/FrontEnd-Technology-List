// 顶点着色器
const shifter = '\n';
var VSHADER_SOURCE = `void main() {${shifter}
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);${shifter}
  gl_PointSize = 10.0;${shifter}
}${shifter}`;

// 片元着色器
var FSHADER_SOURCE = `void main(){${shifter}
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);${shifter}
}${shifter}`;

function main() {
  var canvas = document.getElementById('webgl')
  var gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Fail')
    return
  }
  // 初始化着色器
  if (!initShaders (gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Fail')
  }

  // 设置<canvas>背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // 清空<canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  //绘制点
  gl.drawArrays(gl.POINTS, 0, 1)
}