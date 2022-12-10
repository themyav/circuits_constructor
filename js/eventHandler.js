const LAMP = 'lamp';
const WIRE = 'wire';

var current = 'lamp';
var action  = chooseElement


//нажатие на картинку в режиме работы
function handleWorkModeImage(e, cell){

}

//нажатие на картинку в режиме строительства
function handleBuildModeImage(e, cell){
    let previousElementName = current;
    let previousAction = action;
    if (e.ctrlKey){
        if(e.shiftKey){
            current = "rotate_left";
        }
        else current = "rotate_right";
        action = chooseInstrument;
    }
    else if(e.altKey){
        current = 'clean';
        action = chooseInstrument;
    }
    action(cell);
    current = previousElementName;
    action = previousAction;
}
//нажатие на кнопку в режиме работы
function handleWorkModeButton(cell){

}
//нажатие на кнопку в режиме строительства
function handleBuildModeButton(cell){
    document.getElementById(current).style.filter = '';
    if(cell.id === '') return;
    current = cell.id;
    document.getElementById(current).style.filter = 'brightness(50%)';
    let category = document.getElementById(current).closest('table').classList[0];
    let menue = document.getElementById(current).classList[0];
    switch (category){
        case 'elements': //выбираем элемент
            if(menue === "drop_wires") {
                current = "wire";
                wires();
            }
            action = chooseElement;
            break;
        case 'instruments':
            if(current === 'clean_all'){
                clean_all();
                return;
            }
            action = chooseInstrument;
            break;
        default:
            break;
    }

}


$(document).ready(function (){

    //Отлавливаем клик по картинке и всегда ее заменяем на что-то указанной функцией
    $('body').on('click', 'img', function (event){
        let e = event;
        let cell = this;
        if(MODE === BUILD) handleBuildModeImage(e, cell);
        else handleWorkModeImage(e, cell);

    });

    // Отлавливаем нажатие на кнопку и выбираем, с каким элементом меню заботаем
    $('button').on('click', function (){
        let cell = this;
        let id = cell.id;
        if(id === 'scale_plus' || id === 'scale_minus') return;
        if(MODE === BUILD) handleBuildModeButton(cell);
        else handleWorkModeButton(cell);

    });
});




function default_circuits() {
    document.getElementById("myСircuits").classList.toggle("show_circuits");
}


//TODO: Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
window.onclick = function(event) {
    if (!event.target.matches('.drop_circuits')) {
        let dropdowns = document.getElementsByClassName("circuits_dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_circuits')) {
                openDropdown.classList.remove('show_circuits');
            }
        }
    }
}


function wires() {
    document.getElementById("myWires").classList.toggle("show_wires");
}
//TODO: Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
window.onclick = function(event) {
    if (!event.target.matches('.drop_wires')) {
        let dropdowns = document.getElementsByClassName("wires_dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_wires')) {
                openDropdown.classList.remove('show_wires');
            }
        }
        document.getElementById('drop_wires').style.filter = '';
    }
}




function circuits_one() {
    console.log("did first");

}
function circuits_two() {
    console.log("did second");
}
function circuits_three() {
    console.log("did third");
}

//постоянный ток, последовательное соединение
function circuits_four() {
    let oldCurrent = current;
    let oldAction = action;

    console.log("did fourth");
    let start = M + Math.round(M/2)
    let next = M
    let sheme = [
        [start, 'corner_wire_4'],
        [start + 1, 'lamp'],
        [start + 2, 'corner_wire'],
        [start + M, 'current_source', rotate_left],
        [start + M + 2, 'wire_2'],
        [start + 2*M, 'corner_wire_3'],
        [start + 2*M + 1, 'wire'],
        [start + 2*M + 2, 'corner_wire_2'],
    ]
    for(let i = 0; i < sheme.length; i++){
        current = sheme[i][1]
        console.log(sheme[i][0])
        let cell = document.getElementById("img_" + sheme[i][0])
        chooseElement(cell)
        if(sheme[i].length > 2) sheme[i][2](cell)
    }
    current = oldCurrent;
    action = oldAction;

}