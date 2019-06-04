function App() {
    const frames = [];
    const framesTwo = [];
    const addFrames = document.getElementById("add");
    const framesWrapper = document.querySelector(".frames-wrapper");
    const frameTemplate = document.querySelector("#frame-template");
    const speedValue = document.getElementById('speed');
    const canvas = document.getElementById("myCanvas");
    const stop = document.getElementById("stop");
    let myAnimation;
    const state = {
        speed: 1,

    };

    const context = canvas.getContext("2d"),
        w = canvas.width,
        h = canvas.height;

    const mouse = { x: 0, y: 0 };
    let draw = false;

    canvas.addEventListener("mousedown", function (e) {

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        draw = true;
        context.beginPath();
        context.moveTo(mouse.x, mouse.y);
    });
    canvas.addEventListener("mousemove", function (e) {

        if (draw == true) {

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
        }
    });
    canvas.addEventListener("mouseup", function (e) {

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
        context.closePath();
        draw = false;
    });


    //--------------------------------    FRAMES  --------------------------------------------------------//


    addFrames.addEventListener('click', frameDraw);

    function frameDraw() {
        const imageData = context.getImageData(0, 0, 800, 600);
        framesTwo.push(imageData);

        dataURL = canvas.toDataURL();
        frames.push(dataURL);

        const frameId = frames.length - 1;

        const fragment = createFrame({ url: dataURL, id: frameId });
        framesWrapper.appendChild(fragment);

        function clear() {
            context.fillStyle = 'white'
            context.fillRect(0, 0, 800, 600);
            context.beginPath();
        }
        clear();
    };

    function createFrame(frameInfo) {
        const { url, id } = frameInfo;

        const fragment = document.createDocumentFragment();

        const newFrame = document.importNode(frameTemplate.content, true);

        const frameImage = newFrame.querySelector(".frame-image");
        frameImage.src = url;
        frameImage.id = `frame-${id}`;

        const frameDelete = newFrame.querySelector(".button-delete");
        frameDelete.addEventListener('click', frameDeleteHandler);

        const frameCopy = newFrame.querySelector(".button-copy");
        frameCopy.addEventListener('click', frameCopyHandler);

        fragment.appendChild(newFrame);
        return fragment;
    }

    function frameDeleteHandler(e) {
        const frame = document.querySelector(".frame");
        frame.remove(e.target);
    }

    function frameCopyHandler(e) {
        let clone = e.target.cloneNode(true);
        framesWrapper.appendChild(clone);
    }

    // ------------------------------ animation --------------------//

    const drawing = (x) => {
        context.clearRect(0, 0, 800, 600);
        context.putImageData(framesTwo[x], 0, 0);
    };

    document.getElementById('play').addEventListener('click', () => {
        i = 0;
        state.speed = speedValue.valueAsNumber * 10;
        if (framesTwo.length !== 0) {
            myAnimation = setInterval(() => {
                drawing(i);
                if (i >= framesTwo.length - 1) i = 0;
                else i += 1;
            }, state.speed);
        }
    });

    stop.addEventListener('click', stopAnimate);
    function stopAnimate() {
        clearInterval(myAnimation);
    };
}

document.addEventListener('DOMContentLoaded', App);

