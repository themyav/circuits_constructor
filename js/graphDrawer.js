const Imax = 1000;
let ctx;
let canvas;
let animation = null;
function drawConstI(){

}


var elm = document.getElementById("animated");
var stopped;
var requestId = 0;
var starttime;

function startI() {
    starttime = Date.now();
    requestId = window.requestAnimationFrame(draw);
    stopped = false;
}
function stopI() {

    /*if (requestId) {
        window.cancelAnimationFrame(requestId);
    }*/
    stopped = true;
}

function drawSin(){
    let amplitude = I0 * 10;
    ctx.moveTo(10, amplitude);
    drawPoint(10, canvas.height - amplitude);

    ctx.moveTo(0, canvas.height / 2);
    let t = 0;
    var y = 0;
    var frequency = 20;
    while (t < canvas.width) {
        y = canvas.height/2 + amplitude * Math.sin(t/frequency);
        ctx.lineTo(t, y);
        t++;
    }
    ctx.stroke();
}

function drawAlternativeI(){
}

function processGraphic(){
    drawGraphic();
    if(IS_I_CONST) drawConstI();
    else drawAlternativeI();
}


function drawGraphic(){

    let gallery = document.getElementById("gallery");
    canvas = document.getElementById("graphic");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = 'aliceblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let offset = 10;

    ctx.beginPath();
    ctx.moveTo(offset, offset);
    ctx.lineTo(offset, canvas.height - offset);
    ctx.lineTo(canvas.width - offset, canvas.height - offset);
    ctx.lineWidth = 2;
    ctx.stroke();

    //if source_type = постоянный ток
}


function showAxes(ctx,axes) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const xMin = 0;

    ctx.beginPath();
    ctx.strokeStyle = "rgb(128,128,128)";

    // X-Axis
    ctx.moveTo(xMin, height/2);
    ctx.lineTo(width, height/2);


    // Starting line
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);

    ctx.stroke();
}
function drawPoint(ctx, y) {
    var radius = 3;
    ctx.beginPath();

    // Hold x constant at 4 so the point only moves up and down.
    ctx.arc(4, y, radius, 0, 2 * Math.PI, false);

    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
}
function plotSine(ctx, xOffset, yOffset) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(66,44,255)";

    let t = 0;
    let y = 0;
    let amplitude = I0 * 50; //увеличили масштаб
    ctx.moveTo(t, 50);
    while (t < width) {
        y = height/2 - (amplitude * Math.sin(step * W + PHI));
        ctx.lineTo(t * 10, y);
        t+=0.1;
        step += 0.1;
    }
    ctx.stroke();
    ctx.save();

    //console.log("Drawing point at y=" + y);
    //drawPoint(ctx, y);
    ctx.stroke();
    ctx.restore();
}
function draw() {
    canvas = document.getElementById("graphic");
    ctx = canvas.getContext("2d");
    if(stopped) return;
    ctx.clearRect(0, 0, 500, 500);
    showAxes(ctx);
    ctx.save();
    plotSine(ctx, step, 50);
    ctx.restore();
    window.requestAnimationFrame(draw);

}


function stopGraphic(){

}
var step = 0;