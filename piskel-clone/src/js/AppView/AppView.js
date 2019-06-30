import AppModel from '../AppModel/AppModel';
import GIF from '../gif.js-master/dist/gif';
import download from './functionDownlode';
import saveImage from './functionSaveImg';

export default class AppView {
  constructor() {
    this.canvas_cont = document.querySelector('.canvas');
    this.prevCanvas = document.getElementById('prevCanvas');
    this.canvas = document.getElementById('myCanvas');
    this.gridCanvas = document.getElementById('myGrid');
    this.backgroundColor = document.getElementById('myColor');
    this.context = this.canvas.getContext('2d');
    this.paint = false;
    this.color = 'black';
    this.backroundcolor = 'white';
    this.width = 10;
    this.speed = 1;
    this.active_num = null;
    this.next_layer = null;
    this.active_layer = null;
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
    this.model = new AppModel();
  }

  // grid for cnavas
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

  // store width
  changeWidth(e) {
    this.width = e.target.value;
  }

  // pen paint
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
  //-------------------

  // rectangle
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
  //--------------------

  // paint line
  upLine(e) {
    this.paint = false;
    const xCanvas = e.pageX - this.canvas_cont.offsetLeft;
    const yCanvas = e.pageY - this.canvas_cont.offsetTop;
    this.context.lineTo(xCanvas, yCanvas);
    this.context.lineWidth = this.width;
    this.context.stroke();
  }

  // paint circle
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
  //-------------

  clear() {
    this.backroundcolor = 'white';
    this.backgroundColor.style.backgroundColor = this.backroundcolor;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // frams
  frameDraw(x = 1000) {
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const dataURL = this.canvas.toDataURL();
    const date = this.model.frameDraw(x, imageData, this.backroundcolor, dataURL);
    this.createFrame(date);
    this.clear();
    document.querySelector('.lyers-wrapper').innerHTML = '';
    this.drawLayer(0);
    this.active_num = this.model.framesTwo.length - 1;
  }

  createFrame(obj = {}) {
    const newFrame = document.importNode(this.model.frameTemplate.content, true);
    const frame = newFrame.querySelector('.frame');
    frame.id = `${obj.id}`;
    frame.style.backgroundColor = this.model.frames[obj.id].background;
    let url = '';
    for (let i = 0; i < this.model.frames[obj.id].data.length; i += 1) {
      url += `url(${this.model.frames[obj.id].data[i]}),`;
    }
    url = url.slice(0, url.length - 2);
    frame.style.backgroundImage = `${url}`;
    const fragment = document.createDocumentFragment();
    const frameDelete = newFrame.querySelector('.button-delete');
    frameDelete.addEventListener('click', e => this.frameDeleteHandler(e));
    const frameCopy = newFrame.querySelector('.button-copy');
    frameCopy.addEventListener('click', e => this.frameCopyHandler(e));
    fragment.appendChild(newFrame);
    this.model.framesWrapper.appendChild(fragment);
  }

  frameDeleteHandler(e) {
    const elem = e.target;
    const num = (elem.classList.contains('button-delete')) ? elem.parentElement.id : elem.parentElement.parentElement.id;
    this.model.frameDeleteHandler(num);
    this.refactior();
  }

  frameCopyHandler(e) {
    const elem = e.target;
    const num = (elem.classList.contains('button-copy')) ? elem.parentElement.id : elem.parentElement.parentElement.id;
    this.frameDraw(num);
    this.refactiorLayers(num);
    this.goToTheFram(this.active_num);
  }

  saveFrame() {
    if (this.model.framesTwo.length !== 0) {
      const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const dataURL = this.canvas.toDataURL();
      this.model.saveFrameLayer(this.active_num, this.active_layer, imageData, this.backroundcolor, dataURL);
      this.refactior();
    }
  }

  drawing(i = 0, layer = 0) {
    this.clear();
    this.context.putImageData(this.model.framesTwo[i].img[layer], 0, 0);
    this.backgroundColor.style.backgroundColor = this.model.framesTwo[i].background;
    this.backroundcolor = this.model.framesTwo[i].background;
  }

  goToTheFram(num) {
    this.active_num = num;
    this.drawing(num, 0);
    this.refactiorLayers(num);
  }

  refactior() {
    this.model.framesWrapper.innerHTML = '';
    this.model.frames.forEach((elem, index) => {
      this.createFrame({ url: elem, id: index });
    });
  }
  //----------------------

  // layer
  addNewLayer() {
    if (this.active_num !== null) {
      const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const dataURL = this.canvas.toDataURL();
      this.model.addLayerforFrams(this.active_num, imageData, this.backroundcolor, dataURL);
      this.clear();
      this.refactior();
      this.next_layer = this.model.getNexNum(this.active_num);
      this.drawLayer(this.next_layer);
      this.active_layer = this.next_layer;
      this.active_layer = this.model.getNexNum(this.active_num);
    }
  }

  drawLayer(num) {
    const newLayer = document.importNode(this.model.layerTemplate.content, true);
    const layer = newLayer.querySelector('.layer');
    layer.id = num;
    document.querySelector('.lyers-wrapper').appendChild(newLayer);
  }

  refactiorLayers(num) {
    document.querySelector('.lyers-wrapper').innerHTML = '';
    const n = this.model.getNexNum(num);
    for (let i = 0; i <= n; i += 1) {
      this.drawLayer(i);
      this.active_layer = i;
    }
  }

  goToTheLayer(num) {
    this.active_layer = num;
    this.drawing(this.active_num, num);
  }

  deleteNewLayer() {
    if (this.model.getNexNum(this.active_num) > 0) {
      this.model.deleteLayer(this.active_num, this.active_layer);
      this.refactior();
      this.refactiorLayers(this.active_num);
    } else {
      this.model.frameDeleteHandler(this.active_num);
      this.refactior();
      this.clear();
      document.querySelector('.lyers-wrapper').innerHTML = '';
    }
  }

  layerMoving(move = 'up') {
    if (move === 'up') this.active_layer = this.model.changeLayer(this.active_num, this.active_layer, -1);
    else this.active_layer = this.model.changeLayer(this.active_num, this.active_layer, 1);
    this.goToTheLayer(this.active_layer);
  }
  //-----------------------

  // color (change, select, bucket, fullbucket, transparency)
  changeColor(e) {
    this.color = e.target.value;
  }

  selectColor(e) {
    const xCanvas = e.pageX - this.canvas_cont.offsetLeft;
    const yCanvas = e.pageY - this.canvas_cont.offsetTop;
    this.color = `rgba(${this.context.getImageData(xCanvas, yCanvas, 1, 1).data.join(', ')})`;
    return this.context.getImageData(xCanvas, yCanvas, 1, 1).data;
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

  transparency(e, str = 'light') {
    const xCanvas = e.pageX - this.canvas_cont.offsetLeft;
    const yCanvas = e.pageY - this.canvas_cont.offsetTop;
    const c = this.context.getImageData(xCanvas, yCanvas, 1, 1).data;
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === c[0] && data[i + 1] === c[1] && data[i + 2] === c[2] && data[i + 3] !== 0) {
        if (str === 'light') {
          if (data[i + 3] - 10 >= 0) data[i + 3] = data[i + 3] - 10;
          else data[i + 3] = 0;
        } else if (data[i + 3] + 10 <= 255) data[i + 3] = data[i + 3] + 10;
        else data[i + 3] = 255;
      }
    }
    this.context.putImageData(imageData, 0, 0);
  }
  //---------------------------

  // play frams
  changeSpeed(e) {
    this.speed = 1000 / e.target.value;
  }

  drawingMin(i) {
    let url = '';
    for (let j = 0; j < this.model.frames[i].data.length; j += 1) {
      url += `url(${this.model.frames[i].data[j]}),`;
    }
    url = url.slice(0, url.length - 2);
    this.prevCanvas.style.backgroundImage = `${url}`;
    this.prevCanvas.style.backgroundColor = this.model.frames[i].background;
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
  //------------------

  // transform
  turn() {
    this.clear();
    const img = new Image();
    img.src = this.model.frames[this.active_num].data[this.active_layer];
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
    img.src = this.model.frames[this.active_num].data[this.active_layer];
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
  //------------

  // move
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
    this.saveFrame();
  }
  //---------------------

  // show coordinats
  showCoordinates(e) {
    document.querySelector('.coordinates').innerHTML = '';
    document.querySelector('.coordinates').innerHTML = `<p class="coordinates_data">${(e.pageX - this.canvas_cont.offsetLeft) / 64}/${(e.pageX - this.canvas_cont.offsetLeft) / 64}</p>`;
  }

  // saving
  saveCanvasAsImageFile() {
    const imageData = this.canvas.toDataURL();
    const image = new Image();
    image.src = imageData;
    saveImage(image);
  }

  PrevAnimation(){
    const dataURL = this.canvas.toDataURL();
    this.model.addEndFrams(dataURL);
    this.model.addEndFrams(dataURL);
    for (let i = 0; i < this.model.frames.length; i += 1){
      let len = this.model.frames[i].data.length;
      for (let j = 0; j < len; j += 1){
        this.context.fillStyle = this.model.frames[i].background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const newImg = new Image();
        newImg.src = this.model.frames[i].data[j];
        this.context.drawImage(newImg, 0, 0);
      }
      const dataURL = this.canvas.toDataURL();
      this.model.addEndFrams(dataURL);
      this.clear();
    }
  }

  saveAnimation() {
    this.PrevAnimation();
    const gif = new GIF({
       workers: 2,
       quality: 1,
       width: 644,
      height: 454,
    });
    for (let i = 0; i < this.model.framsAnim.length; i += 1) {
      const newImg = new Image();
      newImg.src = this.model.framsAnim[i];
      gif.addFrame(newImg, {
        delay: this.speed,
      });
    }
    let resultGif;
    gif.render();
    gif.on('finished', (blob) => {
      resultGif = URL.createObjectURL(blob);
      console.log(resultGif);
      download(resultGif);
    });
    this.model.clearFrams();
  }
}
