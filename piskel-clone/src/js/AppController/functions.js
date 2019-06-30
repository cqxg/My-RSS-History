function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export default function rgb2hex(rgba = [0, 0, 0, 0]) {
  return `#${componentToHex(rgba[0])}${componentToHex(rgba[1])}${componentToHex(rgba[2])}`;
}
