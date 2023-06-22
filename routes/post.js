const express = require("express")
const router = express.Router();

const Post = require("../schemas/post.js");

// 전체 게시글 조회 API
router.get("/posts", async (req, res) => {
    const posts = await Post.find({}).sort({ createdAt: -1 })
    res.json({ posts });
});

// 게시글 작성
router.post("/posts", async (req, res) => {
    const { user, password, title, content } = req.body;

    const date = new Date()
    let createdAt = date.valueOf();

    if (!user || !password || !title || !content) {
        return res.status(400).json({ Message: "데이터 형식이 올바르지 않습니다" })
    }

    const createdPosts = await Post.create({ user, password, title, content, createdAt });

    res.status(200).json({ createdPosts, Message: "게시글을 생성하였습니다." });
});

// 게시글 상세 조회 API
router.get("/posts/:postsId", async (req, res) => {
    const post = await Post.find({ _id: postId });
    if (!post) {
        res.status(400).json({ Message: "게시글이 존재하지 않습니다" })
    } else {
        res.status(200).json({ post });
    }
});

// 게시글 수정
router.put("/posts/:postsId", async (req, res) => {
    const { postId } = req.params;
    const { password, user, title, content } = req.body;
    const post = await Post.findOne({});
    if (post) {
        if (password !== post.password) {
            res.status(400).json({ Message: "비밀번호가 일치하지 않습니다." });
        } else {
            await Post.updateOne({ _id: postId }, { $set: { user, title, content } });
            res.status(200).json({ success: true, message: "게시글을 수정하였습니다." });
        }
    } else {
        res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
});

// 게시글 삭제 
router.delete("/posts/:postsId", async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;
    const post = await Post.findOne({ _id: postId });

    if (post) {
        if (password !== post.password) {
            res.status(400).json({ Message: "비밀번호가 일치하지 않습니다." })
        } else {
            await post.deleteOne({ postId });
            res.status(200).json({ success: true, Message: "게시글을 삭제하였습니다." });
        }
    } else {
        res.status(404).json({ Message: "게시글이 존재하지 않습니다." })
    }
});

module.exports = router;