const saveImage = (image) => {
  const link = document.createElement('a');
  link.setAttribute('href', image.src);
  link.setAttribute('download', 'canvasImage');
  link.click();
};

export default function saveCanvasAsImageFile(canvas) {
  const imageData = canvas.toDataURL();
  const image = new Image();
  image.src = imageData;
  saveImage(image);
}
