function App() {

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
}

document.addEventListener('DOMContentLoaded', App);