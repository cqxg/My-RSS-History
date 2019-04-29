function App() {
  // -------------------- State -------------------------------

  const state = {
    currColor: 'red', // picked, red, blue
    prevColor: 'blue', // picked, red, blue
    clickHandler: pipetteHandler // bucket, picker, mover, transformer
  }

  const prevButton = document.getElementById('prev');
  const currButton = document.getElementById('current');
  const blue = document.getElementById('blue');
  const red = document.getElementById('red');
  const instruments = document.querySelector('.instruments');
  const field = document.querySelector('.field');

  // ------------------- Init ---------------------------------

  setPrevColor();
  setCurrColor();

  field.addEventListener('click', state.clickHandler);

  instruments.addEventListener('click', event => {
    const button = event.target.id;
    switch (button) {
      case 'bucket':
        setClickHandler(bucketHandler);
        break;
      case 'pipette':
        setClickHandler(pipetteHandler);
        break;
      case 'mover':
        setClickHandler(moveHandler);
        break;
      case 'transformer':
        setClickHandler(transformHandler);
        break;
    }

  });


  // ----------------------------------------------------------

  function setClickHandler(handler) {
    field.removeEventListener('click', state.clickHandler);
    state.clickHandler = handler;
    field.addEventListener('click', state.clickHandler);
  }

  // -------------------- Menu --------------------------------

  function pipetteHandler(event) {
    const pickerdColor = event.target.style.backgroundColor;

    state.prevColor = state.currColor;
    setPrevColor();

    state.currColor = pickerdColor;
    setCurrColor();
  }

  function bucketHandler(event) {
    if (event.target.id === 'drag') {
      event.target.style.backgroundColor = state.currColor;
    }
  }

  function moveHandler(event) {
    const element = event.target;
    if (element.id === 'drag') {
      element.addEventListener('mousedown', moveUtil);
      element.addEventListener('dragstart', e => e.preventDefault());
    }
  }


  function transformHandler(event) {
    const element = event.target;

    element.classList.toggle('circle');
  }

  // ------------------------ Picker --------------------------

  function setCurrColor() {
    currButton.style.backgroundColor = state.currColor;
  }

  function setPrevColor() {
    prevButton.style.backgroundColor = state.prevColor;
  }

  blue.addEventListener('click', swap);
  red.addEventListener('click', swap);

  function swap() {
    state.prevColor = state.currColor;
    setPrevColor();
    state.currColor = window.getComputedStyle(this).backgroundColor;
    setCurrColor();
  }

  prev.addEventListener('click', swap);
  current.addEventListener('click', swap);
}

// ---------------------------------------------------------

function moveUtil(event) {
  const element = event.target;
  element.style.position = 'absolute';

  moveAt(event);

  document.body.appendChild(element);
  document.addEventListener('mousemove', moveAt);
  element.addEventListener('mouseup', removeListener);

  function moveAt(event) {
    element.style.left = event.pageX - element.offsetWidth / 2 + 'px';
    element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
  }

  function removeListener() {
    document.removeEventListener('mousemove', moveAt);
    element.removeEventListener('mouseup', removeListener);
  }
}


document.addEventListener('DOMContentLoaded', App);