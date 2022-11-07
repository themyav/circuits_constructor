const LAMP = 'lamp';
const WIRE = 'wire';

var current = 'lamp';
var action  = chooseElement



$(document).ready(function (){

    //Отлавливаем клик по картинке и всегда ее заменяем на что-то указанной функцией
    $('body').on('click', 'img', function (event){
        action(this);
    });

    // Отлавливаем нажатие на кнопку и выбираем, с каким эдементом меню заботаем
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