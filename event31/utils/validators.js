const { body } = require("express-validator/check");
const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Такой email уже занят");
        }
      } catch (e) {
        console.log(e);
      }
    }),
  body("password", "Пароль должен быть минимум 6 символов")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric(),
  body("confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Пароли должны совпадать");
    }
    return true;
  }),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Имя должно быть минимум 3 символа")
];

exports.eventValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Минимальная длинна названия 3 символа")
    .trim(),
  body("price").custom((value, { req }) => {
    if (req.body.paidEntry === "false") {
      if (value === "") {
        throw new Error("Введите корректную цену");
      }
    }
    // if (req.body.paidEntry == "true") {
    //   value = null;
    // }
    return true;
  }),
  // body("img", "Загрузите изображение!").isString(),
  body("date", "Введите корректную дату").isISO8601(),

  body("time").custom((value, { req }) => {
    if (!/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/.test(req.body.time)) {
      throw new Error("Введите корректную дату");
    }
    return true;
  })
];

