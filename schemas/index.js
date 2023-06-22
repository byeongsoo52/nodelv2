// 몽구스 라이브러리를 가지고와서 몽구스 라이브러리에 커넥트한다. = 설치한 몽고DB에 접근한다.

const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/nodenter")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

// 현재 모듈(connet)을 내보내준다
module.exports = connect;