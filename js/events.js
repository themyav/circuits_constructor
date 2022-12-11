const DELTA = 5 //кол-во пикселей на которое уменьшим при масштабировании

function change_rotation_connections(cell, rotate_left){
    let picture = $(cell);
    let l = (picture.attr('left') === 'true');
    let r = (picture.attr('right') === 'true');
    let d = (picture.attr('down') === 'true');
    let u = (picture.attr('up') === 'true');

    if(rotate_left) set_connections(picture, u, d, l, r);
    else set_connections(picture, d, u, r, l);
}

function rotate_left(cell){
    let rotation = Number($(cell).attr('rotation'));
    let angle = rotation - 90;
    if(angle === -360) angle = 0;
    document.getElementById(cell.id).style.transform = 'rotate(' + angle + 'deg)';
    $(cell).attr('rotation', angle.toString());
    change_rotation_connections(cell, true);

}

function rotate_right(cell){
    let rotation = Number($(cell).attr('rotation'));
    let angle = rotation + 90;
    if(angle === 360) angle = 0;
    document.getElementById(cell.id).style.transform = 'rotate(' + angle + 'deg)';
    $(cell).attr('rotation', angle.toString());
    change_rotation_connections(cell, false);
    

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

function set_connections(picture, left, right, down, up){
    picture.attr('left', left.toString());
    picture.attr('right', right.toString());
    picture.attr('up', down.toString());
    picture.attr('down', up.toString());
}


function reset(cell){
    document.getElementById(cell.id).style.transform = 'rotate(0deg)';
    $(cell).attr('rotation', "0");
    //дефолтное состояние поворота
    set_connections($(cell), true, true, false, false);
}

function clean(cell){
    let picture = $(cell)
    reset(cell);
    picture.attr('src', 'resource/element/desk.png');
    picture.attr('free', 'true');
    //очистка всего: у стола 0 соединений
    set_connections(picture, false, false, false, false)
}

function clean_all(){
    if(!confirm("Вы действительно хотите все удалить?")) return;
    for(let i = 0; i < N * M; i++){
        let cell = document.getElementById('img_' + i.toString());
        clean(cell);
    }

}

function scale(plus){
    let images = $('.gallery__img');
    let size = images.css('width');
    size = parseInt(size.substring(0, size.length - 2));
    if((plus && size >= 100) || (!plus && size <= 30)) return; //не даем слишком сильно увеличить/уменьшить

    let delta = (plus ? DELTA : -DELTA);
    let new_size = (size + delta).toString() + 'px';
    console.log(new_size);
    images.css('width', new_size);
    images.css('height', new_size);

}

function chooseInstrument(cell){
    //бороться со столом
    let fn = window[current];
    fn(cell);
}

function chooseElement(cell){
    let picture = $(cell);
    if(picture.attr('id')) reset(cell);
    picture.attr('src', 'resource/element/' + current.toString() + '/' + current.toString() + '.png');
    let isFree = 'false';
    picture.attr('free', isFree);
    set_connections(picture, true, true, false, false);
}


function switchMode(shown, hidden) {
    if(shown === 'buildingMode') {
        MODE = WORK
        startWorkingMode();
    }
    else MODE = BUILD
    setCookie()
    document.getElementById(hidden).style.display='block';
    document.getElementById(shown).style.display='none';
    return false;
}