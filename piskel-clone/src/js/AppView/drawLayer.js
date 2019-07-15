export default function drawLayer(num = 0) {
  const layerTemplate = document.getElementById('layer-template');
  const newLayer = document.importNode(layerTemplate.content, true);
  const layer = newLayer.querySelector('.layer');
  layer.id = num;
  document.querySelector('.lyers-wrapper').appendChild(newLayer);
}
