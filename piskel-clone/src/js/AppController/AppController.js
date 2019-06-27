import AppView from '../AppView/AppView';
import '../../css/style.css';

export default class AppController {
  constructor() {
    this.view = new AppView();
    this.dones = ['turn', 'clone', 'mirror', 'centering', 'bucket-full', 'bucket', 'pipette', 'pen', 'line', 'eraser', 'rectngle', 'stroke-rectngle', 'circle', 'stroke-circle', 'play', 'stop', 'full', 'save', 'add', 'move'];
    this.do = 'pen';
    this.was = 'pen';
    this.tools = document.querySelector('.tools');

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
    }
    });

  const controller = new AppController();
  document.addEventListener('DOMContentLoaded', controller.init);
