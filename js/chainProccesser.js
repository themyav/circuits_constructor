let M = 10;
let N = 7;

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
        if (cell.getAttribute("src") === ELEMENTS.get(KEY)) {
            runnable = false;
        } else {
            runnable = true;
        }
    }


}


function addRAndU() {
    let cell;
    let element;
    let table = document.getElementsByClassName("value");
    for (let i = 0; i < N * M; i++) {
        cell = document.getElementById("img_" + i);
        if (APPLIANCES.has(cell.getAttribute("src"))) {
            element = Object.keys(APPLIANCES).find(key => APPLIANCES[key] === cell.getAttribute("src"));
            table.innerHTML += '<tr><td><input type="button" class ="valuesOfUR" >" + element.toString() + "</td></tr>';
        }
    }
    let elements = document.getElementsByClassName("valuesOfUR");
    for(element in elements){
        element.onclick = function() {
            element.innerHTML = "<tr><td><input type=\"number\">" + "Напряжение" + "</td></tr><tr><td><input type=\"number\">" + "Сопротивление" + "</td></tr>";
        }
    }
}
