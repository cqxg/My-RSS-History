import AppModel from '../AppModel/AppModel';

export default class AppView {
  constructor() {
    this.canvas_cont = document.querySelector('.canvas');
    this.prevCanvasImg = document.getElementById('prevCanvas_img');
    this.prevCanvas = document.getElementById('prevCanvas');
    this.canvas = document.getElementById('myCanvas');
    this.gridCanvas = document.getElementById('myGrid');
    this.backgroundColor = document.getElementById('myColor');
    this.context = this.canvas.getContext('2d');
    this.paint = false;
    this.model = new AppModel();
    this.color = 'black';
    this.backroundcolor = 'white';
    this.width = 10;
    this.speed = 1;
    this.active_num = null;
    this.img = {
      img: null,
      posX: 0,
      poxY: 0,
    };
    // eslint-disable-next-line no-unused-expressions
    this.myAnimation;
    this.circle = {
      x1: 0,
      y1: 0,
      y2: 0,
      x2: 0,
    };
    this.rect = {
      startX: 0,
      startY: 0,
      w: 0,
      h: 0,
    };
    this.grid = {
      cellsNumberX: 64,
      cellsNumberY: 64,
      lineX: this.canvas.width / 64,
      lineY: this.canvas.height / 64,
    };
    this.Grid();
  }

  Grid() {
    const contx = this.gridCanvas.getContext('2d');
    contx.strokeStyle = '#808080';
    let buf = 0;
    for (let i = 0; i <= this.grid.cellsNumberX; i += 1) {
      contx.beginPath();
      contx.moveTo(buf, 0);
      contx.lineTo(buf, this.canvas.height);
      contx.stroke();
      buf += this.grid.lineX;
    }
    buf = 0;
    for (let j = 0; j <= this.grid.cellsNumberY; j += 1) {
      contx.beginPath();
      contx.moveTo(0, buf);
      contx.lineTo(this.canvas.width, buf);
      contx.stroke();
      buf += this.grid.lineY;
    }
  }

  down(e) {
    this.paint = true;
    this.context.beginPath();
    const xCanvas = (e.pageX - this.canvas_cont.offsetLeft);
    const yCanvas = (e.pageY - this.canvas_cont.offsetTop);
    this.context.moveTo(xCanvas, yCanvas);
  }

  move(e, str = 'pen') {
    if (this.paint === true) {
      const xCanvas = e.pageX - this.canvas_cont.offsetLeft;
      const yCanvas = e.pageY - this.canvas_cont.offsetTop;
      this.context.lineTo(xCanvas, yCanvas);
      this.context.lineWidth = this.width;
      if (str === 'pen') this.context.strokeStyle = this.color;
      else this.context.globalCompositeOperation = 'destination-out';
      this.context.stroke();
    }
  }

  up() {
    this.paint = false;
    this.context.globalCompositeOperation = 'source-over';
  }

  clear() {
    this.backroundcolor = 'white';
    this.backgroundColor.style.backgroundColor = this.backroundcolor;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  frameDraw(x = 1000) {
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const dataURL = this.canvas.toDataURL();
    const date = this.model.frameDraw(x, imageData, this.backroundcolor, dataURL);
    this.createFrame(date);
    this.clear();
  }

  createFrame(obj = {}) {
    const newFrame = document.importNode(this.model.frameTemplate.content, true);
    const frameImage = newFrame.querySelector('.frame-image');
    const frame = newFrame.querySelector('.frame');

    frame.id = `${obj.id}`;
    frameImage.src = this.model.frames[obj.id].data;
    frame.style.backgroundColor = this.model.frames[obj.id].background;

    const fragment = document.createDocumentFragment();
    const frameDelete = newFrame.querySelector('.button-delete');
    frameDelete.addEventListener('click', e => this.frameDeleteHandler(e));
    const frameCopy = newFrame.querySelector('.button-copy');
    frameCopy.addEventListener('click', e => this.frameCopyHandler(e));
    fragment.appendChild(newFrame);
    this.model.framesWrapper.appendChild(fragment);
    this.active_num = this.model.framesTwo.length - 1;
  }

  refactior() {
    this.model.framesWrapper.innerHTML = '';
    this.model.frames.forEach((elem, index) => {
      this.createFrame({ url: elem, id: index });
    });
  }

  frameDeleteHandler(e) {
    const elem = e.target;
    this.model.frameDeleteHandler(elem);
    this.refactior();
  }

  frameCopyHandler(e) {
    const elem = e.target;
    const num = this.model.frameCopyHandler(elem);
    this.frameDraw(num);
  }

  saveFrame() {
    if (this.model.framesTwo.length !== 0) {
      const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const dataURL = this.canvas.toDataURL();
      this.model.saveFrame(this.active_num, imageData, this.backroundcolor, dataURL);
      this.refactior();
    }
  }

  goToTheFram(num) {
    this.active_num = num;
    this.drawing(num);
  }

  changeColor(e) {
    this.color = e.target.value;
  }

  selectColor(e) {
    const xCanvas = e.pageX - this.canvas_cont.offsetLeft;
    const yCanvas = e.pageY - this.canvas_cont.offsetTop;
    this.color = `rgba(${this.context.getImageData(xCanvas, yCanvas, 1, 1).data.join(', ')})`;
    return this.context.getImageData(xCanvas, yCanvas, 1, 1).data;
  }

  changeWidth(e) {
    this.width = e.target.value;
  }

  changeSpeed(e) {
    this.speed = 1000 / e.target.value;
  }

  bucketFull() {
    this.backgroundColor.style.backgroundColor = this.color;
    this.backroundcolor = this.backgroundColor.style.backgroundColor;
  }

  bucket(e, color_rgb = { b: 0, g: 0, r: 0 }) {
    const xCanvas = e.pageX - this.canvas_cont.offsetLeft;
    const yCanvas = e.pageY - this.canvas_cont.offsetTop;
    const c = this.context.getImageData(xCanvas, yCanvas, 1, 1).data;
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === c[0] && data[i + 1] === c[1] && data[i + 2] === c[2]) {
        data[i] = color_rgb.r;
        data[i + 1] = color_rgb.g;
        data[i + 2] = color_rgb.b;
      }
    }
    this.context.putImageData(imageData, 0, 0);
  }

  upLine(e) {
    this.paint = false;
    const xCanvas = e.pageX - this.canvas_cont.offsetLeft;
    const yCanvas = e.pageY - this.canvas_cont.offsetTop;
    this.context.lineTo(xCanvas, yCanvas);
    this.context.lineWidth = this.width;
    this.context.stroke();
  }

  rectangle(status) {
    this.context.fillStyle = this.color;
    this.context.lineWidth = this.width;
    if (status === 'stroke') this.context.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
    else this.context.fillRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
  }

  downRectangle(e) {
    this.rect.startX = e.pageX - this.canvas_cont.offsetLeft;
    this.rect.startY = e.pageY - this.canvas_cont.offsetTop;
    this.paint = true;
  }

  moveRectangle(e) {
    if (this.paint) {
      this.rect.w = (e.pageX - this.canvas_cont.offsetLeft) - this.rect.startX;
      this.rect.h = (e.pageY - this.canvas_cont.offsetTop) - this.rect.startY;
    }
  }

  upRectangle(status = 'none') {
    this.rectangle(status);
    this.paint = false;
  }

  paintCircle(status) {
    const radiusX = (this.x2 - this.x1) * 0.5;
    const radiusY = (this.y2 - this.y1) * 0.5;
    const centerX = this.x1 + radiusX;
    const centerY = this.y1 + radiusY;
    const step = 0.01;
    this.context.beginPath();
    this.context.lineWidth = this.width;
    this.context.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0));
    for (let a = step; a < Math.PI * 2 - step; a += step) {
      this.context.lineTo(centerX + radiusX * Math.cos(a), centerY + radiusY * Math.sin(a));
    }
    this.context.closePath();
    if (status === 'stroke') {
      this.context.strokeStyle = this.color;
      this.context.stroke();
    } else {
      this.context.fillStyle = this.color;
      this.context.fill();
    }
  }

  downCircle(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.x1 = e.clientX - rect.left;
    this.y1 = e.clientY - rect.top;
    this.paint = true;
  }

  moveCircle(e) {
    if (!this.paint) return;
    const rect = this.canvas.getBoundingClientRect();
    this.x2 = e.clientX - rect.left;
    this.y2 = e.clientY - rect.top;
  }

  upCircle(status = 'none') {
    this.paintCircle(status);
    this.paint = false;
  }

  drawing(i) {
    this.clear();
    this.context.putImageData(this.model.framesTwo[i].img, 0, 0);
    this.backgroundColor.style.backgroundColor = this.model.framesTwo[i].background;
    this.backroundcolor = this.model.framesTwo[i].background;
  }

  drawingMin(i) {
    this.prevCanvasImg.src = this.model.frames[i].data;
    this.prevCanvasImg.style.backgroundColor = this.model.frames[i].background;
  }

  playFrams() {
    let i = 0;
    if (this.model.framesTwo.length !== 0) {
      this.myAnimation = setInterval(() => {
        this.drawingMin(i);
        if (i >= this.model.framesTwo.length - 1) i = 0;
        else i += 1;
      }, this.speed);
    }
  }

  stopPlay() {
    clearInterval(this.myAnimation);
  }

  fullScreen() {
    if (!document.fullscreenElement) {
      this.prevCanvas.requestFullscreen()
        .catch((err) => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      document.exitFullscreen();
    }
  }

  turn() {
    this.clear();
    const img = new Image();
    img.src = this.model.frames[this.active_num].data;
    this.context.save();
    this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
    this.context.rotate(Math.PI / 2);
    this.context.drawImage(img, -(img.width / 2), -(img.height / 2));
    this.context.restore();

    this.context.resetTransform();
    this.saveFrame();
  }

  clone() {
    this.model.cloneFram(this.active_num);
    this.refactior();
  }

  mirror() {
    this.clear();
    const img = new Image();
    img.src = this.model.frames[this.active_num].data;
    this.context.drawImage(img, img.width, 0);
    this.context.save();
    this.context.translate(img.width, 0);
    this.context.scale(-1, 1);
    this.context.drawImage(img, 0, 0);
    this.context.restore();
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    this.context.resetTransform();
    this.saveFrame();
  }

  //   centering() {
  //     this.clear();

  //     const imageData = this.context.getImageData(0, 0, 700, 500).data;
  //     this.context.getImageData(0, 0, 1, 1).data;
  //     console.dir(imageData[0]);

  //     this.context.resetTransform();
  //     this.saveFrame();
  //   }

  showCoordinates(e) {
    document.querySelector('.coordinates').innerHTML = '';
    document.querySelector('.coordinates').innerHTML = `<p class="coordinates_data">${(e.pageX - this.canvas_cont.offsetLeft) / 64}/${(e.pageX - this.canvas_cont.offsetLeft) / 64}</p>`;
  }

  downCanvas(e) {
    this.paint = true;
    this.img.img = new Image();
    const dataURL = this.canvas.toDataURL();
    this.img.img.src = dataURL;
    this.img.posX = e.pageX - this.canvas_cont.offsetLeft;
    this.img.posY = e.pageY - this.canvas_cont.offsetTop;
  }

  moveCanvas(e) {
    if (this.paint === true) {
      this.clear();
      const dx = e.pageX - this.canvas_cont.offsetLeft - this.img.posX;
      const dy = e.pageY - this.canvas_cont.offsetTop - this.img.posY;
      this.context.drawImage(this.img.img, dx, dy);
    }
  }

  upCanvas() {
    this.paint = false;
  }
}
