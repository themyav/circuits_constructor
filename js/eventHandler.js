$(document).ready(function (){
    $('body').on('click', 'img', function (){

        let isFree = $(this).attr('free');

        if(isFree === 'false') {
            $(this).attr('src', 'resource/desk.png');
            isFree = 'true';
        }
        else{
            $(this).attr('src', 'resource/lamp.png');
            isFree = 'false';
        }
        $(this).attr('free', isFree);
    });
});