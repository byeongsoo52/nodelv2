// 과제에서 요구하는 로그인의 비즈니스 로직
// 1. nickname, password를 전달 받음
// 2. nickname에 해당하는 사용자가 DB에 존재하는지 검증
// 3. 사용자가 존재하지 않거나 사용자와 입력받은 password가 일치하는지 검증
// 4. 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요." 라는 에러메세지
// 5. 로그인 생성시 로그인에 성공한 유저의 정보를 JWT 생성 후 클라이언트에게 Cookie로 전달

const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const User = require("../schemas/user");

// 로그인 API
router.post("/auth", async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname });

    // 닉네임과 일치하는 사용자가 존재하지 않거나 
    // 사용자와 입력받은 password가 일치하는지 검증
    if (!user || user.password !== password) {
        res.status(401).json({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
        });
        return;
    }
    // JWT를 생성
    const token = jwt.sign(
        { userId: user.userId },
        "customized-secret-key",
    );

    res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
    res.status(200).json({ token }); // JWT를 Response Body로 할당합니다!
});

module.exports = router;