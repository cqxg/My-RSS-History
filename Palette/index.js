function App() {

    const state = {
        currColor: 'red',
        prevColor: 'blue',
        clickHandler: bucketHandler
    };

    const prevButton = document.getElementById('prev');
    const currButton = document.getElementById('current');
    const blue = document.getElementById('blue');
    const red = document.getElementById('red');
    const instruments = document.querySelector('.instruments');
    const field = document.querySelector('.field');
    const bucket = document.querySelector('#bucket');
    const pipette = document.querySelector('#pipette');
    const mover = document.querySelector('#mover');
    const transformer = document.querySelector('#transformer');

    setPrevColor();
    setCurrColor();

    field.addEventListener('click', state.clickHandler);

    instruments.addEventListener('click', event => {
        const button = event.target.id;
        switch (button) {
        case 'bucket':
            setClickHandler(bucketHandler);
            event.target.style.backgroundColor = 'white';
            pipette.style.backgroundColor = 'gray';
            mover.style.backgroundColor = 'gray';
            transformer.style.backgroundColor = 'gray';
            break;
        case 'pipette':
            setClickHandler(pipetteHandler);
            event.target.style.backgroundColor = 'white';
            bucket.style.backgroundColor = 'gray';
            mover.style.backgroundColor = 'gray';
            transformer.style.backgroundColor = 'gray';
            break;
        case 'mover':
            setClickHandler(moveHandler);
            event.target.style.backgroundColor = 'white';
            bucket.style.backgroundColor = 'gray';
            pipette.style.backgroundColor = 'gray';
            transformer.style.backgroundColor = 'gray';
            break;
        case 'transformer':
            setClickHandler(transformHandler);
            event.target.style.backgroundColor = 'white';
            bucket.style.backgroundColor = 'gray';
            pipette.style.backgroundColor = 'gray';
            mover.style.backgroundColor = 'gray';
            break;
        }

    });

    document.addEventListener('keydown', event => {
        if (event.keyCode == 49) {
            setClickHandler(bucketHandler);
            bucket.style.backgroundColor = 'white';
            pipette.style.backgroundColor = 'gray';
            mover.style.backgroundColor = 'gray';
            transformer.style.backgroundColor = 'gray';
        } else if (event.keyCode == 50) {
            setClickHandler(pipetteHandler);
            pipette.style.backgroundColor = 'white';
            bucket.style.backgroundColor = 'gray';
            mover.style.backgroundColor = 'gray';
            transformer.style.backgroundColor = 'gray';
        } else if (event.keyCode == 51) {
            setClickHandler(moveHandler);
            mover.style.backgroundColor = 'white';
            bucket.style.backgroundColor = 'gray';
            pipette.style.backgroundColor = 'gray';
            transformer.style.backgroundColor = 'gray';
        } else if (event.keyCode == 52) {
            setClickHandler(transformHandler);
            transformer.style.backgroundColor = 'white';
            bucket.style.backgroundColor = 'gray';
            pipette.style.backgroundColor = 'gray';
            mover.style.backgroundColor = 'gray';
        }
    });


    function setClickHandler(handler) {
        field.removeEventListener('click', state.clickHandler);
        state.clickHandler = handler;
        field.addEventListener('click', state.clickHandler);
    }

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