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
                str += "<tr><td><button id='button_' is_show='false'" + i + " onclick='addUAndR.apply(this)()'>" + element + "</button></td></tr>";
            }
        }
    }
    table.innerHTML = str;
}


function addUAndR() {
    let id = this.getAttribute("id");
    let str = "<div id=\"UandR_" + id + "\" class=\"UandR_dropdown\"><input type=\"input\">" + "Напряжение" + "</td></tr><tr><div><input type=\"input\">" + "Сопротивление" + "</div>";
    //element.insertAdjacentHTML("afterend", str);
    // const span = document.querySelector("UandR_" + id);
    // const classes = span.classList;
    // span.addEventListener('click', () => {
    //     const result = classes.toggle("c");
    //     span.textContent = `'c' ${result ? "added" : "removed"}; classList is now "${classes}".`;
    // })
    // document.getElementById("UandR_" + id).toggle("", undefined);
    if (this.getAttribute("is_show") === "false") {
        console.log("is show is false");
        this.setAttribute("is_show", "true");
        this.insertAdjacentHTML("afterend", str);
    } else {
        this.setAttribute("is_show", "false");
        let element = document.getElementById("UandR_" + id);
        element.parentNode.removeChild(element);
    }
}
