let runnable = false;
let current_key = []; //список ключей
let current_source = []; //список источников тока

const OPEN_KEY = "resource/element/key/key.png";
const CLOSED_KEY = 'resource/element/key/closed_key.png';

const SOURCE = 'resource/element/current_source/current_source.png';
const BATTERY = "resource/element/battery_of_elements/battery_of_elements.png";
const ENGINE = "resource/element/battery_of_elements/battery_of_elements.png";
const AC_SOURCE = "resource/element/ac_source/ac_source.png";

let SOURCES = [SOURCE, BATTERY, ENGINE, AC_SOURCE];

const DESK = "resource/element/desk.png";

const APPLIANCES = new Map([["Источник переменного тока", "resource/element/ac_source/ac_source.png"],
    ["Амперметр", "resource/element/ammeter/ammeter.png"],
    ["Батарея элементов", "resource/element/battery_of_elements/battery_of_elements.png"],
    ["Конденсатор", "resource/element/capacitor/capacitor.png"],
    ["Катушка индуктивности", "resource/element/coil/coil.png"],
    ["Источник постоянного тока", "resource/element/current_source/current_source.png"],
    ["Двигатель", "resource/element/engine/engine.png"],
    ["Предохраниетель", "resource/element/fuse/fuse.png"],
    ["Омметр", "resource/element/ohmmeter/ohmmeter.png"],
    ["Источник напряжения", "resource/element/voltage_source/voltage_source.png"],
    ["Лампа", "resource/element/lamp/lamp.png"],
    ["Резистор", "resource/element/resistor/resistor.png"],
    ["Вольтметр", "resource/element/voltmeter/voltmeter.png"]])

//константы для вычисления силы тока в цепи:
const S = 'S'
const P = 'P'
const R = 'R'

// TODO добавить в addElement все необходимое, например конденсатор
// Массив ячеек, из которых мы намерены обходить цепь
let ELEMENTS = new Set();

//Константный массив ячеек
let ELEMENTS_GLOBAL = new Set();

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
        if (src === DESK) continue;

        for (let j = 0; j < SOURCES.length; j++) {
            if (src === SOURCES[j]) {
                current_source.push(cell);
                runnable = true;
                if (src === AC_SOURCE) IS_I_CONST = false; //переменный ток!
            }
        }
    }
    console.log('check for runable ' + runnable);

}

/*
Находит все ключи в цепи и помечает незакрытые (как warning)
 */

function searchKeys() {
    let is_closed = true;
    let str;
    if (MODE === WORK) {
        str = "Вы в режиме запуска";
    }
    if (MODE === BUILD) {
        str = "Вы в режиме строительства";
    }

    for (let i = 0; i < N * M; i++) {
        let cell = document.getElementById("img_" + i);
        let src = cell.getAttribute("src");
        if (src === OPEN_KEY) {
            current_key.push(cell)

            //TODO вернуть
            //cell.style.filter = 'brightness(50%)'; //TODO выделять как-нибудь нормально
            is_closed = false;
        } else if (src === CLOSED_KEY) {
            is_closed = true;
            current_key.push(cell);
        }
    }
    if (!is_closed) {
        let message = document.getElementById('message');
        message.innerText = 'У вас есть незакрытый ключ!';
        message.style.color = 'red';
    } else {
        let message = document.getElementById('message');
        message.innerText = str;
        message.style.color = 'black';
    }
}

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
                        str += "<tr><td>ЭДС:<br><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='e' onchange='validate_values(this)'value='1600'/></td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td>Внутреннее сопротивление: <br><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='r' onchange='validate_values(this)'value='800'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr><td>Амплитуда<br><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='a' onchange='validate_values(this)' value='1000'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мА</option><option value='deca'>А</option><option value='kilo'>кА</option><option value='mega'>МА</option></select></td></tr>"
                            + "<tr><td>Частота<br><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='nu' onchange='validate_values(this)'value='50'> " + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='deca'>Гц</option><option value='kilo' selected='true'>кГц</option><option value='mega'>МГц</option></select></td></tr>"
                            + "<tr><td>Фаза<br><input class_name='ac_source' type=\"text\" class='show_U_and_R' unit='fi' onchange='validate_values(this)' value='32'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='deg'>Градусы</option><option value='rad'>Радианы</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник постоянного тока":
                        str += "<tr><td>ЭДС: <br><input type=\"text\" class_name='current_source' class='show_U_and_R' unit='e' onchange='validate_values(this)' value='1600'/></td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td>Внутреннее сопротивление: <br><input type=\"text\" class_name='current_source' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='500'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Батарея элементов":
                        str += "<tr><td>ЭДС: <br><input type=\"text\" class_name='battery_of_elements' class='show_U_and_R' unit='e' onchange='validate_values(this)' value='1600'/></td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td>Внутреннее сопротивление: <br><input type=\"text\" class_name='battery_of_elements' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='500'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Двигатель":
                        str += "<tr><td>Магнитный поток возбуждения: <br><input type=\"text\" class_name='engine' class='show_U_and_R' unit='f' onchange='validate_values(this)' value='1600'/></td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mikro'>мкВб</option><option value='mili'>мВб</option><option value='deca'>Вб</option></select></td></tr>"
                            + "<tr><td>Внутреннее сопротивление: <br><input type=\"text\" class_name='engine' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='300'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr><td>Частота вращения: <br><input type=\"text\" class_name='engine' class='show_U_and_R' uint='nu' onchange='validate_values(this)' value='50'>" + "</td>" +
                            +"<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='deca'>Гц</option><option value='kilo'>кГц</option><option value='mega'>МГц</option></select></td></tr>"
                            + "<tr><td>Мощность: <br><input type=\"text\" class_name='engine' class='show_U_and_R' uint='p' onchange='validate_values(this)' value='1000'>" + "</td>" +
                            +"<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВт</option><option value='deca'>Вт</option><option value='kilo'>кВТ</option><option value='mega'>МВТ</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник напряжения":
                        str += "<tr><td>Напряжение: <br><input type=\"text\" class_name='voltage_source' class='show_U_and_R' unit='u' onchange='validate_values(this)' value='550'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td>Внутреннее сопротивление: <br><input type=\"text\" class_name='voltage_source' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='240'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Конденсатор":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td>Ёмкость: <br><input type=\"text\" class_name='capacitor' class='show_U_and_R' unit='c' onchange='validate_values(this)' value='130'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='pica'>пФ</option><option value='nano'>нФ</option><option value='mikro'>мкФ</option><option value='deca'>Ф</option></select></td></tr>"
                            + "<tr><td>Сопротивление: <br><input type=\"text\" class_name='capacitor' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='250'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Катушка индуктивности":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td>Индуктивность: <br><input type=\"text\" class_name='coil' class='show_U_and_R' unit='l' onchange='validate_values(this)' value='80'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='nano'>нГн</option><option value='mikro'>мкГн</option><option value='mili'>мГн</option><option value='deca'>Гн</option></select></td></tr>"
                            + "<tr><td>Сопротивление: <br><input type=\"text\" class_name='coil' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='400'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Лампа":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td>Напряжение: <br><input type=\"text\" class_name='lamp'  class='show_U_and_R' unit='u' onchange='validate_values(this)' value='160'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВ</option><option value='deca'>В</option><option value='kilo'>кВ</option><option value='mega'>МВ</option></select></td></tr>"
                            + "<tr><td>Сопротивление: <br><input type=\"text\" class_name='lamp'  class='show_U_and_R' unit='r' onchange='validate_values(this)' value='500000'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "<tr><td>Мощность: <br><input type=\"text\" class_name='lamp' class='show_U_and_R' unit='p' onchange='validate_values(this)' value='500'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мВт</option><option value='deca'>Вт</option><option value='kilo'>кВТ</option><option value='mega'>МВТ</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Резистор":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td>Сопротивление: <br><input type=\"text\" class_name='resistor' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='120'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Предохраниетель":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td>Сопротивление: <br><input type=\"text\" class_name='fuse' class='show_U_and_R' unit='r' onchange='validate_values(this)'value='430'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Вольтметр":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td>Сопротивление: <br><input type=\"text\" class_name='voltmeter' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='6000000'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Амперметр":
                        ELEMENTS.add(cell.id);

                        str += "<tr><td>Сопротивление: <br><input type=\"text\" class_name='ammeter' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='150'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Омметр":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td>Сопротивление: <br><input type=\"text\" class_name='ohmmeter' class='show_U_and_R' unit='r' onchange='validate_values(this)' value='150'>" + "</td>" +
                            "<td><br><select class='show_U_and_R' onchange='validate_values(this)'><option value='mili'>мОм</option><option value='deca'>Ом</option><option value='kilo'>кОм</option><option value='mega'>МОм</option></select></td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    default:

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
    else if (e.type === "select-one") input = e.parentElement.parentElement.children[0].children[1];
    input.getAttribute("unit");
    let value = input.value;
    let regex = /^-?\d+[.,]?\d{0,10}$/;
    if (value.match(regex) === null) {
        alert("Вы ввели некорректные данные в форму: " + value);
        value = "";
        document.getElementById("start_button").disabled = true;
    } else {
        document.getElementById("start_button").disabled = false;
        let div = input.parentElement.parentElement.parentElement.parentElement.parentElement;
        let id = div.getAttribute("id").split("_")[1];
        let button = input.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("button_" + id)[0];
        let select = input.parentElement.parentElement.children[1].getElementsByClassName("show_U_and_R")[0];

        document.cookie += div.id+", "+input.getAttribute("unit")+", "+value+", "+select.value+"/";
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
            case "deg":
                value = value * 180 * Math.PI
                break;
            case "rad":
                break;
            // case "deg":
            //     break;
            // case "rad":
            //     value = value / (180 * Math.PI);
            //     break;
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

let ELEMENTS_COUNT_Q = new Queue();



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

function replaceField(div, value){
    let html = div.innerHTML.split('<br>');
    div.innerHTML = '';
    for(let i = 0; i < html.length - 1; i++) div.innerHTML += html[i];
    div.innerHTML += value;
}

//Функция меняющие поля ввода на просто текст в момент запуска
function fieldChange(is_running) {
    for (let i = 0; i < N * M; i++) {
        let element;
        let div = document.getElementById("UandR_" + i);
        let button = document.getElementById("button_" + i);
        let cell = document.getElementById("img_" + i);
        for (let pair of APPLIANCES.entries()) {
            if (cell.getAttribute("src") === pair[1]) element = pair[0];
        }
        if (button !== null) {

            document.querySelectorAll('.show_U_and_R').forEach(input => {
                if (is_running === true) input.disabled = true;
                else input.disabled = false;
            });
            switch (element) {
                case "Вольтметр":
                    if(ELEMENT_CALCULATION.has(i)){
                        let U = ELEMENT_CALCULATION.get(i)[1];
                        replaceField(div, "<br><table>"
                            + "<tr><td><header style='font-size: larger'>Результат измерения</header><div class='show_U_and_R' style='font-size: medium'>" + "Напряжение на участке цепи: " + U + " В</td></tr>"
                            + "</table>");
                    }

                    break;
                case "Амперметр":
                    if(ELEMENT_CALCULATION.has(i)) {
                        let I = ELEMENT_CALCULATION.get(i)[1];
                        replaceField(div, "<br><table>"
                            + "<tr><td><header style='font-size: larger'>Результат измерения</header><div class='show_U_and_R'>" + "Сила тока на участке цепи: " + I.toFixed(5) + " А</td></tr>"
                            + "</table>");
                    }
                    break;
                case "Омметр":
                    if(ELEMENT_CALCULATION.has(i)) {
                        let R = ELEMENT_CALCULATION.get(i)[1];
                        replaceField(div, "<br><table>"
                            + "<tr><td><header style='font-size: larger'>Результат измерения</header><div class='show_U_and_R' style='font-size: medium'>" + "Сопротивление на участке цепи: " + R + " Ом</td></tr>"
                            + "</table>");
                    }
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
    if (has_up(cell) && !used[id_up(c)] && has_down(id_cell(id_up(c))) && !IS_BAD_CELL[id_up(c)]) {
        if (id_cell(id_up(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_up(c), dir]);
            else q.enqueue(id_up(c));
            used[id_up(c)] = true;
        }
    }
}

function process_down(cell, c, q, used, dir = null) {
    if (has_down(cell) && !used[id_down(c)] && has_up(id_cell(id_down(c))) && !IS_BAD_CELL[id_down(c)]) {
        if (id_cell(id_down(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_down(c), dir]);
            else q.enqueue(id_down(c));
            used[id_down(c)] = true;
        }
    }
}


function process_left(cell, c, q, used, dir = null) {
    if (has_left(cell) && !used[id_left(c)] && has_right(id_cell(id_left(c))) && !IS_BAD_CELL[id_left(c)]) {
        if (id_cell(id_left(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_left(c), dir]);
            else q.enqueue(id_left(c));
            used[id_left(c)] = true;
        }
    }
}

function process_right(cell, c, q, used, dir = null) {
    if (has_right(cell) && !used[id_right(c)] && has_left(id_cell(id_right(c))) && !IS_BAD_CELL[id_right(c)]) {
        if (id_cell(id_right(c)).getAttribute('src') !== OPEN_KEY) {
            if (dir !== null) q.enqueue([id_right(c), dir]);
            else q.enqueue(id_right(c));
            used[id_right(c)] = true;
        }
    }
}

/*
Храним, какие ячейки тупиковые, а какие нет
 */
let IS_BAD_CELL = [];

/*

 */

function countNonAllowedWays(cell){
    let k = 0;
    let c = id_num(cell.id);
    if(!has_up(cell) || !has_down(id_cell(id_up(c))) || IS_BAD_CELL[id_up(c)]) {
        //console.log(has_up(cell));
        //console.log(has_down(id_cell(id_up(c))));
        k++;
    }
    //нет вообще соседа, либо он есть, но нет пути от него
    if(!has_left(cell) || !has_right(id_cell(id_left(c))) || IS_BAD_CELL[id_left(c)]) {
        //console.log(has_left(cell));
        //console.log(has_right(id_cell(id_left(c))));
        k++;
    }
    if(!has_down(cell) || !has_up(id_cell(id_down(c))) || IS_BAD_CELL[id_down(c)]) k++;

    if(!has_right(cell) || !has_left(id_cell(id_right(c))) || IS_BAD_CELL[id_right(c)]){
        k++;
    }
    return k;
}

/*
Проверяем, является ли ячейка тупиковой.
Тупик = есть проход не больше, чем в одну сторону
 */
function isDeadEnd(cell){
    if(IS_BAD_CELL[id_num(cell.id)]) return false; //если мы уже проверяли, то больше не интересно
    else if(cell.getAttribute('src') === DESK ||
      cell.getAttribute('src') === OPEN_KEY) return true; //а если в первый раз, то
    else if(IS_I_CONST && cell.getAttribute('src') === APPLIANCES.get('Конденсатор')) return true;

    let k = countNonAllowedWays(cell);
    //console.log('k is ' + k + ' ' + cell.id);
    return k > 2;
}


/*
Обход цепи в глубину
 */
function dfs(cell){
    let c = id_num(cell.id);
    IS_BAD_CELL[c] = true;
    if(cell.getAttribute('src') !== DESK) {
        //cell.style.filter = 'drop-shadow(5px 5px 10px red)';
        //console.log('evil dfs from ' + c);
    }
    if(has_up(cell)){
        let up = id_cell(id_up(c));
        if(has_down(up) && isDeadEnd(up)) dfs(up);
    }
    if(has_down(cell)){
        let down = id_cell(id_down(c));
        if(has_up(down) && isDeadEnd(down)) dfs(down);
    }
    if(has_left(cell)){
        let left = id_cell(id_left(c));
        //console.log('I am ' + c + ' my left is ' + left.id + ' his end ' + his_status);

        if(has_right(left) && isDeadEnd(left)) dfs(left);
    }
    if(has_right(cell)){
        let right = id_cell(id_right(c));
        if(has_left(right) && isDeadEnd(right)) dfs(right);
    }
}

/*
Проверяет, в каких участках цепи ток будет течь бесконечно, а в каких --- нет.
 */

function checkCurrentWay(){
    for(let i = 0; i < N * M; i++) IS_BAD_CELL.push(false);

    for(let i = 0; i < N * M; i++) {
        let cell = document.getElementById(id_str(i));
        if (isDeadEnd(cell)) {
            dfs(cell);
        }
    }
}

/*
Проверяет, какие угловые провода перестали выполнять функцию угловых проводов
 */

function checkTripleFunctionality(){
    for(let i = 0; i < N * M; i++){
        let cell = document.getElementById(id_str(i));
        //if(!IS_BAD_CELL[i]) cell.style.filter = 'drop-shadow(5px 5px 10px yellow)';
        const regex = /triple/;
        if(cell.getAttribute('src').match(regex)){
            if(countNonAllowedWays(cell) > 1){ // -> в 2+ ячейки нельзя больше зайти, уже какой-то не угловой провод
                USED_TR[id_num(cell.id)] = true;
            }
        }
    }
}

/*
Изменяет сообщение, выводимое сверху
 */
function changeInfoMessage(message, info, color){
    message.innerText = info;
    message.style.color = color;
}

/*
Вызывается при нажатии на кнопку "пуск". Имитирует течение тока в цепи,
то есть именно рисует, как ток пойдет...
 */
function runChain(e) {
    let MESSAGE = document.getElementById('message');
    if (e.getAttribute("is_running") === "false") {
        e.style.backgroundColor = "indianred";
        e.setAttribute("is_running", "true");

        if (!runnable || current_source.length === 0) {
            changeInfoMessage(MESSAGE, 'В цепи нет источника питания!', 'red');
            return;
        }

        let used = []
        for (let i = 0; i <= N * M; i++) used.push(false);
        let q = new Queue();
        //Пока что ток растекается только от первого источника энергии
        let start = null;
        let direction = null;
        let cnt = 0;
        for(let i = 0; i < current_source.length; i++){
            if(!IS_BAD_CELL[id_num(current_source[i].id)]){
                start = id_num(current_source[0].id);
                direction = current_direction(current_source[0]);
                cnt++;
            }
        }
        if(start === null){
            changeInfoMessage(MESSAGE, 'В цепи не будет течь ток', 'red');
            return;
        }
        else if(cnt > 1){
            changeInfoMessage(MESSAGE, 'Конструктор не поддерживает работу с двумя источниками тока', 'orange');
            return;
        }
        changeInfoMessage(MESSAGE, 'Эмуляция запуска цепи...', 'black');
        countChain();
        if(MESSAGE.style.color === 'red') {
            //runChain(e); //TODO нужно как-то все прерывать и делать кнопку назад зеленой...
            return;
            //TODO возможно не стоит этого делать или проверять по другому, но если какой-то прибор не правильно подключен, то не пропустим ток
        }
        fieldChange(true);


        //Положим в очередь источник тока и направление
        q.enqueue([start, direction]);
        used[start] = true;
        while (!q.isEmpty) {
            let c = q.peek()[0];
            let dir = q.peek()[1];
            q.dequeue();
            let cell = id_cell(c);
            let src = cell.getAttribute('src');
            cell.setAttribute('src', src.split('.')[0] + '_work.png');
            if (c === start) {
                if (dir === 'up') process_up(cell, c, q, used, dir);
                else if (dir === 'down') process_down(cell, c, q, used, dir);
                else if (dir === 'left') process_left(cell, c, q, used, dir);
                else if (dir === 'right') process_right(cell, c, q, used, dir);
            } else {
                process_up(cell, c, q, used, dir);
                process_down(cell, c, q, used, dir);
                process_left(cell, c, q, used, dir);
                process_right(cell, c, q, used, dir);
            }
        }
        if(!IS_I_CONST) startI();
    } else {
        if(!IS_I_CONST) stopI();
        makeCellsDefault();
        fieldChange(false);
        e.style.backgroundColor = "darkseagreen";
        e.setAttribute("is_running", "false");
        prepareArrays();
        ELEMENTS_GLOBAL.forEach((value) => {
            ELEMENTS.add(value);
        });
    }
}



function prepareArrays(){
    runnable = false;
    current_key = [];
    current_source = [];

    ELEMENTS = new Set();
    ELEMENTS_COUNT_Q = new Queue();
    ELEMENT_CALCULATION = new Map();
    SERIAL = [];
    USED_TR = [];
    IS_BAD_CELL = []
    IS_I_CONST = true;
    //про узлы
    P_INNER = new Map();
    P_CONST_I = new Map();
    P_PARENT = new Map();
    searchKeys();
    searchSource();

    if (!runnable) {
        console.log("unable to run");
    }
    checkCurrentWay();
    checkTripleFunctionality();
}

/*
Точка входа, из которой запускается вся предобработка.
Нужна для того, чтобы инкапсулировать режим работы
 */
function startWorkingMode() {
    //обновим значения, если цепь до этого запускалась
    prepareArrays();
    addElementButton(); //TODO связано с проверочным обходом
    ELEMENTS.forEach((value) => {
        ELEMENTS_GLOBAL.add(value);
    });
}

/*
Снимает анимацию тока с элементов
 */
function makeCellsDefault(){
    for(let i = 0; i < N * M; i++){
        let cell = document.getElementById(id_str(i));
        let src = cell.getAttribute('src');
        if(src === DESK) continue;
        let newSrc = src.split('_work');
        if(newSrc.length === 1) continue; //ячейка не была помечена рабочей
        newSrc = newSrc[0] + '.png';
        cell.setAttribute('src', newSrc);
    }
}

/*
Выполняется при выходе из режима работы
 */

function stopWorkingMode(){
    makeCellsDefault();
    document.getElementById('calcResults').innerHTML = '';
    stopGraphic();
}
