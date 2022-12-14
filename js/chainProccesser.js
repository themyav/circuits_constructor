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

// TODO добавить в addElement все необходимое, например конденсатор
// Массив ячеек, из которых мы намерены обходить цепь
let ELEMENTS = new Set();
//Массив ячеек, которые будут посчитаны последовательным соединением
let SERIAL = [];

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
            for (let pair of APPLIANCES.entries()) {
                if (cell.getAttribute("src") === pair[1]) element = pair[0];
            }
            if (element !== undefined) {
                let button = "<tr><td><button id='button_" + i + "' class='button_" + i + "' is_show='false'  onclick='toggle_U_and_R(this)' onmouseover='light_picture(this, \"on\")' onmouseout='light_picture(this, \"out\")'>" + element + "</button></td></tr>";
                let input = "<tr><td><div id=\"UandR_" + i + "\" class=\"UandR_dropdown\">" + "<table>";
                str += button + input;

                switch (element) {
                    case "Источник переменного тока":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='E' onchange='validate_values(this)'>" + "ЭДС" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='A' onchange='validate_values(this)'>" + "Амплитуда" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='nu' onchange='validate_values(this)'>" + "Частота" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='fi' onchange='validate_values(this)'>" + "Фаза" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник постоянного тока":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='E' onchange='validate_values(this)'>" + "ЭДС" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Двигатель постоянного тока":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='E' onchange='validate_values(this)'>" + "ЭДС" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' uint='V' onchange='validate_values(this)'>" + "Скорость холостого тока"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='E' onchange='validate_values(this)'>" + "ЭДС" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Источник напряжения":
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='U' onchange='validate_values(this)'>" + "Напряжение" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Внутреннее сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Конденсатор":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='C' onchange='validate_values(this)'>" + "Ёмкость" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Катушка индуктивности":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='L' onchange='validate_values(this)'>" + "Индуктивность" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Лампа":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='U' onchange='validate_values(this)'>" + "Напряжение" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='r' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
                            + "<tr><td><input type=\"input\" class='show_U_and_R' unit='P' onchange='validate_values(this)'>" + "Мощность" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Резистор":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Вольтметр":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Реостат":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Амперметр":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
                            + "</table>" + "</div></td></tr>";
                        break;
                    case "Гальванометр":
                        ELEMENTS.add(cell.id);
                        str += "<tr><td><input type=\"input\" class='show_U_and_R' unit='R' onchange='validate_values(this)'>" + "Сопротивление" + "</td></tr>"
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

function validate_values(e) {
    e.getAttribute("unit");
    let value = e.value;
    if (!/^-?\d+([.,])?\d*$/i.test(value)) {
        alert("Некорректные данные.");
        value = "";
    }
    let id = e.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("id").split("_")[1];
    let button = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("button_" + id)[0];
    button.setAttribute(e.getAttribute("unit"), value);
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
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Постоянное напряжение" + "</td></tr>" + "<tr><td><div class='show_U_and_R'>" + "Амплитуда" + "</td></tr>" + "<tr><td><div class='show_U_and_R'>" + "Частота" + "</td></tr>" + "<tr><td><div class='show_U_and_R'>" + "Фаза" + "</td></tr>" + "</table>";
                    break;
                case "Источник постоянного тока":
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Ток" + "</td></tr>" + "</table>";
                    break;
                case "Двигатель постоянного тока":
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Номинальное напряжение" + "</td></tr>" + "<tr><td><div class='show_U_and_R'>" + "Скорость холостого тока" + "</td></tr>" + "<tr><td><div class='show_U_and_R'>" + "Пусковой ток" + "</td></tr>" + "</table>";
                    break;
                case "Источник напряжения":
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Напряжение" + "</td></tr>" + "</table>";
                    break;
                case "Конденсатор":
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Ёмкость" + "</td></tr>" + "</table>";
                    break;
                case "Катушка индуктивности":
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Индуктивность" + "</td></tr>" + "</table>";
                    break;
                case "Лампа":
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Напряжение" + "</td></tr>" + "<tr><td><div class='show_U_and_R'>" + "Мощность" + "</td></tr>" + "<tr><td><div class='show_U_and_R'>" + "Уровень нагрузки" + "</td></tr>" + "</table>";
                    break;
                case "Резистор":
                    div.innerHTML = "<table>" + "<tr><td><div class='show_U_and_R'>" + "Сопротивление" + "</td></tr>" + "</table>";
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


function process_up(cell, c, q, used, dir=null) {
    if (has_up(cell) && !used[id_up(c)] && has_down(id_cell(id_up(c)))) {
        if (id_cell(id_up(c)).getAttribute('src') !== OPEN_KEY) {
            if(dir !== null) q.enqueue([id_up(c), dir]);
            else q.enqueue(id_up(c));
            used[id_up(c)] = true;
        }
    }
}

function process_down(cell, c, q, used, dir=null) {
    if (has_down(cell) && !used[id_down(c)] && has_up(id_cell(id_down(c)))) {
        if (id_cell(id_down(c)).getAttribute('src') !== OPEN_KEY) {
            if(dir !== null) q.enqueue([id_down(c), dir]);
            else q.enqueue(id_down(c));
            used[id_down(c)] = true;
        }
    }
}


function process_left(cell, c, q, used, dir=null) {
    if (has_left(cell) && !used[id_left(c)] && has_right(id_cell(id_left(c)))) {
        if (id_cell(id_left(c)).getAttribute('src') !== OPEN_KEY) {
            if(dir !== null) q.enqueue([id_left(c), dir]);
            else q.enqueue(id_left(c));
            used[id_left(c)] = true;
        }
    }
}

function process_right(cell, c, q, used, dir=null) {
    if (has_right(cell) && !used[id_right(c)] && has_left(id_cell(id_right(c)))) {
        if (id_cell(id_right(c)).getAttribute('src') !== OPEN_KEY) {
            if(dir !== null) q.enqueue([id_right(c), dir]);
            else q.enqueue(id_right(c));
            used[id_right(c)] = true;
        }
    }
}

function toMatrix(){
    //TODO запретить разомкнутый ключ
    let matrix = []

    // Заполнить нулями
    for(let i = 0; i < N; i++){
        matrix[i] = []
        for(let j = 0; j < M; j++){
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

            if(src === DESK){
                matrix[i][j] = 0;
            }
            else if(src.match(wire_reg) != null){
                if(src.match(triple_reg) != null){
                    matrix[i][j] = P; //узел
                }
                else matrix[i][j] = S; //просто провод
            }
            else if(src === SOURCE || src === BATTERY ||
                src === GENERATOR || src === ENGINE ||
                src === CLOSED_KEY || src === OPEN_KEY){
                matrix[i][j] = S; //источник тока рассмотрим как просто провод
            }
            else{
                let button = document.getElementById('button_' + id_num(cell.id));
                let R = button.getAttribute('r');
                if(R !== null) matrix[i][j] = R;
                else matrix[i][j] = 'R';
            }

            //пересчитаем размеры рабочего пространства, чтобы эффективней с ним работать
            if(src !== DESK){
                x_max = Math.max(x_max, i);
                y_max = Math.max(y_max, j);
                x_min = Math.min(x_min, i);
                y_min = Math.min(y_min, j);
            }

            index++;
        }
    }
    let small_matrix = []
    for(let i = x_min; i < x_max; i++){
        for(let j = y_min; j < M; j++){

        }
    }
    console.log(x_min, y_min, x_max, y_max);
}


/*
Поиск двух ближайших узлов к элементу
 */
function searchClothestP(start){
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
        if(src.match(regex) != null){
            //console.log("I found triple " + c);
            triples.push(c);
            continue;
        }
        if(src === SOURCE || src === BATTERY){ //TODO добавить сюда проверку на другие источники тока.
            sources.push(c);
        }
        process_up(cell, c, q, used);
        process_down(cell, c, q, used);
        process_left(cell, c, q, used);
        process_right(cell, c, q, used);
    }
    if(sources.length !== 0){
        SERIAL.push(start); //есть эдс -> считаем последовательным
        return null;
    }

    if(triples.length === 2){
        if(triples[0] > triples[1]){ //меняем местами, чтобы пара была отсортирована
            let t = triples[0];
            triples[0] = triples[1];
            triples[1] = t;
        }
        return [triples, used]; //чтобы функция была мультифункциональна, вернем массив использованных эл-тов.
    }
    else return null;

} //примерно O(cnt(N) * 10) <= 100 операций

function findPPairs(){
    //console.log(ELEMENTS);
    let elementTriples = new Map();
    let triplePairs = new Set();
    ELEMENTS.forEach((value) => {
        let c = id_num(value);
        //console.log(c);
        let pairs = searchClothestP(c);
        if(pairs !== null){
            let p = (pairs[0][0].toString() + '_' + pairs[0][1].toString());
            if(elementTriples.get(p) === undefined) elementTriples.set(p, []);
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
function formPairGroups(pairElements){
    let usedResult = searchClothestP(pairElements[0])[1];
    let firstGroup = [pairElements[0]]; //есть путь до 1 элемента
    let secondGroup = []; //нет пути до 1 элемента
    for(let i = 1; i < pairElements.length; i++){
        let currentElement = pairElements[i];
        if(usedResult[currentElement]) {
            firstGroup.push(currentElement);
        }
        else secondGroup.push(currentElement);
    }
    return [firstGroup, secondGroup];
}
/*
Расчет цепи.
 */
function countChain(){
    let elementPairs = findPPairs();
    console.log(elementPairs);
    for (let [key, value] of elementPairs) {
        let groups = formPairGroups(value);
        console.log(groups);
        //console.log(key + " = " + value);
    }
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
            if(cell.getAttribute('src').match(regex) != null){
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