const DELTA = 5 //кол-во пикселей на которое уменьшим при масштабировании
const start_size = 60;

function change_rotation_connections(cell, rotate_left) {
    let picture = $(cell);
    let l = (picture.attr('left') === 'true');
    let r = (picture.attr('right') === 'true');
    let d = (picture.attr('down') === 'true');
    let u = (picture.attr('up') === 'true');

    if (rotate_left) set_connections(picture, u, d, l, r);
    else set_connections(picture, d, u, r, l);
}

function rotate_left(cell) {
    let rotation = Number($(cell).attr('rotation'));
    let angle = rotation - 90;
    if (angle === -360) angle = 0;
    document.getElementById(cell.id).style.transform = 'rotate(' + angle + 'deg)';
    $(cell).attr('rotation', angle.toString());
    change_rotation_connections(cell, true);

}

function rotate_right(cell) {
    let rotation = Number($(cell).attr('rotation'));
    let angle = rotation + 90;
    if (angle === 360) angle = 0;
    document.getElementById(cell.id).style.transform = 'rotate(' + angle + 'deg)';
    $(cell).attr('rotation', angle.toString());
    change_rotation_connections(cell, false);


}

//TODO тройные провода несемметричны и для них нужно будет прописать переход отражения
function flip_horizontally(cell) {
    reflectionX = Number($(cell).attr('reflectionX'));
    reflectionY = Number($(cell).attr('reflectionY'));
    let rotation = Number($(cell).attr('rotation'));

    console.log(rotation);

    let resultX = 0;
    let resultY = 0;
    if (rotation === 0 || rotation === 180 || rotation === -180) {
        resultX = reflectionX;
        resultY = -reflectionY;
    }

    if (rotation === 90 || rotation === -270 || rotation === 270 || rotation === -90) {
        resultX = -reflectionX;
        resultY = reflectionY;
    }


    if (reflectionY < 0) {
        resultY = 1;
    }
    document.getElementById(cell.id).style.transform = 'scale(' + resultX + ',' + resultY + ')';
    $(cell).attr('reflectionX', resultX.toString());
    $(cell).attr('reflectionY', resultY.toString());
}

function flip_vertically(cell) {
    reflectionX = Number($(cell).attr('reflectionX'));
    reflectionY = Number($(cell).attr('reflectionY'));
    let rotation = Number($(cell).attr('rotation'));

    console.log(rotation);

    let resultX = 0;
    let resultY = 0;
    if (rotation === 0 || rotation === 180 || rotation === -180) {
        resultX = -reflectionY * Math.cos(Math.tan(rotation));
        resultY = reflectionX * Math.cos(Math.tan(rotation));
    }
    if (rotation === 90 || rotation === -270 || rotation === 270 || rotation === -90) {
        resultX = -reflectionY * Math.sin(Math.tan(rotation) / 2);
        resultY = -reflectionX * Math.sin(Math.tan(rotation) / 2);
    }

    if (reflectionX < 0) {
        resultX = 1;
    }
    document.getElementById(cell.id).style.transform = 'scale(' + resultX + ',' + resultY + ')';
    $(cell).attr('reflectionX', resultX.toString());
    $(cell).attr('reflectionY', resultY.toString());
}

function set_connections(picture, left, right, down, up) {
    picture.attr('left', left.toString());
    picture.attr('right', right.toString());
    picture.attr('up', up.toString());
    picture.attr('down', down.toString());
}


function reset(cell) {
    document.getElementById(cell.id).style.transform = 'rotate(0deg)';
    $(cell).attr('rotation', "0");
    //дефолтное состояние поворота
    set_connections($(cell), true, true, false, false);
}

function clean(cell) {
    let picture = $(cell)
    reset(cell);
    picture.attr('src', 'resource/element/desk.png');
    picture.attr('free', 'true');
    //очистка всего: у стола 0 соединений
    set_connections(picture, false, false, false, false)
}

function clean_all(message = true) {
    if (message) {
        if (!confirm("Вы действительно хотите все удалить?")) return;
    }
    for (let i = 0; i < N * M; i++) {
        let cell = document.getElementById('img_' + i.toString());
        clean(cell);
    }

}

function scale(plus) {
    let images = $('.gallery__img');
    let size = images.css('width');
    size = parseInt(size.substring(0, size.length - 2));
    if ((plus && size >= 100) || (!plus && size <= 30)) return; //не даем слишком сильно увеличить/уменьшить
    let delta = (plus ? DELTA : -DELTA);

    let scale_message = document.getElementById('current_scale');
    scale_message.innerText = 'Регулируйте масштаб.\nТекущий масштаб ' + Math.round((size + delta) / (start_size) * 100) + '%.';
    let new_size = (size + delta).toString() + 'px';

    images.css('width', new_size);
    images.css('height', new_size);

}

function chooseInstrument(cell) {
    //бороться со столом
    let fn = window[current];
    fn(cell);
}

function treat_wires(picture) {
    switch (current) {
        case 'wire':
            set_connections(picture, true, true, false, false);
            return;
        case 'wire_2':
            set_connections(picture, false, false, true, true);
            return;
        case 'corner_wire':
            set_connections(picture, true, false, true, false);
            return;
        case 'corner_wire_2':
            set_connections(picture, true, false, false, true);
            return;
        case 'corner_wire_3':
            set_connections(picture, false, true, false, true);
            return;
        case 'corner_wire_4':
            set_connections(picture, false, true, true, false);
            return;
        case 'triple_wire':
            set_connections(picture, true, true, true, false);
            return;
        case 'triple_wire_2':
            set_connections(picture, true, false, true, true);
            return;
        case 'triple_wire_3':
            set_connections(picture, true, true, false, true);
            return;
        case 'triple_wire_4':
            set_connections(picture, false, true, true, true);
            return;
        default:
            console.log("THIS IS NOT WIRE!");
    }
}

function chooseElement(cell) {
    let picture = $(cell);
    if (picture.attr('id')) reset(cell);
    picture.attr('src', 'resource/element/' + current.toString() + '/' + current.toString() + '.png');
    let isFree = 'false';
    picture.attr('free', isFree);
    set_connections(picture, true, true, false, false);
    //если это провод, то соединения поменяются, иначе останутся дефолтными
    treat_wires(picture);

    //memorizing();
}


function switchMode(shown, hidden) {
    let message = document.getElementById('message');
    if (shown === 'buildingMode') {
        //console.log(document.cookie);
        document.getElementById("button_for_default_circ").disabled = true;
        MODE = WORK;
        message.innerText = 'Вы в режиме запуска';
        startWorkingMode();
        set_old_values();

    } else {
        MODE = BUILD;
        document.getElementById("button_for_default_circ").disabled = false;
        for (let i = 0; i < M * N; i++) document.getElementById('img_' + i.toString()).style.filter = '';
        message.innerText = 'Вы в режиме строительства';
        message.style.color = 'black';
        document.getElementById("start_button").style.backgroundColor = "darkseagreen";
        document.getElementById("start_button").setAttribute("is_running", "false");
        stopWorkingMode();
    }
    //setCookie()
    document.getElementById(hidden).style.display = 'block';
    document.getElementById(shown).style.display = 'none';
    return false;
}


function set_old_values() {
    console.log(document.cookie);
    let arr_of_inputs = document.cookie.split("/")
    for (let i = 0; i < arr_of_inputs.length; i++) {
        let attr = arr_of_inputs[i].split(',');
        let div = document.getElementById(attr[0]);
        if (div !== null) {
            let tr_arr = div.children[0].children[0].children
            for (let j = 0; j < tr_arr.length; j++) {
                let input = tr_arr[j].children[0].children[0];
                let select = tr_arr[j].children[1].children[0];
                if (input.getAttribute('unit').toString().trim() === attr[1].toString().trim()) {
                    console.log(attr[3]);
                    input.value = attr[2];
                    select.value = attr[3].toString().trim();
                }
            }
        }
    }
    document.cookie = "";
}