let runnable = false;
let current_key = null;
const KEY = "resource/element/key/key.png";
const BATTERY = "resource/element/battery_of_elements/battery_of_elements.png";
const ENGINE = "resource/element/battery_of_elements/battery_of_elements.png";
const GENERATOR = "resource/element/generator/generator.png";


const APPLIANCES = new Map([
        ["Амперметр", "resource/element/ammeter/ammeter.png"],
        ["Батарея элементов", "resource/element/battery_of_elements/battery_of_elements.png"],
        ["Конденсатор", "resource/element/capacitor/capacitor.png"],
        ["Катушка", "resource/element/coil/coil.png"],
        ["Источник постоянного тока", "resource/element/current_source/current_source.png"],
        ["Двигатель", "resource/element/engine/engine.png"],
        ["Предохраниетель", "resource/element/fuse/fuse.png"],
        ["Гальвонометр", "resource/element/galvanometer/galvanometer.png"],
        ["Генератор", "resource/element/generator/generator.png"],
        ["Обогревательный элемент", "resource/element/heating/heating.png"],
        ["Лампа", "resource/element/lamp/lamp.png"],
        ["Резистор", "resource/element/resistor/resistor.png"],
        ["Реостат", "resource/element/rheostat/rheostat.png"],
        ["Вольтметр", "resource/element/voltmeter/voltmeter.png"]
    ]
)


function searchKey() {
    let cell;
    for (let i = 0; i < N * M; i++) {
        cell = document.getElementById("img_" + i);
        if(cell.getAttribute("src") === KEY){
            console.log("found key///" + cell + " " + i)
            if(current_key === null){
                current_key = cell;
                runnable = true;
                console.log(current_key);
            }
            else{
                runnable = false;
                console.log("two keys in forbidden");
            }
        }else if(cell.getAttribute("src") === BATTERY){}
        else if(cell.getAttribute("src") === ENGINE){}
        else if(cell.getAttribute("src") === GENERATOR){}
    }
    console.log(current_key)
    runnable = true;
}

// window.onclick = function (e) {
//     let cell;
//     searchKey();
//     //TODO: вытащить из е элемент
//     for (let i = 0; i < N * M; i++) {
//         cell = document.getElementById("img_" + i);
//         //console.log(e);
//         if (e === cell && MODE === WORK) {
//             console.log("is function");
//             if (runnable) e.setAttribute("src", "resource/element/key/closed_key.png");
//             else e.setAttribute("src", KEY);
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
                str += "<tr><td><button id='button_" + i + "' is_show='false'" + i +
                    " onclick='toggle_U_and_R(this)' onmouseover='light_picture(this, \"on\")' onmouseout='light_picture(this, \"out\")'>" + element + "</button></td></tr>" +
                    "<tr><td><div id=\"UandR_" + i + "\" class=\"UandR_dropdown\">" +
                    "<table><tr><td><input type=\"input\" class='show_U_and_R'>" + "Напряжение" +
                    "</td></tr><tr><td><input type=\"input\" class='show_U_and_R'>" + "Сопротивление" +
                    "</td></tr></table>" +
                    "</div></td></tr>";
            }
        }
    }
    table.innerHTML = str;
}


function light_picture(e, where) {
    let id = e.getAttribute("id").toString().split("_");
    if (where === "on") document.getElementById("img_" + id[1]).style.filter = "brightness(50%)";
    if (where === "out") document.getElementById("img_" + id[1]).style.filter = "brightness(100%)";
    //if (where === "on") document.getElementById("img_" + id[1]).setAttribute("style", "filter: brightness(50%);")
    //if (where === "out") document.getElementById("img_" + id[1]).setAttribute("style", "filter: brightness(100%);")
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

    get length() {
        return this.tail - this.head;
    }

    get isEmpty() {
        return this.length === 0;
    }
}


function id_num(id){
    return parseInt(id.substring(4));
}

function id_str(id){
    return 'img_' + id.toString();
}

function id_cell(id){
    return document.getElementById(id_str(id));
}

function id_up(x){
    return x - M;
}

function id_down(x){
    return x + M;
}

function id_right(x){
    return x + 1;
}

function id_left(x){
    return x - 1;
}

function has_up(cell){
    return cell.getAttribute('up') === 'true';
}

function has_down(cell){
    return cell.getAttribute('down') === 'true';
}

function has_left(cell){
    return cell.getAttribute('left') === 'true';
}

function has_right(cell){
    return cell.getAttribute('right') === 'true';
}

function runChain(){
    if(!runnable || current_key == null){
        console.log("no key");
        return;
    }
    let used = []
    for(let i = 0; i <= N*M; i++) used.push(false);
    let q = new Queue();
    //от ключа начнет растекаться ток //TODO откуда на самом деле? - источник питания
    console.log(current_key.id, id_num(current_key.id));
    let start = id_num(current_key.id);
    q.enqueue(start);
    used[start] = true;
    while (!q.isEmpty){
        let c = q.peek();
        q.dequeue();
        console.log('go to ' + c);

        let cell = id_cell(c);
        //тут будет вызываться функция прибора
        //этот фильтр будет заменен на что-нибудь красивее..
        cell.style.filter = 'drop-shadow(5px 5px 10px yellow)';

        if(has_up(cell) && !used[id_up(c)] && has_down(id_cell(id_up(c)))){
            q.enqueue(id_up(c));
            used[id_up(c)] = true;
        }
        if(has_down(cell) && !used[id_down(c)] && has_up(id_cell(id_down(c)))){
            q.enqueue(id_down(c));
            used[id_down(c)] = true;
        }
        if(has_left(cell) && !used[id_left(c)] && has_right(id_cell(id_left(c)))){
            q.enqueue(id_left(c));
            used[id_left(c)] = true;
        }
        if(has_right(cell) && !used[id_right(c)] && has_left(id_cell(id_right(c)))){
            q.enqueue(id_right(c));
            used[id_right(c)] = true;
        }

    }
    //кладем эл-т в очередь, запускаемся и идем по соседям...

}

/*
Точка входа, из которой запускается вся предобработка.
Нужна для того, чтобы инкапсулировать режим работы
 */


function startWorkingMode(){
    //обновим значения, если цепь до этого запускалась
    runnable = false;
    current_key = null;

    searchKey();
    if(!runnable){
        console.log("unable to run");
    }
    addElementButton();
}