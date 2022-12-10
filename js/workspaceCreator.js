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

function setCookie(){
    document.cookie = "mode=" + MODE
}

function createAside(){
    let currentMode = getCookie('mode');
    if(currentMode) MODE = currentMode; //какой сейчас мод
    console.log("current mode is " + MODE)

    if(MODE === WORK) switchMode('buildingMode', 'workingMode' )
    //иначе мод подгузится автоматически
}

function createDesk(){
    let code = '';
    for(let i = 0; i < N*M; i++){
        code += '<figure><img src=\'resource/element/desk.png\' alt="Gallery image 1" free=true id=\'img_' + i.toString() + '\' rotation = 1 reflectionX = 1 reflectionY = 1 class="gallery__img"></figure>';
    }
    $("#gallery").html(code);
}

function createWorkspace(){
    createAside()
    createDesk();

}