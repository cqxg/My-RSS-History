function App() {
    const frames = [];
    const addFrames = document.getElementById("add");
    const framesWrapper = document.querySelector(".frames-wrapper");
    const frameTemplate = document.querySelector("#frame-template");
    const canvas = document.getElementById("myCanvas");

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
        //тут запись в фрейм --> 
    });

    //let dataURL = canvas.toDataURL();  <--- Vrode rabotaet
    //document.getElementById('img').href = dataURL; <--- ?

    addFrames.addEventListener('click', frameDraw);

    function frameDraw() {

        dataURL = canvas.toDataURL();
        frames.push(dataURL);

        const frameId = frames.length - 1;

        const fragment = createFrame({ url: dataURL, id: frameId });
        framesWrapper.appendChild(fragment);
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
        let dupNode = e.target.cloneNode(true);
        dupNode.nextSibling;
    }

}

//function delete() {

//};

//function clear() {           <--------------- Zagotovo4ka
//    canvas.fillStyle = 'white'
//   canvas.fillRect(0, 0, canv.width, canv.height);
//    canvas.beginPath();
//}                

document.addEventListener('DOMContentLoaded', App);

