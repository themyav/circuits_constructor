let runnable = false;
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

// TODO добавить в addElement все необходимое, например конденсатор
// Массив ячеек, из которых мы намерены обходить цепь
let ELEMENTS = new Set();
//Массив ячеек, которые будут посчитаны последовательным соединением
let SERIAL = [];
let USED_TR = [];

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

function addElementButton() {
    let cell;
    let str = "";
    let table = document.getElementById("value");
    for (let i = 0; i < N * M; i++) {
        cell = document.getElementById("img_" + i);
        if (cell.getAttribute("free").toString() === "false") {
            let element;
            let name;
            for (let pair of APPLIANCES.entries()) {
                if (cell.getAttribute("src") === pair[1]) element = pair[0];
            }

            if (element !== undefined) {
                for (let pair of APPLIANCES.entries()) {
                    if (element === pair[0]) name = pair[1].split('/')[2];
                }
                //console.log(name);
                let button = "<tr><td><button id='button_" + i + "' class='button_" + i + "' is_show='false' name='" + name + "' onclick='toggle_U_and_R(this)' onmouseover='light_picture(this, \"on\")' onmouseout='light_picture(this, \"out\")'>" + element + "</button></td></tr>";
                let input = "<tr><td><div id=\"UandR_" + i + "\" class=\"UandR_dropdown\">" + "<table>";
                str += button + input;

                switch (element) {
                    case "Источник переменного тока":
                        str += "<tr>ЭДС<td><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='e' onchange='validate_values(this)'/></td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr>Внутреннее сопротивление<td><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr>Амплитуда<td><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='a' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мА</option><option value='deca'>А</option><option value='kilo'>кА</option><option value='mega'>МА</option></select></td></tr>"
                            + "<tr>Частота<td><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='nu' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='deca'>Гц</option><option value='kilo'>кГц</option><option value='mega'>МГц</option></select></td></tr>"
                            + "<tr>Фаза<td><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='fi' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='deg'>Градусы</option><option value='rad'>Радианы</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник постоянного тока":
                        str += "<tr>ЭДС<td><input type=\"text\" class_name='current_source' class='show_U_and_R' unit='e' onchange='validate_values(this)' value='1600'/></td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr>Внутреннее сопротивление<td><input type=\"text\" class_name='current_source' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='500'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Двигатель постоянного тока":
                        str += "<tr>ЭДС<td><input type=\"text\" class_name='generator' class='show_U_and_R' unit='e' onchange='validate_values(this)'/></td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr>Внутреннее сопротивление<td><input type=\"text\" class_name='generator' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr>Скорость холостого тока<td><input type=\"text\" class_name='generator' class='show_U_and_R' uint='v' onchange='validate_values(this)'>" + "</td>" +
                            +"<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='m/s'>м/c</option><option value='km/h'>км/ч</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник напряжения":
                        str += "<tr>Напряжение<td><input type=\"text\" class_name='voltage_source' class='show_U_and_R' unit='u' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr>Внутреннее сопротивление<td><input type=\"text\" class_name='voltage_source' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Конденсатор":
                        ELEMENTS.add(cell.id);
                        str += "<tr>Ёмкость<td><input type=\"text\" class_name='capacitor' class='show_U_and_R' unit='c' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='pica'>пФ</option><option value='nano'>нФ</option><option value='mikro'>мкФ</option><option value='deca'>Ф</option></select></td></tr>"
                            + "<tr>Сопротивление<td><input type=\"text\" class_name='capacitor' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Катушка индуктивности":
                        ELEMENTS.add(cell.id);
                        str += "<tr>Индуктивность<td><input type=\"text\" class_name='coil' class='show_U_and_R' unit='l' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='nano'>нГн</option><option value='mikro'>мкГн</option><option value='mili'>мГн</option><option value='deca'>Гн</option></select></td></tr>"
                            + "<tr>Сопротивление<td><input type=\"text\" class_name='coil' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Лампа":
                        ELEMENTS.add(cell.id);
                        str += "<tr>Напряжение<td><input type=\"text\" class_name='lamp'  class='show_U_and_R' unit='u' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr>Сопротивление<td><input type=\"text\" class_name='lamp'  class='show_U_and_R' unit='r' onchange='validate_values(this)' value='500000'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr>Мощность<td><input type=\"text\" class_name='lamp' class='show_U_and_R' unit='p' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВт</option><option value='deca'>Вт</option><option value='kilo'>кВТ</option><option value='mega'>МВТ</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Резистор":
                        ELEMENTS.add(cell.id);
                        str += "<tr>Сопротивление<td><input type=\"text\" class_name='resistor' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Вольтметр":
                        ELEMENTS.add(cell.id);
                        str += "<tr>Сопротивление<td><input type=\"text\" class_name='voltmeter' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='6000000'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Реостат":
                        ELEMENTS.add(cell.id);
                        str += "<tr>Сопротивление<td><input type=\"text\" class_name='rheostat' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Амперметр":
                        ELEMENTS.add(cell.id);

                        str += "<tr>Сопротивление<td><input type=\"text\" class_name='ammeter' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Омметр":
                        ELEMENTS.add(cell.id);
                        str += "<tr>Сопротивление<td><input type=\"text\" class_name='ohmmeter' class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "</td>" +
                            "<td><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                }
            }
        }
    }
    table.innerHTML = str;

    for (let i = 0; i < N * M; i++) {
        let current_button;
        if (document.getElementById('button_' + i) !== null) {
            current_button = document.getElementById('button_' + i);
            let inputs = document.getElementsByClassName('show_U_and_R');
            //console.log(inputs[0]);
            for (let j = 0; j < inputs.length; j++) {
                if (inputs[j].type === 'text' && inputs[j].getAttribute('class_name') === current_button.getAttribute('name')) {
                    let value = inputs[j].value;
                    let select = inputs[j].parentElement.parentElement.children[1].getElementsByClassName("show_U_and_R")[0];
                    switch (select.value) {
                        case "deca":
                            value *= 1;
                            break;
                        case "mili":
                            value *= 0.001;
                            break;
                        case "kilo":
                            value *= 1000;
                            break;
                        case "mega":
                            value *= 1000000;
                            break;
                        case "mikro":
                            value *= 0.000001;
                            break;
                        case "nano":
                            value *= 0.000000001;
                            break;
                        case "pica":
                            value *= 0.000000000001;
                            break;
                        case "m/s":
                            value *= 1;
                            break;
                        case "km/h":
                            value = value / 1000 * 60 * 60;
                            break;
                        case "deg":
                            value = value * 180 * Math.PI;
                            break;
                        case "rad":
                            value *= 1;
                            break;

                    }
                    current_button.setAttribute(inputs[j].getAttribute("unit"), value);
                }
            }
        }
    }
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

function validate_values(e) {
    let input;
    if (e.type === "text") input = e;
    else if (e.type === "select-one") input = e.parentElement.parentElement.children[0].children[0];
    input.getAttribute("unit");
    let value = input.value;
    if (!/^-?\d+([.,])?\d*$/i.test(value)) {
        alert("Некорректные данные.");
        value = "";
        document.getElementById("start_button").disabled = true;
    } else {
        document.getElementById("start_button").disabled = false;
        let div = input.parentElement.parentElement.parentElement.parentElement.parentElement;
        let id = div.getAttribute("id").split("_")[1];
        let button = input.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("button_" + id)[0];
        let select = input.parentElement.parentElement.children[1].getElementsByClassName("show_U_and_R")[0];

        switch (select.value) {
            case "deca":
                value *= 1;
                break;
            case "mili":
                value *= 0.001;
                break;
            case "kilo":
                value *= 1000;
                break;
            case "mega":
                value *= 1000000;
                break;
            case "mikro":
                value *= 0.000001;
                break;
            case "nano":
                value *= 0.000000001;
                break;
            case "pica":
                value *= 0.000000000001;
                break;
            case "m/s":
                value *= 1;
                break;
            case "km/h":
                value = value / 1000 * 60 * 60;
                break;
            case "deg":
                value = value * 180 * Math.PI;
                break;
            case "rad":
                value *= 1;
                break;

        }
        button.setAttribute(input.getAttribute("unit"), value);
    }
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


function process_up(cell, c, q, used, dir = null) {
    if (has_up(cell) && !used[id_up(c)] && has_down(id_cell(id_up(c)))) {
        if (id_cell(id_up(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_up(c), dir]);
            else q.enqueue(id_up(c));
            used[id_up(c)] = true;
        }
    }
}

function process_down(cell, c, q, used, dir = null) {
    if (has_down(cell) && !used[id_down(c)] && has_up(id_cell(id_down(c)))) {
        if (id_cell(id_down(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_down(c), dir]);
            else q.enqueue(id_down(c));
            used[id_down(c)] = true;
        }
    }
}


function process_left(cell, c, q, used, dir = null) {
    if (has_left(cell) && !used[id_left(c)] && has_right(id_cell(id_left(c)))) {
        if (id_cell(id_left(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_left(c), dir]);
            else q.enqueue(id_left(c));
            used[id_left(c)] = true;
        }
    }
}

function process_right(cell, c, q, used, dir = null) {
    if (has_right(cell) && !used[id_right(c)] && has_left(id_cell(id_right(c)))) {
        if (id_cell(id_right(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_right(c), dir]);
            else q.enqueue(id_right(c));
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
    let x_min = N, y_min = M;
    let x_max = 0, y_max = 0;


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

            //пересчитаем размеры рабочего пространства, чтобы эффективней с ним работать
            if (src !== DESK) {
                x_max = Math.max(x_max, i);
                y_max = Math.max(y_max, j);
                x_min = Math.min(x_min, i);
                y_min = Math.min(y_min, j);
            }

            index++;
        }
    }
    let small_matrix = []
    for (let i = x_min; i < x_max; i++) {
        for (let j = y_min; j < M; j++) {

        }
    }
    console.log(x_min, y_min, x_max, y_max);
}


/*
Поиск двух ближайших узлов к элементу
 */
function searchClothestP(start) {
    //console.log("let's search triples for " + start);
    let used = [];
    let triples = [];
    let sources = [];

    const regex = /triple/;
    for (let i = 0; i <= N * M; i++) used.push(false);
    let q = new Queue();

    q.enqueue(start);
    used[start] = true;

    while (!q.isEmpty) {
        let c = q.peek();
        q.dequeue();
        let cell = id_cell(c);
        let src = cell.getAttribute('src');
        //нашли узел
        if (src.match(regex) != null && !USED_TR[c]) {
            //console.log("I found triple " + c);
            triples.push(c);
            continue;
        }
        if (src === SOURCE || src === BATTERY) { //TODO добавить сюда проверку на другие источники тока.
            sources.push(c);
        }
        process_up(cell, c, q, used);
        process_down(cell, c, q, used);
        process_left(cell, c, q, used);
        process_right(cell, c, q, used);
    }
    if (sources.length !== 0) {
        //TODO is it okay to delete through iteration?
        console.log('found source, delete ' + id_str(start));
        SERIAL.push(start); //есть эдс -> считаем последовательным
        ELEMENTS.delete(id_str(start));
        return null;
    }

    if (triples.length === 2) {
        if (triples[0] > triples[1]) { //меняем местами, чтобы пара была отсортирована
            let t = triples[0];
            triples[0] = triples[1];
            triples[1] = t;
        }
        return [triples, used]; //чтобы функция была мультифункциональна, вернем массив использованных эл-тов.
    } else return null;

} //примерно O(cnt(N) * 10) <= 100 операций

function findPPairs() {
    console.log(ELEMENTS);
    let elementTriples = new Map();
    let triplePairs = new Set();
    ELEMENTS.forEach((value) => {
        console.log(value);
        let c = id_num(value);
        //console.log(c);
        let pairs = searchClothestP(c);
        if (pairs !== null) {
            let p = (pairs[0][0].toString() + '_' + pairs[0][1].toString());
            if (elementTriples.get(p) === undefined) elementTriples.set(p, []);
            elementTriples.get(p).push(c);
            triplePairs.add(p);
        }
    });
    return elementTriples;
}

/*
Для элементов, привязанных к одним узлам, проверим, соединены они последовательно или нет.
Правильная реализация --- СНМ, но сейчас будет опираться на то, что групп не больше двух.
 */
function formPairGroups(pairElements) {
    let usedResult = searchClothestP(pairElements[0])[1];
    let firstGroup = [pairElements[0]]; //есть путь до 1 элемента
    let secondGroup = []; //нет пути до 1 элемента
    for (let i = 1; i < pairElements.length; i++) {
        let currentElement = pairElements[i];
        if (usedResult[currentElement]) {
            firstGroup.push(currentElement);
        } else secondGroup.push(currentElement);
    }
    return [firstGroup, secondGroup];
}

function getGroupNumber(a) {
    console.log(a);
    let aCount = 0;
    if (a[0].length === 0) aCount++;
    if (a[1].length === 0) aCount++;
    return aCount;
}

function compareGroupPriority(a, b) {
    let aCount = 0;
    let bCount = 0;
    if (a[1][0].length === 0) aCount++;
    if (a[1][1].length === 0) aCount++;
    if (b[1][0].length === 0) bCount++;
    if (b[1][1].length === 0) bCount++;
    if (aCount > bCount) return 1;
    if (aCount === bCount) return 0;
    return -1;
}

/*
Принимает массив ЯЧЕЕК и заменяет его на массив каких-то данных о ячейке.
Например, сопротивление.
 */
function cellArrayToNumber(array, atr) {
    let numberArray = [];
    for (let i = 0; i < array.length; i++) {
        let atrContainer = document.getElementById('button_' + array[i]);
        if (atrContainer === null) atrContainer = id_cell(array[i]); //если нет кнопки, то мы в узле --- достанем значение из него
        let val = atrContainer.getAttribute(atr);
        if (val !== null) numberArray.push(parseFloat(val)); //вообще если атрибута нет, то это ошибка
        else {
            console.log(atrContainer);
        }
    }
    return numberArray;
}

/*
Считает последовательное соединение относительно массива ЧИСЕЛ
 */
function countSerialR(array) {
    let R = 0;
    for (let i = 0; i < array.length; i++) {
        R += array[i];
    }
    return R;
}

/*
Считает параллельное соединение относительно массива ЧИСЕЛ
 */
function countParallelR(array) {
    let R = 0;
    for (let i = 0; i < array.length; i++) {
        R += 1 / array[i];
    }
    return 1 / R;
}

/*
Считает силу тока по закону Ома для полной цепи
 */
function countFullCircuitI(R, r, e) {
    return (e / (R + r)).toFixed(5);
}

/*
Считает сопротивление для параллельного блока
 */
function countGroupR(group) {
    let left = cellArrayToNumber(group[0], 'r');
    let right = cellArrayToNumber(group[1], 'r');
    let leftR = countSerialR(left);
    let rightR = countSerialR(right);
    console.log(leftR + ' + ' + rightR);
    return countParallelR([leftR, rightR]);
}

/*
Удаляет из списка элементов те, которые уже рассчитаны.
 */
function removeGroup(group) {
    for (let i = 0; i < group[0].length; i++) {
        ELEMENTS.delete(id_str(group[0][i]));
        //console.log(group[0][i]);
    }
    for (let i = 0; i < group[1].length; i++) {
        ELEMENTS.delete(id_str(group[1][i]));
        //console.log(group[1][i]);
    }
    //console.log(ELEMENTS);
}

/*
Формирует для каждой пары узлов списки элементов по обе стороны от них и определяет приоритетность расчета всех углов.
 */
function handlePairGroups() {
    let triplePairs = new Map();
    let resultMap = new Map();
    let cnt = 0;
    while (ELEMENTS.size !== 0) {
        let elementPairs = findPPairs();
        //let doublePairs = new Map();
        //console.log(elementPairs);

        let groupQueue = new Queue();
        for (let [key, value] of elementPairs) {
            let groups = formPairGroups(value);
            if (getGroupNumber(groups) === 0) {
                groupQueue.enqueue([key, groups]);
            }
        }
        while (!groupQueue.isEmpty) {
            let key = groupQueue.peek()[0];
            let splitted = key.split('_');
            //console.log(splitted);
            let P1 = parseInt(splitted[0]);
            let P2 = parseInt(splitted[1]);
            let value = groupQueue.peek()[1]; //тут два массива: левый и правый.
            groupQueue.dequeue();
            let R = countGroupR(value).toFixed(5);
            console.log('my R is ' + R + ' on ' + P1 + ' ' + P2);
            removeGroup(value);
            USED_TR[P1] = true;
            USED_TR[P2] = true;
            triplePairs.set(P1, P2);
            id_cell(P1).setAttribute('r', R.toString());
            ELEMENTS.add(id_str(P1)); //map с ассоциированными значениями?
        }
        //cnt++;
        //if(cnt === 5) break;
    }

    //считаем полное сопротивление в цепи
    let finalR = countSerialR(cellArrayToNumber(SERIAL, 'r'));
    resultMap.set('Полное сопротивление в цепи', [finalR, 'Ом']);

    //считаем полную силу тока в цепи
    let source = document.getElementById('button_' + id_num(current_source[0].id));
    let r = parseFloat(source.getAttribute('r'));
    let e = parseFloat(source.getAttribute('e'));
    if (r !== null && e !== null) {
        let finalI = countFullCircuitI(finalR, r, e);
        resultMap.set('Сила тока в цепи', [finalI, 'A']);

    }
    return resultMap;


    /*const arrayPairs = [... doublePairs];
    const sortedArrayPairs = arrayPairs.sort((a, b) => compareGroupPriority(a, b));
    doublePairs = new Map(sortedArrayPairs);
    console.log(doublePairs);

    let groupQueue = new Queue();

    for (let [key, value] of doublePairs){
        let R = countGroupR(value);
        console.log('my R is ' + R);
        break;
    }*/
}

/*
Рисует таблицу с расссчитанными для цепи значениями
 */
function drawResultTable(results) {
    let resTable = $('#calcResults');
    for (let [key, value] of results) {
        resTable.append('<tr><td>' + key + '</td><td>'
            + value[0] + ' ' + value[1] + '</td></tr>');
    }
}

/*
Расчет цепи.
 */
function countChain() {
    for (let i = 0; i < N * M; i++) USED_TR.push(false);
    let results = handlePairGroups();
    drawResultTable(results);
    //console.log(findPPairs());
    //console.log(triplePairs);
}

/*
Вызывается при нажатии на кнопку "пуск". Имитирует течение тока в цепи.
 */

function runChain(e) {
    countChain();
    return;
    let MESSAGE = document.getElementById('message');

    if (e.getAttribute("is_running")==="false") {
        console.log('removing class work');
        e.classList.remove('work');
        fieldChange();
        e.setAttribute("is_running", "true");
        if (!runnable || current_source.length === 0) {
            MESSAGE.innerText = 'В цепи нет источника питания!';
            MESSAGE.style.color = 'red';
            return;
        }

        MESSAGE.innerText = 'Начинаю эмуляцию';
        MESSAGE.style.color = 'black';

        //toMatrix();

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
        console.log('adding class work');
        e.classList.add('work');
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

    ELEMENTS = new Set();
    SERIAL = [];
    USED_TR = [];

    searchKeys();
    searchSource();

    if (!runnable) {
        console.log("unable to run");
    }
    addElementButton();


}