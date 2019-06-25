import AppView from '../AppView/AppView';
import '../../css/style.css';

export default class AppController {
  constructor() {

  }
}

const controller = new AppController();
document.addEventListener('DOMContentLoaded', controller.init);
