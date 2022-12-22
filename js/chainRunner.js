/*
Словарь, который сопоставляет вычислительному прибору участок, где нужно будет посчитать U|I|R(?)
 */
let ELEMENT_CALCULATION = new Map();
/*
Показывает, работаем с источником переменного тока или постоянного
 */
let IS_I_CONST = true;
/*
Словарь, который сопоставляет узлу вложенные в него узлы
 */
let P_INNER = new Map();

/*
Словарь, который сопоставляет узлу текущий через него постоянный ток
 */
let P_CONST_I = new Map();
/*
Словарь, который сопоставляет узлу родительский узел
 */
let P_PARENT = new Map();
/*
Пара узлов, для которых мы сейчас считаем сопротивление
 */
let P1 = null, P2 = null;

/*
Поиск двух ближайших узлов к элементу
 */

function searchClothestP(start) {
    //console.log("let's search triples for " + start);
    let used = [];
    let triples = [];
    let sources = [];

    const regex = /triple/;
    for (let i = 0; i <= N * M; i++) used.push(false);
    let q = new Queue();

    q.enqueue(start);
    used[start] = true;

    while (!q.isEmpty) {
        let c = q.peek();
        q.dequeue();
        let cell = id_cell(c);
        let src = cell.getAttribute('src');
        //нашли узел
        if (src.match(regex) != null && !USED_TR[c]) {
            triples.push(c);
            continue;
        }
        for(let j = 0; j < SOURCES.length; j++){
            if(src === SOURCES[j]) sources.push(c);
        }
        process_up(cell, c, q, used);
        process_down(cell, c, q, used);
        process_left(cell, c, q, used);
        process_right(cell, c, q, used);
    }
    if (sources.length !== 0) {
        //TODO is it okay to delete through iteration?
        console.log('found source, delete ' + id_str(start));
        SERIAL.push(start); //есть эдс -> считаем последовательным
        ELEMENTS.delete(id_str(start));
        return null;
    }

    if (triples.length === 2) {
        if (triples[0] > triples[1]) { //меняем местами, чтобы пара была отсортирована
            let t = triples[0];
            triples[0] = triples[1];
            triples[1] = t;
        }
        return [triples, used]; //чтобы функция была мультифункциональна, вернем массив использованных эл-тов.
    } else return null;

} //примерно O(cnt(N) * 10) <= 100 операций

function findPPairs() {
    console.log(ELEMENTS);
    let elementTriples = new Map();
    let triplePairs = new Set();
    ELEMENTS.forEach((value) => {
        console.log(value);
        let c = id_num(value);
        //console.log(c);
        let pairs = searchClothestP(c);
        if (pairs !== null) {
            let p = (pairs[0][0].toString() + '_' + pairs[0][1].toString());
            if (elementTriples.get(p) === undefined) elementTriples.set(p, []);
            elementTriples.get(p).push(c);
            triplePairs.add(p);
        }
    });
    return elementTriples;
}

/*
Для элементов, привязанных к одним узлам, проверим, соединены они последовательно или нет.
Правильная реализация --- СНМ, но сейчас будет опираться на то, что групп не больше двух.
 */
function formPairGroups(pairElements) {
    let usedResult = searchClothestP(pairElements[0])[1];
    let firstGroup = [pairElements[0]]; //есть путь до 1 элемента
    let secondGroup = []; //нет пути до 1 элемента
    for (let i = 1; i < pairElements.length; i++) {
        let currentElement = pairElements[i];
        if (usedResult[currentElement]) {
            firstGroup.push(currentElement);
        } else secondGroup.push(currentElement);
    }
    return [firstGroup, secondGroup];
}

function getGroupNumber(a) {
    console.log(a);
    let aCount = 0;
    if (a[0].length === 0) aCount++;
    if (a[1].length === 0) aCount++;
    return aCount;
}

function compareGroupPriority(a, b) {
    let aCount = 0;
    let bCount = 0;
    if (a[1][0].length === 0) aCount++;
    if (a[1][1].length === 0) aCount++;
    if (b[1][0].length === 0) bCount++;
    if (b[1][1].length === 0) bCount++;
    if (aCount > bCount) return 1;
    if (aCount === bCount) return 0;
    return -1;
}

/*
Принимает массив ЯЧЕЕК и заменяет его на массив каких-то данных о ячейке.
Например, сопротивление.
 */
function cellArrayToNumber(array, atr) {
    let numberArray = [];
    for (let i = 0; i < array.length; i++) {
        let atrContainer = document.getElementById('button_' + array[i]);
        if (atrContainer === null) {
            //если нет кнопки, то мы в узле --- достанем значение из него и сохраним вложенный узел
            if(!P_INNER.has(P1)) P_INNER.set(P1, []);
            P_INNER.get(P1).push(array[i]);
            P_PARENT.set(array[i], P1);
            atrContainer = id_cell(array[i]);
        }
        let val = atrContainer.getAttribute(atr);
        if (val !== null) numberArray.push(parseFloat(val)); //вообще если атрибута нет, то это ошибка
        else {
            console.log(atrContainer);
        }
    }
    return numberArray;
}

function countVoltmeter(array){

}
/*
Считает последовательное соединение относительно массива ЧИСЕЛ
 */
function countSerialR(array) { //показывает, что это наш последний расчет в самом конце
    let R = 0;
    for (let i = 0; i < array.length; i++) {
        R += array[i];
    }
    return R;
}

/*
Считает параллельное соединение относительно массива ЧИСЕЛ
 */
function countParallelR(array) {
    let R = 0;
    for (let i = 0; i < array.length; i++) {
        R += 1 / array[i];
    }
    return 1 / R;
}

/*
Вычисляет напряжение на параллельном участке цепи
 */
function countSerialU(I, array){
    return I * countSerialR(cellArrayToNumber(array, "r"));
}

/*
Считаем силу току на участке цепи (для амперметра), если он является участником параллельного соединения.
 */
function countParallelI(){

}

/*
Считает силу тока по закону Ома для полной цепи
 */
function countFullCircuitI(R, r, e) {
    return (e / (R + r));
}
/*
Вычленяет вольтметры и амперметры при параллельном соединении.
Проверяет правильность построения цепи.
 */
function countingParallelElementsInGroup(left, right) {
    let MESSAGE = document.getElementById('message');
    let valid = true;
    let actions = [];
    for(let i = 0; i < left.length; i++){
        let cell = id_cell(left[i]);
        let src = cell.getAttribute('src');
        if(src === APPLIANCES.get('Вольтметр')){
            if(left.length !== 1){ //есть еще кто-то, подключенный параллельно с вольтметром.
                changeInfoMessage(MESSAGE, 'Вольтметр подключен последовательно!', 'red'); //console.log('Circut is incorrect: voltmeter');
                valid = false;
            }
            else{
                actions.push([cell, right, true, P1]); //<- true --- это для параллельного
            }
        }
        if(src === APPLIANCES.get('Амперметр')){
            if(left.length === 1){ //один амперметр подключен параллельно к кому-то
                changeInfoMessage(MESSAGE, 'Амперметр подключен параллельно!', 'red');
                valid = false;
            }
            else{
                actions.push([cell, left, true, P1]);
            }
        }
    }
    if(!valid) return null;
    else return actions;
}

function countingSerialElementsInGroup(array){
    let MESSAGE = document.getElementById('message');
    let valid = true;
    let actions = [];
    for(let i = 0; i < array.length; i++){
        let cell = id_cell(array[i]);
        let src = cell.getAttribute('src');
        if(src === APPLIANCES.get('Вольтметр')){
            changeInfoMessage(MESSAGE, 'Вольтметр подключен последовательно!', 'red');
            console.log('Circuit is incorrect: voltmeter'); //вольтметру нельзя быть подключенным последовательно
            valid = false;
        }
        else if(src === APPLIANCES.get('Амперметр')){
            actions.push([cell, array, false, P1]); //<- false, тк не параллельно.
        }
    }
    if(!valid) return null;
    else return actions;
}

/*
Находит все элементы в параллельном блоке, для которых необходимы расчеты
 */
function findParallelCountingElements(group){
    let left = group[0];
    let right = group[1];

    let leftActions = countingParallelElementsInGroup(left, right);
    let rightActions = countingParallelElementsInGroup(right, left);
    if(leftActions !== null && rightActions !== null){ //если цепь составлена правильно
        for(let i = 0; i < leftActions.length; i++){
            ELEMENTS_COUNT_Q.enqueue(leftActions[i]);
        }
        for(let i = 0; i < rightActions.length; i++){
            ELEMENTS_COUNT_Q.enqueue(rightActions[i]);
        }
    }

}

/*
Находит все элементы в последовательном блоке, для которых необходимы рассчеты.
С последовательным блоком работаем только в самом конце...
 */
function findSerialCountingElements(array){
    let actions = countingSerialElementsInGroup(array);
    if(actions !== null){
        for(let i = 0; i < actions.length; i++){
            ELEMENTS_COUNT_Q.enqueue(actions[i]);
        }
    }
}



/*
Находит в параллельном блоке элементы, которые необходимо рассчитать.
Считает сопротивление для параллельного блока.
 */
function countParallelGroupR(group){
    console.log("energy is " + IS_I_CONST);
    findParallelCountingElements(group);
    //считаем сопротивление для постоянного тока -> вернем обычное число
    if(IS_I_CONST){
        let left = cellArrayToNumber(group[0], 'r');
        let right = cellArrayToNumber(group[1], 'r');
        let leftR = countSerialR(left);
        let rightR = countSerialR(right);
        return countParallelR([leftR, rightR]);

    }
    //считаем сопротивление для переменного тока -> вернем комплексное число
    else{
        let left = cellArrayToComplexR(group[0], 'r');
        // console.log('left array is ');
        // console.log(left);
        let right = cellArrayToComplexR(group[1], 'r');
        // console.log('right array is ');
        // console.log(right);
        let leftR = countComplexSerialR(left);
        // console.log('leftR array is ');
        // console.log(leftR);
        let rightR = countComplexSerialR(right);
        // console.log('rightR array is ');
        // console.log(rightR);
        return countComplexParallelR([leftR, rightR]);
    }
}
/*
Находит в последовательном блоке элементы, которые необходимо рассчитать.
Считает сопротивление для последовательного блока
 */
function countSerialGroupR(array){
    findSerialCountingElements(array);
    let numArray = cellArrayToNumber(array, 'r');
    return countSerialR(numArray);
}

/*
Удаляет из списка элементов те, которые уже рассчитаны.
 */
function removeGroup(group) {
    for (let i = 0; i < group[0].length; i++) {
        ELEMENTS.delete(id_str(group[0][i]));
        //console.log(group[0][i]);
    }
    for (let i = 0; i < group[1].length; i++) {
        ELEMENTS.delete(id_str(group[1][i]));
        //console.log(group[1][i]);
    }
    //console.log(ELEMENTS);
}

/*
Считает полное сопротивление в цепи
 */
function countFullR(resultMap){
    let MESSAGE = document.getElementById('message');
    //считаем полное сопротивление в цепи
    let finalR = countSerialGroupR(SERIAL);//countSerialR(cellArrayToNumber(SERIAL, 'r'), true);
    if(finalR === 0) changeInfoMessage(MESSAGE, 'В цепи произойдет короткое замыкание!', 'red');
    else console.log(finalR);
    resultMap.set('Полное сопротивление в цепи', [finalR, 'Ом']);

}

/*
Считает полную силу тока в цепи
 */
function countFullI(resultMap){
    let finalR = resultMap.get('Полное сопротивление в цепи')[0];
    let source = document.getElementById('button_' + id_num(current_source[0].id));
    let r = parseFloat(source.getAttribute('r'));
    let e = parseFloat(source.getAttribute('e'));
    if (r !== null && e !== null) {
        let finalI = countFullCircuitI(finalR, r, e);
        resultMap.set('Сила тока в цепи', [finalI, 'A']);

    }
}

/*
На основе полной силы тока (в цепи постоянного тока) считает силу тока для каждого узла
 */
function countIForInnerP(I){
    let start = P1;
    P_CONST_I.set(start, I);
    let q = new Queue();
    q.enqueue([start, I]);
    while (!q.isEmpty){
        let p = q.peek()[0];
        let curI = q.peek()[1];
        q.dequeue();
        //console.log("I'm in " + p + " and I is " + curI);
        if(!P_INNER.has(p)) continue;
        let children = P_INNER.get(p);
        //console.log(children);
        curI /= (children.length * 2); //один вложенный узел на самом деле символизирует пару
        for(let i = 0; i < children.length; i++){
            P_CONST_I.set(children[i], curI);
            q.enqueue([children[i], curI]);
        }
    }
}

/*
Удалить элементы, в которые ток всяко не потечет.
 */
function removeNonAllowedElements(){
    ELEMENTS.forEach((value) => {
        if(IS_BAD_CELL[id_num(value)]) {
            console.log('going to delete ' + value);
            ELEMENTS.delete(value);
        }
    });
}
/*
Формирует для каждой пары узлов списки элементов по обе стороны от них и определяет приоритетность расчета всех углов.
 */
function handlePairGroups() {

    removeNonAllowedElements();

    let triplePairs = new Map();
    let resultMap = new Map();
    let stop = 0;

    while (ELEMENTS.size !== 0) {
        let elementPairs = findPPairs();
        console.log(elementPairs);
        console.log(ELEMENTS);

        let groupQueue = new Queue();
        for (let [key, value] of elementPairs) {
            let groups = formPairGroups(value);
            if (getGroupNumber(groups) === 0) {
                groupQueue.enqueue([key, groups]);
            }
        }
        while (!groupQueue.isEmpty) {
            let key = groupQueue.peek()[0];
            let splitted = key.split('_');
            //console.log(splitted);
            P1 = parseInt(splitted[0]);
            P2 = parseInt(splitted[1]);
            let value = groupQueue.peek()[1]; //тут два массива: левый и правый.
            groupQueue.dequeue();

            //посчитаем сопротивление в зависимости от источника тока
            let R = 0;
            R = countParallelGroupR(value);
            console.log('just finished for ' + P1 + ' ' + P2);
            removeGroup(value);
            USED_TR[P1] = true;
            USED_TR[P2] = true;
            triplePairs.set(P1, P2);
            //TODO вот тут очень важный момент! у всяких резистров это очевидно число, а у узлов --- уже комплексное.
            id_cell(P1).setAttribute('r', R.toString()); //если у нас число->поставится именно оно, иначе через запятую 2 числа
            ELEMENTS.add(id_str(P1));
        }
        stop++;
        if(stop === 100) break;
    }

    if(IS_I_CONST){
        P1 = id_num(current_source[0].id);
        countFullR(resultMap);
        countFullI(resultMap);
        countIForInnerP(resultMap.get('Сила тока в цепи')[0]);
    }
    else{
        countFullComplexR(resultMap);
    }

    return resultMap;
}

function drawTableRow(table, row){
    table.append(row);
}
/*
Рисует таблицу с расссчитанными для цепи значениями
 */
function drawResultTable(results) {
   let result =  $('#calcResults');
   result.html('');
    for (let [key, value] of results) {
        drawTableRow(result, '<tr><td>' + key + '</td></tr><tr><td>'
            + value[0].toFixed(5) + ' ' + value[1] + '</td></tr>');
    }
}


function handleElementActions(results){
    while (!ELEMENTS_COUNT_Q.isEmpty){
        let action = ELEMENTS_COUNT_Q.peek();
        ELEMENTS_COUNT_Q.dequeue();
        let element = action[0];
        let array = action[1];
        let isParallel = action[2];
        let src = element.getAttribute('src');
        if(src === APPLIANCES.get('Вольтметр')){
            let partI = P_CONST_I.get(P_PARENT.get(action[3])); //сила тока до того, как ток "разошелся", тк у вольтметра большое сопротивление
            let result = countSerialU(partI, array).toFixed(3);
            ELEMENT_CALCULATION.set(id_num(element.id), ['Измеренное напряжение', result]);
        }
        else if(src === APPLIANCES.get('Амперметр')){
            //Сила тока на участке цепи: I = U/R, U, R для участка. Тогда нам нужно: получить напр, получить r и считать
            let I = results.get('Сила тока в цепи')[0], result = 0;
            if(!isParallel) result = I;
            else{
                result = P_CONST_I.get(action[3]);
            }
            ELEMENT_CALCULATION.set(id_num(element.id), ['Измеренная сила тока', result]);

        }
    }
}
/*
Входная точка расчета цепи.
 */
function countChain() {
    if(!IS_I_CONST) {
        countW();
        countI0();
        countPhi();
    }
    for (let i = 0; i < N * M; i++) USED_TR.push(false);
    let results = handlePairGroups();
    handleElementActions(results);
    drawResultTable(results);
    console.log(ELEMENT_CALCULATION);

}