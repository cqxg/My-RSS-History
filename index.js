function App() {
    // -------------------- State -------------------------------
    const state = {
      currColor: 'red', // picked, red, blue
      prevColor: 'blue', // picked, red, blue
      clickHandler: bucketHandler // bucket, picker, mover, transformer
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






}