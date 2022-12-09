function rotate_left(cell){
    let rotation = Number($(cell).attr('rotation'));
    let angle = rotation - 90;
    if(angle === -360) angle = 0;
    document.getElementById(cell.id).style.transform = 'rotate(' + angle + 'deg)';
    $(cell).attr('rotation', angle.toString());
}

function rotate_right(cell){
    let rotation = Number($(cell).attr('rotation'));
    let angle = rotation + 90;
    if(angle === 360) angle = 0;
    document.getElementById(cell.id).style.transform = 'rotate(' + angle + 'deg)';
    $(cell).attr('rotation', angle.toString());
    

}

function flip_horizontally(cell){
    reflectionX = Number($(cell).attr('reflectionX'));
    reflectionY = Number($(cell).attr('reflectionY'));
    let rotation = Number($(cell).attr('rotation'));
    
    console.log(rotation);

    let resultX = 0;
    let resultY = 0;
    if(rotation === 0 || rotation === 180 || rotation === -180){
        resultX = reflectionX;
        resultY = -reflectionY;
    }
    
    if(rotation === 90 || rotation === -270 || rotation === 270 || rotation === -90){
        resultX = -reflectionX;
        resultY = reflectionY;
    }

    
    if(reflectionY<0){
        resultY = 1;
    }
    document.getElementById(cell.id).style.transform = 'scale(' + resultX+','+ resultY+ ')';
    $(cell).attr('reflectionX', resultX.toString());
    $(cell).attr('reflectionY', resultY.toString());
}

function flip_vertically(cell){
    reflectionX = Number($(cell).attr('reflectionX'));
    reflectionY = Number($(cell).attr('reflectionY'));
    let rotation = Number($(cell).attr('rotation'));

    console.log(rotation);

    let resultX = 0;
    let resultY = 0;
    if(rotation === 0 || rotation === 180 || rotation === -180){
        resultX = -reflectionY * Math.cos(Math.tan(rotation));
        resultY =  reflectionX * Math.cos(Math.tan(rotation));
    }
    if(rotation === 90 || rotation === -270 || rotation === 270 || rotation === -90){
        resultX = -reflectionY * Math.sin(Math.tan(rotation)/2);
        resultY = -reflectionX * Math.sin(Math.tan(rotation)/2);
    }
    
    if(reflectionX<0){
        resultX = 1;
    }
    document.getElementById(cell.id).style.transform = 'scale(' + resultX+','+ resultY+ ')';
    $(cell).attr('reflectionX', resultX.toString());
    $(cell).attr('reflectionY', resultY.toString());
}


function reset(cell){
    document.getElementById(cell.id).style.transform = 'rotate(0deg)';
    $(cell).attr('rotation', "0");
}

function clean(cell){
    let picture = $(cell)
    reset(cell);
    picture.attr('src', 'resource/element/desk.png');
    picture.attr('free', 'true');

}

function chooseInstrument(cell){
    //бороться со столом
    let fn = window[current];
    fn(cell);
}

function chooseElement(cell){
    picture = $(cell);
    if(picture.attr('id')) reset(cell);
    picture.attr('src', 'resource/element/' + current.toString() + '/' + current.toString() + '.png');
    let isFree = 'false';
    picture.attr('free', isFree);
}


function switchMode(shown, hidden) {
    if(shown === 'buildingMode') {
        MODE = WORK
        addRAndU();
    }
    else MODE = BUILD
    setCookie()
    document.getElementById(hidden).style.display='block';
    document.getElementById(shown).style.display='none';
    return false;
}