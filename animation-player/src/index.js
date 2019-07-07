import './style.css';

function App() {
  const frames = [];
  const framesTwo = [];
  const addFrames = document.getElementById('add');
  const framesWrapper = document.querySelector('.frames-wrapper');
  const frameTemplate = document.querySelector('#frame-template');
  const speedValue = document.getElementById('speed');
  const canvas = document.getElementById('myCanvas');
  const stop = document.getElementById('stop');
  let myAnimation;
  const state = {
    speed: 1,

  };

  const context = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  context.fillStyle = 'white';

  const mouse = { x: 0, y: 0 };
  let draw = false;

  canvas.addEventListener('mousedown', function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    draw = true;
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
  });
  canvas.addEventListener('mousemove', function (e) {
    if (draw === true) {
      mouse.x = e.pageX - this.offsetLeft;
      mouse.y = e.pageY - this.offsetTop;
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    }
  });
  canvas.addEventListener('mouseup', function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
    context.closePath();
    draw = false;
  });

  addFrames.addEventListener('click', e => frameDraw());

  function frameDraw(x = 1000) {
    if (x === 1000) {
      const imageData = context.getImageData(0, 0, 800, 600);
      framesTwo.push(imageData);

      const dataURL = canvas.toDataURL();
      frames.push(dataURL);

      const frameId = frames.length - 1;

      const fragment = createFrame({ url: dataURL, id: frameId });
      framesWrapper.appendChild(fragment);

      function clear() {
        context.fillStyle = 'white';
        context.fillRect(0, 0, 800, 600);
      }
      clear();
    } else {
      const imageData = framesTwo[x];
      framesTwo.push(imageData);
      const dataURL = frames[x];
      frames.push(dataURL);

      const frameId = frames.length - 1;

      const fragment = createFrame({ url: dataURL, id: frameId });
      framesWrapper.appendChild(fragment);

      function clear() {
        context.fillStyle = 'white';
        context.fillRect(0, 0, 800, 600);
        console.log(x);
      }
      clear();
    }
  }

  function createFrame(frameInfo) {
    const { url, id } = frameInfo;

    const fragment = document.createDocumentFragment();

    const newFrame = document.importNode(frameTemplate.content, true);

    const frameImage = newFrame.querySelector('.frame-image');
    const frame = newFrame.querySelector('.frame');
    frame.id = `${id}`;
    frameImage.src = url;
    frameImage.id = `${id}`;


    function frameDeleteHandler(e) {
      const elem = e.target;
      const num = (elem.classList.contains('button-delete')) ? elem.parentElement.id : elem.parentElement.parentElement.id;

      framesTwo.splice(num, 1);
      frames.splice(num, 1);
      frame.remove(e.target);
    }

    function frameCopyHandler(e) {
      const elem = e.target;
      const num = (elem.classList.contains('button-copy')) ? elem.parentElement.id : elem.parentElement.parentElement.id;
      frameDraw(num);
    }

    const frameDelete = newFrame.querySelector('.button-delete');
    frameDelete.addEventListener('click', frameDeleteHandler);

    const frameCopy = newFrame.querySelector('.button-copy');
    frameCopy.addEventListener('click', frameCopyHandler);

    fragment.appendChild(newFrame);
    return fragment;
  }

  const drawing = (x) => {
    context.clearRect(0, 0, 800, 600);
    context.putImageData(framesTwo[x], 0, 0);
  };

  document.getElementById('play').addEventListener('click', () => {
    let i = 0;
    state.speed = speedValue.valueAsNumber * 10;
    if (framesTwo.length !== 0) {
      myAnimation = setInterval(() => {
        drawing(i);
        if (i >= framesTwo.length - 1) i = 0;
        else i += 1;
      }, state.speed);
    }
    document.getElementById('play').disabled = true;
  });

  stop.addEventListener('click', stopAnimate);
  function stopAnimate() {
    clearInterval(myAnimation);
    document.getElementById('play').disabled = false;
  }


  document.getElementById('full').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen()
        .catch((err) => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      document.exitFullscreen();
    }
  });
}

document.addEventListener('DOMContentLoaded', App);
