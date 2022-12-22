!function (e) {
    "function" != typeof e.matches && (e.matches = e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || function (e) {
        let o = (t.document || t.ownerDocument).querySelectorAll(e);
        let n;
        let t = this;
        for (; o[n] && o[n] !== t;) ++n;
        return Boolean(o[n])
    }), "function" != typeof e.closest && (e.closest = function (e) {
        for (let t = this; t && 1 === t.nodeType;) {
            if (t.matches(e)) return t;
            t = t.parentNode
        }
        return null
    })
}(window.Element.prototype);


document.addEventListener('DOMContentLoaded', function () {

    /* Записываем в переменные массив элементов-кнопок и подложку.
       Подложке зададим id, чтобы не влиять на другие элементы с классом overlay*/
    const modalButton = document.getElementById('js-open-modal'),
        overlay = document.querySelector('.js-overlay-modal'),
        closeButton = document.querySelector('.js-modal-close');


    /* Назначаем каждой кнопке обработчик клика */
    modalButton.addEventListener('click', function (e) {

        /* Предотвращаем стандартное действие элемента. Так как кнопку разные
           люди могут сделать по-разному. Кто-то сделает ссылку, кто-то кнопку.
           Нужно подстраховаться. */
        e.preventDefault();

        /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
           и будем искать модальное окно с таким же атрибутом. */
        const modalId = this.getAttribute('data-modal'),
            modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');


        /* После того как нашли нужное модальное окно, добавим классы
           подложке и окну чтобы показать их. */
        modalElem.classList.add('active');
        overlay.classList.add('active');
    }); // end click


    closeButton.addEventListener('click', function (e) {
        const parentModal = this.closest('.modal');

        parentModal.classList.remove('active');
        overlay.classList.remove('active');
    });


    document.body.addEventListener('keyup', function (e) {
        const key = e.keyCode;

        if (key === 27) {
            document.querySelector('.modal.active').classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
        }
    }, false);


    overlay.addEventListener('click', function () {
        document.querySelector('.modal.active').classList.remove('active');
        this.classList.remove('active');
    });


}); // end ready


function add_to_directory(e) {
    let where_to_add = document.getElementById("for_description");
    if (e.getAttribute("id") === "project_description") {
        where_to_add.innerHTML = "<div id='only_description' style='width: 700px;'>Проект \"Конструктор электрических цепей\" создан для создания и эмуляции запуска элекстрических цепей.</div>";
    } else if (e.getAttribute("id") === "elements_description") {
        let start_table = "<div id='only_buttons' style='z-index: 2; position: absolute;'><table><tr><td>";
        let end_table = "</td></tr></table></div><div id='only_description' style='width: 700px; z-index: 1; position: absolute; left: 225px; top: 90px;'></div></td></tr></table>";
        let button = "";
        for (let pair of APPLIANCES.entries()) {
            button += "<div style='display: flex'><button src='" + pair[1] + "' class='elements_description' onclick='add_description(this)'>" + pair[0] + "</button></div><br>";
        }
        where_to_add.innerHTML = start_table + button + end_table;
    } else if (e.getAttribute("id") === "instruction") {
        where_to_add.innerHTML = "<div id='only_description' style='width: 700px;'><a href='https://github.com/themyav/circuits_constructor'>Ссылка на гит с объяснением алогритма и использованием приложения.</a> </div>";
    }
}


function add_description(e) {
    let element = e.getAttribute("src").split("/")[2];

    let picture = "<img style='width: 200px; height: 200px;' src=\"" + e.getAttribute("src") + "\" alt=\"альтернативный текст\">";

    let inBody = function () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "resource/description/" + element + '.html');
        xhr.onload = function () {
            document.getElementById("only_description").innerHTML = "<div>" + picture + "</div><br><div class='text_elements_description' style='text-align: left'>" + xhr.response + "</div>";
        }
        xhr.send();
    }
    inBody();

}





