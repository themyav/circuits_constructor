const LAMP = 'lamp';
const WIRE = 'wire';

var current = 'lamp';
var action  = chooseElement



$(document).ready(function (){

    //Отлавливаем клик по картинке и всегда ее заменяем на что-то указанной функцией
    $('body').on('click', 'img', function (event){
        action(this);
    });

    // Отлавливаем нажатие на кнопку и выбираем, с каким элементом меню заботаем
    $('button').on('click', function (){
        current = this.id;
        let category = document.getElementById(current).closest('table').classList[0];

        switch (category){
            case 'elements':
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
    document.getElementById("myСircuits").classList.toggle("show");
  }
  // Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
window.onclick = function(event) {
if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("circuits_dropdown");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
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
function circuits_four() {
    console.log("did fourth");
}