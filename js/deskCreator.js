let M = 10
let N = 7

function createDesk(){
    let code = '';
    for(let i = 0; i < N*M; i++){
        code += '<figure><img src=\'resource/element/desk.png\' alt="Gallery image 1" free=true id=\'img_' + i.toString() + '\' rotation = 1 reflectionX = 1 reflectionY = 1 class="gallery__img"></figure>';
    }
    $("#gallery").html(code);
}