// grid for cnavas
export default function Grid(gridCanvas, width, height) {
  const grid = {
    cellsNumberX: 64,
    cellsNumberY: 64,
    lineX: width / 64,
    lineY: height / 64,
  };
  const contx = gridCanvas.getContext('2d');
  contx.strokeStyle = '#808080';
  let buf = 0;
  for (let i = 0; i <= grid.cellsNumberX; i += 1) {
    contx.beginPath();
    contx.moveTo(buf, 0);
    contx.lineTo(buf, height);
    contx.stroke();
    buf += grid.lineX;
  }
  buf = 0;
  for (let j = 0; j <= grid.cellsNumberY; j += 1) {
    contx.beginPath();
    contx.moveTo(0, buf);
    contx.lineTo(width, buf);
    contx.stroke();
    buf += grid.lineY;
  }
}
