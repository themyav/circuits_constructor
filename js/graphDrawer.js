const Imax = 1000;
let ctx;
let canvas;
function drawConstI(){

}

function drawPoint(x, y){
    ctx.fillStyle = 'black';
    ctx.fillRect(x,y,1,1);
}

function drawAlternativeI(){
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
    /*for(let t = 0; t < 500; t+=0.1){
        let y = countMomentalI(t);
        //console.log(y * 1e11);
        drawPoint(t, canvas.height / 2 - y * 1e8);
    }*/
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