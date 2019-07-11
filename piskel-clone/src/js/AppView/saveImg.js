export default function saveImage(image) {
  const link = document.createElement('a');
  link.setAttribute('href', image.src);
  link.setAttribute('download', 'canvasImage');
  link.click();
}
