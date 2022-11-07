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

function reset(cell){
    document.getElementById(cell.id).style.transform = 'rotate(0deg)';
    $(cell).attr('rotation', "0");
}

function clean(cell){
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
    let isFree = picture.attr('free');
    reset(cell);

    if(isFree === 'false') {
        picture.attr('src', 'resource/element/desk.png');
        isFree = 'true';
    }
    else{
        picture.attr('src', 'resource/element/' + current.toString() + '/' + current.toString() + '.png');
        isFree = 'false';
    }
    picture.attr('free', isFree);

}