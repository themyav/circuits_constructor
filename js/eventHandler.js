const LAMP = 'lamp';
const WIRE = 'wire';

var current = 'lamp';

$(document).ready(function (){
    $('body').on('click', 'img', function (event){

        //console.log(event.which);

        let isFree = $(this).attr('free');
        //let rotation = $(this).attr('rotation');

        if(isFree === 'false') {
            $(this).attr('src', 'resource/element/desk.png');
            isFree = 'true';
        }
        else{
            $(this).attr('src', 'resource/element/' + current.toString() + '/' + current.toString() + '.png');
            isFree = 'false';
        }
        $(this).attr('free', isFree);
    });

    $('button').on('click', function (){
        current = this.id;
        console.log(current);
    });
});