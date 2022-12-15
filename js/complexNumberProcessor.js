/*
Библиотека для работы с комплексными числами
 */

/*
Циклическая частота
 */
let W;

/*
Расчет циклической частоты.
 */
function countW(){
    let nu = document.getElementById('button_' + id_num(current_source[0].id)).getAttribute('nu');
    W = 2 * Math.PI * nu;
}

/*
Принимает число --- id и рассчитывает сопротивление конденсатора.
 */
function capacitorR(id){
    let c = parseFloat(document.getElementById('button_' + id).getAttribute('c'));
    return [0, 1/(W*c)];
}

/*
Принимает число --- id и рассчитывает сопротивление катушки.
 */
function coilR(id){
    let l = parseFloat(document.getElementById('button_' + id).getAttribute('l'));
    return [0, W*l];
}

/*
Ищет взаимно обратное число (1/a) для заданного a
 */

function reciprocal(a){
    let x = a[0]; //действительная часть
    let y = a[1]; //мнимая часть
    let denum = x*x + y*y;
    return [x/denum, -y/denum];
}

function sum(a, b){
    return [a[0] + b[0], a[1] + b[1]];
}

/*
Считает сумму комплексных чисел в массиве.
По факту --- считает напряжение на последовательном участке цепи.
 */
function countComplexSerialR(array){
    let R = [0, 0];
    for(let i = 0; i < array.length; i++){
        R = sum(R, array[i]);
    }
    return R;
}

function countComplexParallelR(array){
    let R = [0, 0];
    for(let i = 0; i < array.length; i++){
        R = sum(R, reciprocal(array[i]));
    }
    return reciprocal(R);
}

/*
Получение массива комплексных значений для последовательного участка
 */
function cellArrayToComplexR(array, atr='r'){ //здесь такой расчет имеет смысл только для сопротивления
    let complexArray = [];
    for(let i = 0; i < array.length; i++){
        let cell = id_cell(array[i]);
        let atrContainer = document.getElementById('button_' + array[i]);
        let val = null;
        //если нет кнопки, то мы в узле --- достанем значение из него
        if (atrContainer === null) {
            atrContainer = cell;
            val = [parseFloat(atrContainer.getAttribute(atr)), 0]; //число без мнимой части
        }
        //иначе кнопка есть и можно проверить на конденсатор и катушку
        else{
            let src = cell.getAttribute('src');
            if(src === APPLIANCES.get('Конденсатор')){
                val = capacitorR(array[i]);
            }
            else if(src === APPLIANCES.get('Катушка')){
                val = coilR(array[i]);
            }
            else val = [parseFloat(atrContainer.getAttribute(atr)), 0];
        }
        if (val !== null) complexArray.push(parseFloat(val)); //вообще если атрибута нет, то это ошибка
        else console.log('null attribute error ' + atrContainer);
    }
    return complexArray;
}

function countFullComplexR(resultMap){
    let finalR = countSerialGroupR(SERIAL);//countSerialR(cellArrayToNumber(SERIAL, 'r'), true);

}