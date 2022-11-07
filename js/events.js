function rotate_left(){
    console.log("left")
}

function rotate_right(cell){
    let rotation = Number($(cell).attr('rotation'));
    let angle = ((rotation + 90) % 360);
    document.getElementById(cell.id).style.transform = 'rotate(' + angle + 'deg)';
    $(cell).attr('rotation', angle.toString());

}

function clean(){
    console.log("clean")
}

function chooseInstrument(cell){
    //бороться со столом
    //console.log(cell.id);
    let fn = window[current];
    fn(cell);
}

function chooseElement(cell){

    cell = $(cell);
    let isFree = cell.attr('free');

    if(isFree === 'false') {
        cell.attr('src', 'resource/element/desk.png');
        isFree = 'true';
    }
    else{
        cell.attr('src', 'resource/element/' + current.toString() + '/' + current.toString() + '.png');
        isFree = 'false';
    }
    cell.attr('free', isFree);

}