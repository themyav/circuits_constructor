function createDesk(){
    let code = '';
    for(let i = 0; i < 64; i++){
        code += '<figure><img src=\'resource/element/desk.png\' alt="Gallery image 1" free=true id=\'img_' + i.toString() + '\' rotation = 0 class="gallery__img"></figure>';
    }
    $("#gallery").html(code);
}