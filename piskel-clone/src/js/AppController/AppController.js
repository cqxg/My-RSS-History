import AppView from '../AppView/AppView';
import rgb2hex from './functions';
import hexToRgb from './functions1';
import '../../css/style.css';

export default class AppController {
  constructor() {
    this.view = new AppView();
    this.dones = ['turn', 'clone', 'mirror', 'bucket-full', 'bucket', 'lighten', 'blackout', 'pipette', 'pen', 'line', 'eraser', 'rectngle', 'stroke-rectngle', 'circle', 'stroke-circle', 'play', 'stop', 'full', 'save', 'add', 'move', 'save_ses', 'addLayer'];
    this.do = 'pen';
    this.was = 'pen';
    this.tools = document.querySelector('.tools');
    this.player = document.querySelector('.play-wrapper');
    this.framsControl = document.querySelector('.button-wrapper');
    this.transformControl = document.querySelector('.transform-tool');
    document.getElementById('get_color').addEventListener('change', e => this.view.changeColor(e));
    document.getElementById('speed').addEventListener('change', e => this.view.changeSpeed(e));

    document.querySelector('.addLayer').addEventListener('click', () => this.view.addNewLayer());
    document.querySelector('.layer-delete').addEventListener('click', () => this.view.deleteNewLayer());
    document.querySelector('.layerUp').addEventListener('click', () => this.view.layerMoving('up'));
    document.querySelector('.layerDown').addEventListener('click', () => this.view.layerMoving('down'));

    document.querySelector('.saveImg').addEventListener('click', () => this.view.saveCanvasAsImageFile());
    document.querySelector('.saveAnimation').addEventListener('click', () => this.view.saveAnimation());

    document.addEventListener('keypress', event => this.setTool(event));

    this.tools.addEventListener('click', (e) => {
      this.done(e);
      if (this.do === 'pen' || this.do === 'eraser' || this.do === 'line' || this.do === 'circle' || this.do === 'stroke-circle' || this.do === 'stroke-rectngle' || this.do === 'rectngle') {
        document.getElementById('range-wrapper').style.display = 'block';
        // eslint-disable-next-line no-shadow
        document.getElementById('width').addEventListener('change', e => this.view.changeWidth(e));
      } else {
        document.getElementById('range-wrapper').style.display = 'none';
      }
    });

    this.framsControl.addEventListener('click', (e) => {
      this.done(e);
      if (this.do === 'add') {
        this.do = this.was;
        this.view.frameDraw();
      }
      if (this.do === 'save') {
        this.do = this.was;
        this.view.saveFrame();
      }
    });

    this.player.addEventListener('click', (e) => {
      this.done(e);
      if (this.do === 'play') {
        this.view.playFrams();
        this.do = this.was;
        document.querySelector('.play').disabled = true;
      }
      if (this.do === 'stop') {
        document.querySelector('.play').disabled = false;
        this.do = this.was;
        this.view.stopPlay();
      }
      if (this.do === 'full') {
        this.do = this.was;
        this.view.fullScreen();
      }
    });

    this.transformControl.addEventListener('click', (e) => {
      this.done(e);
      if (this.do === 'turn') this.view.turn();
      if (this.do === 'clone') this.view.clone();
      if (this.do === 'mirror') this.view.mirror();
      this.do = this.was;
    });

    this.view.canvas.addEventListener('click', (e) => {
      if (this.do === 'bucket-full') this.view.bucketFull(hexToRgb(this.view.color));
      if (this.do === 'bucket') this.view.bucket(e, hexToRgb(this.view.color));
      if (this.do === 'pipette') {
        document.getElementById('get_color').value = rgb2hex(this.view.selectColor(e));
      }
      if (this.do === 'lighten') this.view.transparency(e);
      if (this.do === 'blackout') this.view.transparency(e, 'blackout');
    });

    this.view.canvas.addEventListener('mousemove', (e) => {
      this.view.showCoordinates(e);
    });

    this.view.canvas.addEventListener('mouseout', () => {
      document.querySelector('.coordinates').innerHTML = '';
    });

    this.view.canvas.addEventListener('mousedown', (e) => {
      if (this.do === 'pen') this.view.down(e);
      if (this.do === 'line') this.view.down(e);
      if (this.do === 'eraser') this.view.down(e);
      if (this.do === 'circle' || this.do === 'stroke-circle') this.view.downCircle(e);
      if (this.do === 'rectngle' || this.do === 'stroke-rectngle') this.view.downRectangle(e);
      if (this.do === 'move') this.view.downCanvas(e);
    });

    this.view.canvas.addEventListener('mousemove', (e) => {
      if (this.do === 'pen') this.view.move(e);
      if (this.do === 'eraser') this.view.move(e, 'eraser');
      if (this.do === 'circle' || this.do === 'stroke-circle') this.view.moveCircle(e);
      if (this.do === 'rectngle' || this.do === 'stroke-rectngle') this.view.moveRectangle(e);
      if (this.do === 'move') this.view.moveCanvas(e);
    });

    this.view.canvas.addEventListener('mouseup', (e) => {
      if (this.do === 'pen') this.view.up();
      if (this.do === 'line') this.view.upLine(e);
      if (this.do === 'eraser') this.view.up();
      if (this.do === 'circle') this.view.upCircle();
      if (this.do === 'stroke-circle') this.view.upCircle('stroke');
      if (this.do === 'rectngle') this.view.upRectangle();
      if (this.do === 'stroke-rectngle') this.view.upRectangle('stroke');
      if (this.do === 'move') this.view.upCanvas();
    });

    this.view.model.framesWrapper.addEventListener('click', (e) => {
      if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'I') {
        e.stopPropagation();
      } else {
        const num = e.target.id;
        this.view.goToTheFram(num);
      }
    });

    this.view.model.layerWrapper.addEventListener('click', (e) => {
      const num = e.target.id;
      if (num !== null) this.view.goToTheLayer(num);
    });
  }

  done(e) {
    const elem = (e.target.classList.contains('material-icons') || e.target.nodeName === 'IMG') ? e.target.parentElement.className : e.target.className;
    this.was = (this.do !== 'add' || this.do !== 'save' || this.do !== 'play' || this.do !== 'stop' || this.do !== 'full' || this.do !== 'clone' || this.do !== 'turn') ? this.do : this.was;
    this.do = (this.dones.indexOf(elem) !== -1) ? elem : 'pen';
  }

  setTool(event) {
    if (event.keyCode === 49) {
      this.do = 'pen';
    } else if (event.keyCode === 50) {
      this.do = 'line';
    } else if (event.keyCode === 51) {
      this.do = 'eraser';
    } else if (event.keyCode === 52) {
      this.do = 'bucket-full';
    } else if (event.keyCode === 53) {
      this.do = 'bucket';
    } else if (event.keyCode === 54) {
      this.do = 'pipette';
    } else if (event.keyCode === 55) {
      this.do = 'blackout';
    } else if (event.keyCode === 56) {
      this.do = 'lighten';
    } else if (event.keyCode === 57) {
      this.do = 'rectngle';
    } else if (event.keyCode === 58) {
      this.do = 'stroke-rectngle';
    }
  }
}

const controller = new AppController();
document.addEventListener('DOMContentLoaded', controller.init);
