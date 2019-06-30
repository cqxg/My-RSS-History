export default class AppModel {
  constructor() {
    this.frames = [];
    this.framesTwo = [];
    this.framsAnim = [];
    this.framesWrapper = document.querySelector('.frames-wrapper');
    this.frameTemplate = document.querySelector('#frame-template');
    this.layerWrapper = document.querySelector('.lyers-wrapper');
    this.layerTemplate = document.getElementById('layer-template');
  }

  addEndFrams(dataURL) {
    this.framsAnim.push(dataURL);
  }

  clearFrams() {
    this.framsAnim = [];
  }

  frameDraw(x = 1000, image, backgroundColor, data) {
    let imageData = [];
    let dataURL = [];
    let background;
    if (x === 1000) {
      imageData.push(image);
      background = backgroundColor;
      dataURL.push(data);
    } else {
      imageData = this.framesTwo[x].img.slice();
      // eslint-disable-next-line prefer-destructuring
      background = this.framesTwo[x].background;
      dataURL = this.frames[x].data.slice();
    }
    this.framesTwo.push({ img: imageData, background });
    this.frames.push({ data: dataURL, background });
    return { url: dataURL, id: this.frames.length - 1 };
  }

  frameDeleteHandler(num) {
    this.framesTwo.splice(num, 1);
    this.frames.splice(num, 1);
  }

  saveFrameLayer(num, numlay, imageData, background, dataURL) {
    this.framesTwo[num].img[numlay] = imageData;
    this.framesTwo[num].background = background;
    this.frames[num].data[numlay] = dataURL;
    this.frames[num].background = background;
  }

  cloneFram(num) {
    const len = this.framesTwo.length;
    for (let i = 0; i < len; i += 1) {
      const imageObj = {};
      const dataObj = {};
      Object.assign(imageObj, this.framesTwo[num]);
      Object.assign(dataObj, this.frames[num]);
      this.framesTwo[i] = imageObj;
      this.frames[i] = dataObj;
    }
  }

  addLayerforFrams(num, imageData, background, dataURL) {
    if (num !== null) {
      this.framesTwo[num].img.push(imageData);
      this.framesTwo[num].background = background;
      this.frames[num].data.push(dataURL);
      this.frames[num].background = background;
    }
  }

  getNexNum(activ_fram = 0) {
    return this.framesTwo[activ_fram].img.length - 1;
  }

  deleteLayer(numfram, numlayer) {
    this.framesTwo[numfram].img.splice(numlayer, 1);
    this.frames[numfram].data.splice(numlayer, 1);
  }

  changeLayer(activenum, activelayer, num) {
    const image = this.framesTwo[activenum].img[activelayer];
    const data = this.frames[activenum].data[activelayer];
    let nextNum = 0;
    if (Number(activelayer) + Number(num) === -1) {
      nextNum = this.framesTwo[activenum].img.length - 1;
    } else {
      nextNum = (Number(activelayer) + Number(num) === this.framesTwo[activenum].img.length) ? 0 : Number(activelayer) + Number(num);
    }
    this.framesTwo[activenum].img[activelayer] = this.framesTwo[activenum].img[nextNum];
    this.framesTwo[activenum].img[nextNum] = image;
    this.frames[activenum].data[activelayer] = this.frames[activenum].data[nextNum];
    this.frames[activenum].data[nextNum] = data;
    return nextNum;
  }
}
