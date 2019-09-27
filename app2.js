var cubeRotation = 0.0;

main();

function main() {
  const canvas = document.querySelector("#glCanvas");

  const gl = canvas.getContext("webgl2");

  // vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // fragment shader program
  const fsSource = `
    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const buffers = initBuffers(gl);

  var then = 0;

  // endur teiknar scene
  function render(now) {
    now *= 0.001;   // convert-ar i sekundur
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
requestAnimationFrame(render);
}

function initBuffers(gl) {

  // byr til buffer fyrir stadsetningu kassans
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // array af stadsetningum fyrir kassann
  const positions = [
    // framhlid kassans
    -1.0, 1.0, 1.0,
    1.0,  1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,

    // bakhlid kassans
    -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // topp hlid
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // botn hlid
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // haegri hlid
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // vinstri hlid
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);

  // litir

  var faceColors = [
    [1.0, 1.0, 1.0, 1.0],   // fram: white
    [1.0, 0.0, 0.0, 1.0],   // bak: red
    [0.0, 1.0, 0.0, 1.0],   // topp: green
    [0.0, 0.0, 1.0, 1.0],   // botn: blue
    [1.0, 1.0, 0.0, 1.0],   // haegri: gulur
    [1.0, 0.0, 1.0, 1.0],   // vinstri:
  ];

  var colors = [];

  for (var j = 0; j < faceColors.length; j++) {
    const c = faceColors[j];

    // endurtekur hvern lit fjorum sinnum
    colors = colors.concat(c, c, c, c);
  }

  // buffer fyrir litina
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // thessi array define-ar hverja hlid sem tvo thrihyrninga

  const indices = [
    0, 1, 2,    0, 2, 3,      // fram hlid
    4, 5, 6,    4, 6, 7,      // bak hlid
    8, 9, 10,   8, 10, 11,    // topp hlid
    12, 13, 14,   12, 14, 15, // botn hlid
    16, 17, 18,   16, 18, 19, // haegri hlid
    20, 21, 22,   20, 22, 23, // vinstri hlid
  ];

  // sendir element array til GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  // clear-a canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(
    projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  const modelViewMatrix = mat4.create();

  // teiknar kassann
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

  // snuningur a kassa
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * .7, [0, 1, 0]);

  // segir webgl hvernig a ad taka positions fra positition
  // bufferinum inn i vertexPosition attribute-id
  {
    const numComponents = 3;    // x y z
    const type = gl.FLOAT;
    const normalize = false;    // ekki breyta values
    const stride = 0;           // hversu morg bytes til ad faerast i naesta vertex, 0 notar retta stride fyrir type og numComponents
    const offset = 0;           // byrjar a 0 i buffer

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);

    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);

    // tekur litina fra color buffer og setur i vertexColor attribute
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // segja hvada program webgl a ad nota
  gl.useProgram(programInfo.program);

  // set-ar shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // uppfaerir snunings fyrir naesta draw
  cubeRotation += deltaTime;
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // býr til shader programs

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  return shaderProgram;
}

// compile-ar shaders
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // sendir source kodann til shader object-id
  gl.shaderSource(shader, source);

  // compile-ar
  gl.compileShader(shader);

  return shader;
}
