import AppModel from '../AppModel/AppModel';

export default class AppView {
  constructor() {
    this.canvas_cont = document.querySelector('.canvas');
    this.prevCanvasImg = document.getElementById('prevCanvas_img');
    this.prevCanvas = document.getElementById('prevCanvas');
    this.canvas = document.getElementById('myCanvas');
    this.backgroundColor = document.getElementById('myColor');
    this.context = this.canvas.getContext('2d');
    this.paint = false;
    this.model = new AppModel();
    this.color = 'black';
    this.backroundcolor = 'white';
    this.width = 10;

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
  };

  frameDeleteHandler(e) {
    const elem = e.target;
    this.model.frameDeleteHandler(elem);
    this.refactior();
  };

  frameCopyHandler(e) {
    const elem = e.target;
    const num = this.model.frameCopyHandler(elem);
    this.frameDraw(num);
  };

  saveFrame() {
    if (this.model.framesTwo.length !== 0) {
      const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const dataURL = this.canvas.toDataURL();
      this.model.saveFrame(this.active_num, imageData, this.backroundcolor, dataURL);
      this.refactior();
    }
  };

  goToTheFram(num) {
    this.active_num = num;
    this.drawing(num);
  };

};
