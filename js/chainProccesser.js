let runnable = false;
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
        if (cell.getAttribute("src") === KEY) {
            runnable = false;
        }
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
                    " onclick='add_U_and_R(this)' onmouseover='light_picture(this, \"on\")' onmouseout='light_picture(this, \"out\")'>" + element + "</button></td></tr>" +
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