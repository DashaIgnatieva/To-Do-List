const buildTaskMarkup = (obj) => {
    const cssClass = obj.done ? "class=\"task-done\"" : "";

    /*Формируем разметку для новых задач с помощью интерполяции*/
    const taskHTML = `
                    <div id="${obj.id}" class="task">
                        <div class="task-discription">
                            <p ${cssClass}>${obj.text}</p>
                        </div>
                        <div class="marks">
                            <button class="mark tick" data-action="done"></button>
                            <button class="mark cross" data-action="delete"></button>
                        </div>
                    </div>`;

    return taskHTML;
};

/*Функция для добавления задачи в список задач*/
const addTask = (event) => {
    /*Отменяем отправку формы*/
    event.preventDefault();

    /* Делаем проверку на попытку пользователя отправить пустую строку*/
    if (task.value.trim() === '') {
        return;
    };

    /*Достаем текст из поля ввода*/
    const taskText = task.value;

    /*Создаем объект задачи*/
    const newTask = {
        id: Date.now(), //Формируем id задачи исходя из текущей даты, включая милесекунды TODO Переделать
        text: taskText,
        done: false // Статус задачи. В момент создания равен false
    };

    /*Добавляем объект задачи в массив с задачами*/
    tasks[newTask.id] = newTask;
    saveToLocalStorage();

    /*Добавляем задачу на страницу 
    insertAdjacentHTML - метод для добавления html-кода
    'beforeend' - аргумент, говорящий о том что разметка добавляется последней в родительский элемент
    taskHTML - переменная, содержащая разметку
    */
    tasksList.insertAdjacentHTML('beforeend', buildTaskMarkup(newTask));

    /*Очищаем поле ввода и возвращаем фокус на него*/
    task.value = '';
    task.focus();

    checkEmptyList();
};

/*Функция для удаления задачи из списка задач*/
const deleteTask = (event) => {
    // Проверяем, что бы клик был совершен по кнопке 'удалить задачу'
    // Если клик был сделан не по кнопке delete, то работа функции останавливается
    if (event.target.dataset.action !== "delete") return;

    // Метод closest() ищет родителя указанного элемента.
    const parentNode = event.target.closest('.task');

    // Удаляем задачу из списка задач
    // выносим id родительской ноды в переменную
    const id = parentNode.id

    // Удаляем задачу из массива по id
    delete tasks[id];
    saveToLocalStorage();

    // Удаляем родительский тег со страницы.
    parentNode.remove();

    checkEmptyList();
};

const deleteAllDoneTasks = (event) => {

    for (const i of Object.keys(tasks)) {
        if (tasks[i].done) {
            // Удаляем задачу из разметки
            document.getElementById(i).remove()

            //Удаляем задачу из списка
            delete tasks[i];
            saveToLocalStorage();
        };
    };
};

/*Функция для отметки задачи как выполненной*/
const doneTask = (event) => {
    if (event.target.dataset.action !== "done") return;
    // Ищем родительскую ноду
    const parentNode = event.target.closest('.task');
    const doneTaskText = parentNode.querySelector('p');
    // id родительской ноды
    const id = parentNode.id

    // Меняем статус задачи
    tasks[id].done = !tasks[id].done
    saveToLocalStorage();

    /* Добавляем тегу новый класс. 
    Метод toggle работает таким образом, что он добавляет указанный класс, если его нет
    и убирает, если он есть
    */
    doneTaskText.classList.toggle('task-done');
};

/*Функция для отображения пустого списка*/
const checkEmptyList = () => {

    if (Object.keys(tasks).length === 0) {
        const emptyListHTML =  `<div class="empty-list" id="empty-list">
                                    <div class="img"></div>
                                    <p>Список пуст</p>
                                </div>`
        tasksList.insertAdjacentHTML('beforeend', emptyListHTML);
    };

    if (Object.keys(tasks).length > 0) {
        const emptyListEl = document.querySelector("#empty-list")
        emptyListEl ? emptyListEl.remove() : null;
    };
};

const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const showFoolTaskText = (event) => {
    if (!event.target.closest('p')) return;

    const parentNode = event.target.closest('.task');
    parentNode.classList.toggle('fool-task');
};

/*Переменная которая будет хранить массив задач*/
let tasks = {};

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
};

/*Ищем нужный элемент на странице по его id*/
const form = document.querySelector('#form');
const task = document.querySelector('#task-input');
const tasksList = document.querySelector('#tasks-list');
const delDoneTasksButton = document.querySelector('#delete-completed-tasks');

/*Запускаем функцию отображающую пустой список*/
checkEmptyList()

/*Вешаем слушателя событий на форму*/
form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
tasksList.addEventListener('click', showFoolTaskText)
delDoneTasksButton.addEventListener('click', deleteAllDoneTasks)

/*Проверяем, есть ли сохраненные данные в localStorage и если есть подгружаем их*/
if (localStorage.getItem("tasks")) {
    taskEntries = Object.entries(JSON.parse(localStorage.getItem("tasks")))

    for (taskEntry of taskEntries) {
        const task = taskEntry[1]

        tasksList.insertAdjacentHTML('beforeend', buildTaskMarkup(task));
    };
};