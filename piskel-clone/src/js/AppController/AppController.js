import AppView from '../AppView/AppView';
import rgb2hex from './componentToHex';
import hexToRgb from './hexToRgb';
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
        document.getElementById('width').addEventListener('change', e => this.view.changeWidth(e));
      } else {
        document.getElementById('range-wrapper').style.display = 'none';
      }
    });

    this.framsControl.addEventListener('click', (e) => {
      this.done(e);
      switch (this.do) {
        case 'add':
          this.do = this.was;
          this.view.frameDraw();
          break;

        case 'save':
          this.do = this.was;
          this.view.saveFrame();
          break;
      }
    });

    this.player.addEventListener('click', (e) => {
      this.done(e);
      switch (this.do) {
        case 'play':
          this.view.playFrams();
          this.do = this.was;
          document.querySelector('.play').disabled = true;
          break;

        case 'stop':
          document.querySelector('.play').disabled = false;
          this.do = this.was;
          this.view.stopPlay();
          break;

        case 'full':
          this.do = this.was;
          this.view.fullScreen();
          break;
      }
    });

    this.transformControl.addEventListener('click', (e) => {
      this.done(e);
      switch (this.do) {
        case 'turn':
          this.view.turn();
          break;

        case 'clone':
          this.view.clone();
          break;

        case 'mirror':
          this.view.mirror();
          break;
      }
      this.do = this.was;
    });

    this.view.canvas.addEventListener('click', (e) => {
      switch (this.do) {
        case 'bucket-full':
          this.view.bucketFull(hexToRgb(this.view.color));
          break;

        case 'bucket':
          this.view.bucket(e, hexToRgb(this.view.color));
          break;

        case 'pipette':
          document.getElementById('get_color').value = rgb2hex(this.view.selectColor(e));
          break;

        case 'lighten':
          this.view.transparency(e);
          break;

        case 'blackout':
          this.view.transparency(e, 'blackout');
          break;

      }
    });

    this.view.canvas.addEventListener('mousemove', (e) => {
      this.view.showCoordinates(e);
    });

    this.view.canvas.addEventListener('mouseout', () => {
      document.querySelector('.coordinates').innerHTML = '';
    });

    this.view.canvas.addEventListener('mousedown', (e) => {
      switch (this.do) {
        case 'pen':
          this.view.down(e);
          break;

        case 'line':
          this.view.down(e);
          break;

        case 'eraser':
          this.view.down(e);
          break;

        case 'circle':
          this.view.downCircle(e);
          break;

        case 'stroke-circle':
          this.view.downCircle(e);
          break;

        case 'rectngle':
          this.view.downRectangle(e);
          break;

        case 'stroke-rectngle':
          this.view.downRectangle(e);
          break;

        case 'move':
          this.view.downCanvas(e);
          break;

      }
    });

    this.view.canvas.addEventListener('mousemove', (e) => {
      switch (this.do) {
        case 'pen':
          this.view.move(e);
          break;

        case 'eraser':
          this.view.move(e, 'eraser');
          break;

        case 'circle':
          this.view.moveCircle(e);
          break;

        case 'stroke-circle':
          this.view.moveCircle(e);
          break;

        case 'rectngle':
          this.view.moveRectangle(e);
          break;

        case 'stroke-rectngle':
          this.view.moveRectangle(e);
          break;

        case 'move':
          this.view.moveCanvas(e);
          break;
      }
    });

    this.view.canvas.addEventListener('mouseup', (e) => {
      switch (this.do) {
        case 'pen':
          this.view.up();
          break;

        case 'line':
          this.view.upLine(e);
          break;

        case 'eraser':
          this.view.up();
          break;

        case 'circle':
          this.view.upCircle();
          break;

        case 'stroke-circle':
          this.view.upCircle('stroke');
          break;

        case 'rectngle':
          this.view.upRectangle();
          break;

        case 'stroke-rectngle':
          this.view.upRectangle('stroke');
          break;

        case 'move':
          this.view.upCanvas();
          break;

      }
    });

    this.view.model.framesWrapper.addEventListener('click', (e) => {
      if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'I') {
        e.stopPropagation();
      } else {
        const num = e.target.id;
        this.view.goToTheFram(num);
      }
    });

    document.querySelector('.lyers-wrapper').addEventListener('click', (e) => {
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
    switch (event.keyCode) {
      case 49:
        this.do = 'pen';
        break;

      case 50:
        this.do = 'line';
        break;

      case 51:
        this.do = 'eraser';
        break;

      case 52:
        this.do = 'bucket-full';
        break;

      case 53:
        this.do = 'bucket';
        break;

      case 54:
        this.do = 'pipette';
        break;

      case 55:
        this.do = 'blackout';
        break;

      case 56:
        this.do = 'lighten';
        break;

      case 57:
        this.do = 'rectngle';
        break;
    }
  }
}

const controller = new AppController();
document.addEventListener('DOMContentLoaded', controller.init);
