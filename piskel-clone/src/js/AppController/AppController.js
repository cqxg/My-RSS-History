import AppView from '../AppView/AppView';
import '../../css/style.css';

export default class AppController {
  constructor() {
    this.view = new AppView();
    this.dones = ['turn', 'clone', 'mirror', 'centering', 'bucket-full', 'bucket', 'pipette', 'pen', 'line', 'eraser', 'rectngle', 'stroke-rectngle', 'circle', 'stroke-circle', 'play', 'stop', 'full', 'save', 'add', 'move'];
    this.do = 'pen';
    this.was = 'pen';
    this.tools = document.querySelector('.tools');
    this.player = document.querySelector('.play-wrapper');
    this.framsControl = document.querySelector('.button-wrapper');
    this.transformControl = document.querySelector('.transform-tool');
    document.getElementById('get_color').addEventListener('change', e => this.view.changeColor(e));
    document.getElementById('speed').addEventListener('change', e => this.view.changeSpeed(e));

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
      if (this.do === 'centering') this.view.centering();
      this.do = this.was;
    });

    this.view.canvas.addEventListener('click', (e) => {
      if (this.do === 'bucket-full') this.view.bucketFull(this.hexToRgb(this.view.color));
      if (this.do === 'bucket') this.view.bucket(e, this.hexToRgb(this.view.color));
      if (this.do === 'pipette') {
        document.getElementById('get_color').value = this.rgb2hex(this.view.selectColor(e));
      }
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
      const elem = (e.target.nodeName === 'IMG') ? e.target.parentElement : e.target;
      const num = elem.id;
      if (num !== null) this.view.goToTheFram(num);
    });
  }

  done(e) {
    const elem = (e.target.classList.contains('material-icons') || e.target.nodeName === 'IMG') ? e.target.parentElement.className : e.target.className;
    this.was = (this.do !== 'add' || this.do !== 'save' || this.do !== 'play' || this.do !== 'stop' || this.do !== 'full' || this.do !== 'clone' || this.do !== 'turn') ? this.do : this.was;
    this.do = (this.dones.indexOf(elem) != -1) ? elem : 'pen';
  }

  componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? `0${  hex}` : hex;
  }

  rgb2hex(rgba = [0, 0, 0, 0]) {
    return `#${this.componentToHex(rgba[0])}${this.componentToHex(rgba[1])}${this.componentToHex(rgba[2])}`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
}

const controller = new AppController();
document.addEventListener('DOMContentLoaded', controller.init);
