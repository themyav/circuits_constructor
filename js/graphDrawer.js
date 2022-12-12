const Imax = 1000;

function drawI(){

}


function drawGraphic(){

    let gallery = document.getElementById("gallery");
    let canvas = document.getElementById("graphic");
    let ctx = canvas.getContext("2d");
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