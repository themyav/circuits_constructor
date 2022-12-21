let M = 50 //you should put this value to repeat function in css
let N = 50
const WORK = 'workingMode'
const BUILD = 'buildingMode'
let MODE = BUILD

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie() {
    document.cookie = "mode=" + MODE
}

function createAside() {
    let currentMode = getCookie('mode');
    if (currentMode) MODE = currentMode; //какой сейчас мод
    console.log("current mode is " + MODE)

    if (MODE === WORK) switchMode('buildingMode', 'workingMode')
    //иначе мод подгузится автоматически
}

function createDesk() {
    let code = '';
    for (let i = 0; i < N * M; i++) {
        code += '<figure class="cell"><img src=\'resource/element/desk.png\' alt="Gallery image 1" free=true id=\'img_' + i.toString() + '\' rotation = 1 reflectionX = 1 reflectionY = 1 left=false right=false up=false down=false class="gallery__img"></figure>';
    }
    $("#gallery").html(code);

}

function memorizing(){
    let cell;
    let src;
    let rotation;
    let reflectionX;
    let reflectionY;
    for (let i = 0; i < N * M; i++) {
        cell = document.getElementById("img_" + i);
        src = cell.getAttribute("src");
        rotation = cell.getAttribute("rotation");
        reflectionX = cell.getAttribute("reflectionX");
        reflectionY = cell.getAttribute("reflectionY");
        sessionStorage.setItem('cell_'+i, src+";"+rotation+";"+reflectionX+";"+reflectionY);
    }
}


function loading(){
    console.log("loaded");
    let cell;
    let all_attr;
    for (let i = 0; i < N * M; i++) {
        cell = document.getElementById("img_" + i);
        all_attr = sessionStorage.getItem('cell_' + i).split(";");
        console.log(i+"  "+all_attr[0]+"  "+all_attr[1]+"  "+all_attr[2]+"  "+all_attr[3]);
        let src = all_attr[0];
        let rotation = all_attr[1];
        let reflectionX = all_attr[2];
        let reflectionY = all_attr[3];
        cell.setAttribute("src", src);
        cell.setAttribute("rotation", rotation);
        cell.setAttribute("reflectionX", reflectionX);
        cell.setAttribute("reflectionY", reflectionY);
        switch (rotation){
            case "90":
                cell.setAttribute("style", "transform: rotate(90deg);");
                break;
            case "0":
                cell.setAttribute("style", "transform: rotate(0deg);");
                break;
            case "-90":
                cell.setAttribute("style", "transform: rotate(-90deg);");
                break;
            case "180":
                cell.setAttribute("style", "transform: rotate(180deg);");
                break;
            case "-180":
                cell.setAttribute("style", "transform: rotate(-180deg);");
                break;
            case "270":
                cell.setAttribute("style", "transform: rotate(270deg);");
                break;
            case "-270":
                cell.setAttribute("style", "transform: rotate(-270deg);");
                break;
        }
    }
}

function createWorkspace() {
    createAside()
    createDesk();
    circuits_six(true);
    loading();
}