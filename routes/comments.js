// Router.METHOD(PATH, HANDLER)

// 스키마를 선언한 comments 스키마를 가지고와서 Comments 변수에 할당

const express = require("express")
const router = express.Router();

const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js")

// 댓글 조회 API
router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
  res.json({ comments });
});

// 댓글 작성 API
router.post("/posts/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const { user, password, content } = req.body;

  const date = new Date()
  const createdAt = date.valueOf();

  if (!content) {
    return res.status(400).json({ Message: "댓글을 입력해주세요." })
  }

  const createdComments = await Comment.create({ postId, user, password, content, createdAt });

  res.json({ createdComments, Message: "댓글을 작성하였습니다." });
});

// 댓글 수정
router.put("/posts/:postId/comments/:commentsId", async (req, res) => {
  const { commentsId } = req.params;
  const { password, content } = req.body;
  const comment = await Comment.findById(commentsId);
  console.log(comment)
  if (comment) {
    if (password !== comment.password) {
      console.log(password)
      console.log(comment.password)
      res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    } else {
      await Comment.updateOne({ _id: commentsId }, { $set: { content: content } });
      res.status(200).json({ success: true, Message: "댓글을 수정하였습니다." });
    }
  } else {
    res.status(400).json({ errorMessage: "댓글이 존재하지 않습니다." });
  }
});

// 댓글 삭제
router.delete("/posts/:postId/comments/:commentsId", async(req,res) => {
  const { commentsId } = req.params;
  const { password } = req.body;
  const comment = await Comment.findById(commentsId);

  if (comment) {
    if (password !== comment.password) {
      res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
    } else {
      await Comment.deleteOne({_id : commentsId});
      res.status(200).json({success:true, Message: "댓글을 삭제하였습니다."});
    } 
  } else {
    res.status(400).json({ errorMessage: "댓글이 존재하지 않습니다." })
  }
});

module.exports = router;