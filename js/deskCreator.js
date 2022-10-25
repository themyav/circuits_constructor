function createDesk(){
    let code = '';
    for(let i = 0; i < 64; i++){
        code += '<figure><img src=\'resource/desk.png\' alt="Gallery image 1" free=true id=\'img_' + i.toString() + '\' class="gallery__img"></figure>';
    }
    $("#gallery").html(code);
}