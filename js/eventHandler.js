const LAMP = 'lamp';
const WIRE = 'wire';

var current = 'lamp';
var action  = chooseElement



$(document).ready(function (){

    //Отлавливаем клик по картинке и всегда ее заменяем на что-то указанной функцией
    $('body').on('click', 'img', function (event){
        if (event.ctrlKey){
            if(event.shiftKey){
                current = "rotate_left";
            }
            else current = "rotate_right";
            action = chooseInstrument;
        }
        action(this);
    });

    // Отлавливаем нажатие на кнопку и выбираем, с каким элементом меню заботаем
    $('button').on('click', function (){
        current = this.id;
        if(current === '') return;
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
                action = chooseInstrument;
                break;
            default:
                break;
        }

    });
});




function default_circuits() {
    document.getElementById("myСircuits").classList.toggle("show_circuits");
}


// Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
window.onclick = function(event) {
    if (!event.target.matches('.drop_circuits')) {
        let dropdowns = document.getElementsByClassName("circuits_dropdown");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_circuits')) {
                openDropdown.classList.remove('show_circuits');
            }
        }
    }
}


function wires() {
    document.getElementById("myWires").classList.toggle("show_wires");
}
// Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
window.onclick = function(event) {
    if (!event.target.matches('.drop_wires')) {
        var dropdowns = document.getElementsByClassName("wires_dropdown");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_wires')) {
                openDropdown.classList.remove('show_wires');
            }
        }
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


}