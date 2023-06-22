// schemas에서는 실제로 사용할 몽고DB의 스키마들을 관리한다
// 어떤 스키마들을 사용할지에 대해서 정의해놓은 폴더 

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // 하나 하나에 해당하는 key 값들
  // key 값들이 어떤 타입을 가지고 있는지, 무조건 필요한지,
  // unique 한 값을 가져야 하는지 등 상세한 정보 지정,정의
  postId: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    defalt: Date.now(),
},
})
// 몽구스의 모델을 comments라는 모델로 사용할거고
// 위에서 정의한 commentSchema를 가지고 와서 정의할거야.
// 이 정의한 것을 module.exports를 통해서 밖으로 내보내줄거야.
module.exports = mongoose.model("comments", commentSchema);