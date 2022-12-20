/*
Библиотека для работы с комплексными числами и переменным током
 */

/*
Циклическая частота
 */
let W;
/*
Амплитуда
 */
let I0;
/*
Фаза
 */
let PHI;

/*
Расчет циклической частоты.
 */
function countW(){
    let nu = parseFloat(document.getElementById('button_' + id_num(current_source[0].id)).getAttribute('nu'));
    W = 2 * Math.PI * nu;
    console.log('W is ' + W);
}

/*
Достает значение амплитуды
 */
function countI0(){
    I0 = parseFloat(document.getElementById('button_' + id_num(current_source[0].id)).getAttribute('a'));
}

/*
Достает значение фазы
 */
function countPhi(){
    PHI = parseFloat(document.getElementById('button_' + id_num(current_source[0].id)).getAttribute('fi'));
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

 */

function countMomentalI(t){
    //console.log(I0,  W * t, Math.sin(W * t));
    return I0 * Math.sin(W * t);
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
            val = atrContainer.getAttribute(atr).split(','); //число без мнимой части
            val = [parseFloat(val[0]), parseFloat(val[1])];
        }
        //иначе кнопка есть и можно проверить на конденсатор и катушку
        else{
            let src = cell.getAttribute('src');
            if(src === APPLIANCES.get('Конденсатор')){
                val = capacitorR(array[i]);
            }
            else if(src === APPLIANCES.get('Катушка индуктивности')){
                val = coilR(array[i]);
            }
            else val = [parseFloat(atrContainer.getAttribute(atr)), 0];
        }
        if (val !== null) complexArray.push(val); //вообще если атрибута нет, то это ошибка
        else console.log('null attribute error ' + atrContainer);
    }
    return complexArray;
}

/*
Вычисляет значение полного сопротивления в цепи
 */
function countFullComplexR(resultMap){
    let complexR = cellArrayToComplexR(SERIAL);
    let R = countComplexSerialR(complexR);
    R = Math.sqrt(R[0]*R[0] + R[1]*R[1]);
    resultMap.set('Полное сопротивление в цепи', [R, 'Ом']);

}

/*
Вычисляет значение силы мгновенной силы тока в цепи
 */

/*
Вычисляет значение мгновенного сопротивления в цепи
 */