const ERROR = {
  DB_CONNECTION: 'Ошибка подключения к базе данных',
  REQUIRED_FIELD: 'Поле \'%f%\' должно быть заполнено',
  INVALID_DATA: 'Данные не прошли валидацию',
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',
  PRODUCT_TITLE_MIN_LENGTH: 'Минимальная длина поля "title" - 2',
  PRODUCT_TITLE_MAX_LENGTH: 'Максимальная длина поля "title" - 30',
  PRODUCT_DUPLICATE: 'Товар с таким наименованием уже существует',
  PRODUCT_NOT_FOUND: 'Товар не найден',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export { ERROR, HTTP_STATUS };
