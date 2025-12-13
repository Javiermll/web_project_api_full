const mongoose = require("mongoose");
const validator = require("validator");

const urlRegex =
  /^(https?:\/\/)(www\.)?[\w-]+(\.[\w-]+)+(\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?#?$/i;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Jacques Cousteau",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Explorer",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
    validate: {
      validator: (v) => urlRegex.test(v),
      message: (props) => `${props.value} no es una URL válida`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} no es un correo electrónico válido`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
});

module.exports = mongoose.model("user", userSchema);
