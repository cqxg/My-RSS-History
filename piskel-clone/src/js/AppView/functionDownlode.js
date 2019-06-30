export default function download(file) {
  const element = document.createElement('a');
  element.setAttribute('href', file);
  element.setAttribute('download', 'filename');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
