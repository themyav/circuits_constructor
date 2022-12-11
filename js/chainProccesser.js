let runnable = false;
let current_key = null;
const KEY = "resource/element/key/key.png";

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
            if(current_key === null){
                current_key = cell;
                runnable = true;
            }
            else{
                runnable = false;
                console.log("two keys in forbidden");
            }
        }
        //else console.log(cell.getAttribute("src"), KEY);
    }
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
    if (where === "on") document.getElementById("img_" + id[1]).setAttribute("style", "filter: brightness(50%);")
    if (where === "out") document.getElementById("img_" + id[1]).setAttribute("style", "filter: brightness(100%);")
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

/*
Точка входа, из которой запускается вся предобработка.
Нужна для того, чтобы инкапсулировать режим работы
 */

function id_num(id){
    return parseInt(id.substring(current_key.id.length - 3));
}


function id_str(id){
    return 'img_' + id.toString();
}

function up(x){
    return x - M;
}

function down(x){
    return x + M;
}

function right(x){
    return x + 1;
}

function left(x){
    return x - 1;
}

function runChain(){
    //if(!runnable) return; remove for debug
    let used = []
    for(let i = 0; i <= N*M; i++) used.push(false);
    let q = new Queue();
    //от ключа начнет растекаться ток //TODO откуда на самом деле?
    let start = id_num(current_key.id);
    console.log(start);
    q.enqueue(start);
    used[start] = true;
    while (!q.isEmpty){
        let top = q.peek();
        q.dequeue();
        //сами ячейки, а не их id, нужны только для атрибутов
        //добавляет
        let cell = document.getElementById(id_str(top));
        if(cell.getAttribute(let))
        console.log(id_str(top));
    }
    //кладем эл-т в очередь, запускаемся и идем по соседям...


}

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