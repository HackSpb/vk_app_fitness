/*


Для сброса кеша у пользователей надо менять версию в index.html


*/
var config={
urlPhpServer: "https://appfizikl.ru/",
///appfizikl.ru
}

var text={
  'intro': 'Приветствуем тебя в потоке Physical Transformation!',
  'head': 'Физтрансформ',
  'dataSave':'Данные успешно записаны',
  'servError': "ошибка связи с сервером",
  'notFilled':'Заполните поля: ',
  'headAlert': 'Hi!'
}

function getConfig() {
    return window.config;
}
