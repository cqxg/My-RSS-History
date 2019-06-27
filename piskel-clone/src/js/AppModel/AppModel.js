export default class AppModel {
  constructor() {
    this.frames = [];
    this.framesTwo = [];
    this.framesWrapper = document.querySelector('.frames-wrapper');
    this.frameTemplate = document.querySelector('#frame-template');
  }

  frameDraw(x = 1000, image, backgroundColor, data) {
    let dataURL;
    let imageData;
    let background;
    if (x === 1000) {
      imageData = image;
      background = backgroundColor;
      dataURL = data;
    } else {
      imageData = this.framesTwo[x].img;
      // eslint-disable-next-line prefer-destructuring
      background = this.framesTwo[x].background;
      dataURL = this.frames[x].data;
    }
    this.framesTwo.push({ img: imageData, background });
    this.frames.push({ data: dataURL, background });
    return { url: dataURL, id: this.frames.length - 1 };
  }

  frameDeleteHandler(e) {
    const elem = e;
    const num = (elem.classList.contains('button-delete')) ? elem.parentElement.id : elem.parentElement.parentElement.id;
    this.framesTwo.splice(num, 1);
    this.frames.splice(num, 1);
  }

  // eslint-disable-next-line class-methods-use-this
  frameCopyHandler(e) {
    const elem = e;
    const num = (elem.classList.contains('button-copy')) ? elem.parentElement.id : elem.parentElement.parentElement.id;
    return num;
  }

  saveFrame(num, imageData, background, dataURL) {
    this.framesTwo[num] = { img: imageData, background };
    this.frames[num] = { data: dataURL, background };
  }

  cloneFram(num) {
    const imageData = this.framesTwo[num].img;
    const { background } = this.framesTwo[num];
    const dataURL = this.frames[num].data;
    this.framesTwo.fill({ img: imageData, background }, 0);
    this.frames.fill({ data: dataURL, background }, 0);
  }
}
