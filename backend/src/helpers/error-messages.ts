const ErrorMessages = {
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',
  DB_CONNECTION: 'Ошибка подключения к базе данных',
  REQUIRED_FIELD: 'Поле \'%f%\' должно быть заполнено',
  PRODUCT_VALIDATION_ERROR: 'Данные товара не прошли валидацию',
  PRODUCT_TITLE_MIN_LENGTH: 'Минимальная длина поля "title" - 2',
  PRODUCT_TITLE_MAX_LENGTH: 'Максимальная длина поля "title" - 30',
  PRODUCT_DUPLICATE: 'Товар с таким наименованием уже существует',
  PRODUCT_NOT_FOUND: 'Нет товара по заданному id',
  USER_VALIDATION_ERROR: 'Данные пользователя не прошли валидацию',
  USER_NAME_MIN_LENGTH: 'Минимальная длина поля "name" - 2',
  USER_NAME_MAX_LENGTH: 'Максимальная длина поля "name" - 30',
  USER_PASSWORD_MIN_LENGTH: 'Минимальная длина поля "password" — 6',
  USER_DUPLICATE: 'Пользователь с таким email уже существует',
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_TOKEN_EXPIRED: 'Необходимо авторизоваться заново',
  UNAUTHORIZED: 'Пользователь не авторизован',
  WRONG_MAIL_OR_PASSWORD: 'Неправильные почта или пароль',
  BAD_IMAGE: 'Допускаются только изображения форматов: .jpg, .jpeg, .png или .gif',
};

export default ErrorMessages;
