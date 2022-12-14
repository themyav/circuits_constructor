let runnable = false;
let is_running = false;
let current_key = []; //список ключей
let current_source = []; //список источников тока

const OPEN_KEY = "resource/element/key/key.png";
const CLOSED_KEY = 'resource/element/key/closed_key.png';

const SOURCE = 'resource/element/current_source/current_source.png';
const BATTERY = "resource/element/battery_of_elements/battery_of_elements.png";
const ENGINE = "resource/element/battery_of_elements/battery_of_elements.png";
const GENERATOR = "resource/element/generator/generator.png";
const DESK = "resource/element/desk.png";



const APPLIANCES = new Map([["Амперметр", "resource/element/ammeter/ammeter.png"],
    ["Батарея элементов", "resource/element/battery_of_elements/battery_of_elements.png"],
    ["Конденсатор", "resource/element/capacitor/capacitor.png"],
    ["Катушка", "resource/element/coil/coil.png"],
    ["Источник постоянного тока", "resource/element/current_source/current_source.png"],
    ["Двигатель", "resource/element/engine/engine.png"],
    ["Предохраниетель", "resource/element/fuse/fuse.png"],
    ["Омметр", "resource/element/ohmmeter/ohmmeter.png"],
    ["Генератор", "resource/element/generator/generator.png"],
    ["Источник напряжения", "resource/element/voltage_source/voltage_source.png"],
    ["Лампа", "resource/element/lamp/lamp.png"],
    ["Резистор", "resource/element/resistor/resistor.png"],
    ["Реостат", "resource/element/rheostat/rheostat.png"],
    ["Вольтметр", "resource/element/voltmeter/voltmeter.png"]])

//константы для вычисления силы тока в цепи:
const S = 'S'
const P = 'P'
const R = 'R'

/*
Ищет все источники питания в цепи
 */

function searchSource() {
    for (let i = 0; i < N * M; i++) {
        let cell = document.getElementById("img_" + i);
        let src = cell.getAttribute("src");

        //TODO нужно ли совершить какие-то отдельные действия для всех источников энергии? или можно объединить их в один if
        if (src === BATTERY) {
            current_source.push(cell);
            runnable = true;
        } else if (src === SOURCE) {
            current_source.push(cell);
            runnable = true;
        } else if (src === ENGINE) {
            current_source.push(cell);
            runnable = true;
        } else if (src === GENERATOR) {
            current_source.push(cell);
            runnable = true;
        }
    }

}

/*
Находит все ключи в цепи и помечает незакрытые (как warning)
 */

function searchKeys() {
    for (let i = 0; i < N * M; i++) {
        let cell = document.getElementById("img_" + i);
        let src = cell.getAttribute("src");
        if (src === OPEN_KEY) {
            current_key.push(cell)

            cell.style.filter = 'brightness(50%)'; //TODO выделять как-нибудь нормально
            let message = document.getElementById('message');
            message.innerText = 'У вас есть незакрытый ключ!';
            message.style.color = 'red';
        } else if (src === CLOSED_KEY) {
            current_key.push(cell);
        }
    }
}

//Закрытие ключа по клику

// window.onclick = function (e) {
//     let cell;
//     searchKeys();
//     //TODO: вытащить из е элемент
//     for (let i = 0; i < N * M; i++) {
//         cell = document.getElementById("img_" + i);
//         //console.log(e);
//         if (e === cell && MODE === WORK) {
//             console.log("is function");
//             if (runnable) e.setAttribute("src", "resource/element/key/closed_key.png");
//             else e.setAttribute("src", OPEN_KEY);
//         }
//     }
// }

//TODO: заменить гальванометр на омметр, убрать ненужные приборы, а лучше заменить на полезные

function addElementButton() {
    let cell;
    let str = "";
    let table = document.getElementById("value");
    for (let i = 0; i < N * M; i++) {
        cell = document.getElementById("img_" + i);
        if (cell.getAttribute("free").toString() === "false") {
            let element;
            for (let pair of APPLIANCES.entries()) {
                if (cell.getAttribute("src") === pair[1]) element = pair[0];
            }
            if (element !== undefined) {
                let button = "<tr><td><button id='button_" + i + "' class='button_" + i + "' is_show='false'  onclick='toggle_U_and_R(this)' onmouseover='light_picture(this, \"on\")' onmouseout='light_picture(this, \"out\")'>" + element + "</button></td></tr>";
                let input = "<tr><td><div id=\"UandR_" + i + "\" class=\"UandR_dropdown\">" + "<table>";
                str += button + input;

                switch (element) {
                    case "Источник переменного тока":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='E' onchange='validate_values(this)'>" + "ЭДС" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мВ</option><option selected=\"selected\" value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='A' onchange='validate_values(this)'>" + "Амплитуда" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мА</option><option selected=\"selected\" value='deca'>А</option><option value='kilo'>кА</option><option value='mega'>МА</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='nu' onchange='validate_values(this)'>" + "Частота" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option selected=\"selected\" value='deca'>Гц</option><option value='kilo'>кГц</option><option value='mega'>МГц</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='fi' onchange='validate_values(this)'>" + "Фаза" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option selected=\"selected\" value='deg'>Градусы</option><option value='rad'>Радианы</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник постоянного тока":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='E' onchange='validate_values(this)'>" + "ЭДС" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мВ</option><option selected=\"selected\" value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Двигатель постоянного тока":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='E' onchange='validate_values(this)'>" + "ЭДС" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мВ</option><option selected=\"selected\" value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' uint='V' onchange='validate_values(this)'>" + "Скорость холостого тока" + "</td>" +
                            +"<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='m/s'>м/c</option><option value='km/h'>км/ч</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник напряжения":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='U' onchange='validate_values(this)'>" + "Напряжение" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мВ</option><option selected=\"selected\" value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Конденсатор":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='C' onchange='validate_values(this)'>" + "Ёмкость" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='pica'>пФ</option><option value='nano'>нФ</option><option value='mikro'>мкФ</option><option selected=\"selected\" value='deca'>Ф</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Катушка индуктивности":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='L' onchange='validate_values(this)'>" + "Индуктивность" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='nano'>нГн</option><option value='mikro'>мкГн</option><option value='mili'>мГн</option><option selected=\"selected\" value='deca'>Гн</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Лампа":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='U' onchange='validate_values(this)'>" + "Напряжение" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мВ</option><option selected=\"selected\" value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='P' onchange='validate_values(this)'>" + "Мощность" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мВт</option><option selected=\"selected\" value='deca'>Вт</option><option value='kilo'>кВТ</option><option value='mega'>МВТ</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Резистор":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Вольтметр":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Реостат":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Амперметр":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Омметр":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='set_metering(this)'><option value='mili'>мОм</option><option selected=\"selected\" value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                }
            }

        }
    }
    table.innerHTML = str;
}


function light_picture(e, where) {
    let id = e.getAttribute("id").toString().split("_");
    if (where === "on") document.getElementById("img_" + id[1]).style.filter = "brightness(50%)";
    if (where === "out") {
        document.getElementById("img_" + id[1]).style.filter = 'brightness(100%)';
    }

    //if (where === "on") document.getElementById("img_" + id[1]).setAttribute("style", "filter: brightness(50%);")
    //if (where === "out") document.getElementById("img_" + id[1]).setAttribute("style", "filter: brightness(100%);")
}

/*
Получаем данные из инпутов и кладём в атрибут кнопки
*/

//TODO: сделать валидацию по выбранной метрике
function validate_values(e) {
    e.getAttribute("unit");
    let value = e.value;
    if (!/^-?\d+([.,])?\d*$/i.test(value)) {
        alert("Некорректные данные.");
        value = "";
    }
    let div = e.parentElement.parentElement.parentElement.parentElement.parentElement;
    let id =div.getAttribute("id").split("_")[1];
    let button = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("button_" + id)[0];
    let select = e.parentElement.parentElement.children[1].getElementsByClassName("show_U_and_R")[0];
    console.log(select);

    switch (select.value){
        case "deca":
            value*=1;
            break;
        case "mili":
            value*=0.001;
            break;
        case "kilo":
            value*=1000;
            break;
        case "mega":
            value*=1000000;
            break;
        case "mikro":
            value*=0.000001;
            break;
        case "nano":
            value*=0.000000001;
            break;
        case "pica":
            value*=0.000000000001;
            break;
        case "m/s":
            value*=1;
            break;
        case "km/h":
            value= value/1000*60*60;
            break;
        case "deg":
            value=value*180*Math.PI;
            break;
        case "rad":
            value*=1;
            break;

    }
    button.setAttribute(e.getAttribute("unit"), value);
}

function set_metering(e) {

}

/*
Реализация очереди из интернета
 */

class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }

    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }

    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek() {
        return this.elements[this.head];
    }
}


function id_num(id) {
    return parseInt(id.substring(4));
}

function id_str(id) {
    return 'img_' + id.toString();
}

function id_cell(id) {
    return document.getElementById(id_str(id));
}

function id_up(x) {
    return x - M;
}

function id_down(x) {
    return x + M;
}

function id_right(x) {
    return x + 1;
}

function id_left(x) {
    return x - 1;
}

function has_up(cell) {
    if (cell == null) return false;
    return cell.getAttribute('up') === 'true';
}

function has_down(cell) {
    if (cell == null) return false;
    return cell.getAttribute('down') === 'true';
}

function has_left(cell) {
    if (cell == null) return false;
    return cell.getAttribute('left') === 'true';
}

function has_right(cell) {
    if (cell == null) return false;
    return cell.getAttribute('right') === 'true';
}

//TODO: заменить гальванометр на омметр, убрать ненужные приборы, а лучше заменить на полезные

//Функция меняющие поля ввода на просто текст в момент запуска
function fieldChange() {
    for (let i = 0; i < N * M; i++) {
        let element;
        let div = document.getElementById("UandR_" + i);
        let button = document.getElementById("button_" + i);
        let cell = document.getElementById("img_" + i);
        for (let pair of APPLIANCES.entries()) {
            if (cell.getAttribute("src") === pair[1]) element = pair[0];
        }
        if (button !== null) {
            //Скорее всего надо будтет просто из кнопки вытаскивать значения и писать их в div либо просто сделать input disabled
            switch (element) {
                case "Источник переменного тока":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "ЭДС - " + button.getAttribute("e").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Внутреннее сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Амплитуда - " + button.getAttribute("a").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Частота - " + button.getAttribute("nu").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Фаза - " + button.getAttribute("fi").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Источник постоянного тока":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "ЭДС - " + button.getAttribute("e").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Внутреннее сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Двигатель постоянного тока":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "ЭДС - " + button.getAttribute("e").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Внутреннее сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Скорость холостого тока - " + button.getAttribute("v").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Источник напряжения":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Напряжение - " + button.getAttribute("u").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Внутреннее сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Конденсатор":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Ёмкость - " + button.getAttribute("c").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Внутреннее сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Катушка индуктивности":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Индуктивнсоть - " + button.getAttribute("l").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Внутреннее сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Лампа":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Напряжение - " + button.getAttribute("u").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "<tr><td><div class='show_U_and_R'>" + "Мощность - " + button.getAttribute("p").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Резистор":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Вольтметр":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Реостат":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Амперметр":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
                case "Омметр":
                    div.innerHTML = "<table>"
                        + "<tr><td><div class='show_U_and_R'>" + "Сопротивление - " + button.getAttribute("r").toString() + "</td></tr>"
                        + "</table>";
                    break;
            }
        }
    }

}

/*
Уменьшает поле с цепью, чтобы отрисовать график
 */
function resizeGallery(run = true) {
    let gallery = document.getElementById("gallery");
    if (run) gallery.style.height = '400px'; else gallery.style.height = '';
}

/*
 Определяет направление тока --- куда направлена "длинная палочка", т.е плюс
 */
function current_direction(cell) {
    let rotation = parseInt(cell.getAttribute('rotation'));
    if (rotation === 0) return 'right';
    if (rotation === 90 || rotation === -270) return 'down';
    if (rotation === 180 || rotation === -180) return 'left';
    if (rotation === 270 || rotation === -90) return 'up';
    console.log("Проблемы с углом поворота...." + rotation);
}


function process_up(cell, c, dir, q, used) {
    if (has_up(cell) && !used[id_up(c)] && has_down(id_cell(id_up(c)))) {
        if (id_cell(id_up(c)).getAttribute('src') !== OPEN_KEY) {
            q.enqueue([id_up(c), dir]);
            used[id_up(c)] = true;
        }
    }
}

function process_down(cell, c, dir, q, used) {
    if (has_down(cell) && !used[id_down(c)] && has_up(id_cell(id_down(c)))) {
        if (id_cell(id_down(c)).getAttribute('src') !== OPEN_KEY) {
            q.enqueue([id_down(c), dir]);
            used[id_down(c)] = true;
        }
    }
}


function process_left(cell, c, dir, q, used) {
    if (has_left(cell) && !used[id_left(c)] && has_right(id_cell(id_left(c)))) {
        if (id_cell(id_left(c)).getAttribute('src') !== OPEN_KEY) {
            q.enqueue([id_left(c), dir]);
            used[id_left(c)] = true;
        }
    }
}

function process_right(cell, c, dir, q, used) {
    if (has_right(cell) && !used[id_right(c)] && has_left(id_cell(id_right(c)))) {
        if (id_cell(id_right(c)).getAttribute('src') !== OPEN_KEY) {
            q.enqueue([id_right(c), dir]);
            used[id_right(c)] = true;
        }
    }
}

function toMatrix() {
    //TODO запретить разомкнутый ключ
    let matrix = []

    // Заполнить нулями
    for (let i = 0; i < N; i++) {
        matrix[i] = []
        for (let j = 0; j < M; j++) {
            matrix[i][j] = 0
        }
    }

    let index = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {

            let cell = document.getElementById('img_' + index.toString());
            let src = cell.getAttribute('src');
            const wire_reg = /wire/;
            const triple_reg = /triple/;

            if (src === DESK) {
                matrix[i][j] = 0;
            } else if (src.match(wire_reg) != null) {
                if (src.match(triple_reg) != null) {
                    matrix[i][j] = P; //узел
                } else matrix[i][j] = S; //просто провод
            } else if (src === SOURCE || src === BATTERY ||
                src === GENERATOR || src === ENGINE ||
                src === CLOSED_KEY || src === OPEN_KEY) {
                matrix[i][j] = S; //источник тока рассмотрим как просто провод
            } else {
                let button = document.getElementById('button_' + id_num(cell.id));
                let R = button.getAttribute('r');
                if (R !== null) matrix[i][j] = R;
                else matrix[i][j] = 'R';
            }

            index++;
        }
    }

    console.log(matrix);
}


/*
Вызывается при нажатии на кнопку "пуск". Имитирует течение тока в цепи.
 */

function runChain(e) {
    let MESSAGE = document.getElementById('message');

    if (!is_running) {
        fieldChange();
        e.setAttribute("is_running", "true");
        is_running = true;
        if (!runnable || current_source.length === 0) {
            MESSAGE.innerText = 'В цепи нет источника питания!';
            MESSAGE.style.color = 'red';
            return;
        }

        MESSAGE.innerText = 'Начинаю эмуляцию';
        MESSAGE.style.color = 'black';

        toMatrix();

        let used = []
        for (let i = 0; i <= N * M; i++) used.push(false);
        let q = new Queue();

        //Пока что ток растекается только от первого источника энергии
        let start = id_num(current_source[0].id);

        //Определим направление тока:
        let direction = current_direction(current_source[0]);
        console.log(direction);

        //Положим в очередь источник тока и направление
        q.enqueue([start, direction]);
        used[start] = true;
        while (!q.isEmpty) {
            let c = q.peek()[0];
            let dir = q.peek()[1];
            q.dequeue();
            //console.log('go to ' + c);

            let cell = id_cell(c);
            //тут будет вызываться функция прибора
            //этот фильтр будет заменен на что-нибудь красивее..

            const regex = /triple/;
            //console.log(cell.getAttribute('src'));
            if (cell.getAttribute('src').match(regex) != null) {
                console.log("I go to triple " + c);
            }
            cell.style.filter = 'drop-shadow(5px 5px 10px yellow)';
            if (c === start) {
                if (dir === 'up') process_up(cell, c, dir, q, used); else if (dir === 'down') process_down(cell, c, dir, q, used); else if (dir === 'left') process_left(cell, c, dir, q, used); else if (dir === 'right') process_right(cell, c, dir, q, used);

            } else {
                process_up(cell, c, dir, q, used);
                process_down(cell, c, dir, q, used);
                process_left(cell, c, dir, q, used);
                process_right(cell, c, dir, q, used);
            }

        }
        resizeGallery(true);
        drawGraphic()
    } else {
        is_running = false;
        e.setAttribute("is_running", "false");
        drawGraphic(false); //если я правильно поняла, тут кнопка отжимается
    }
}


/*
Точка входа, из которой запускается вся предобработка.
Нужна для того, чтобы инкапсулировать режим работы
 */


function startWorkingMode() {
    //обновим значения, если цепь до этого запускалась
    runnable = false;
    current_key = [];
    current_source = [];

    searchKeys();
    searchSource();
    console.log(current_source);

    if (!runnable) {
        console.log("unable to run");
    }
    addElementButton();
}