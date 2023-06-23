// 과제에서 요구하는 회원가입의 비즈니스 로직
// 1. nickname, password, confirmPassword 를 전달 받음
// 2. nickname은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성
// 3. password는 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패로 만들기
// 4. password와 confirmPassword가 동일한지 검증
// 5. nickname 값이 이미 DB에 존재하는지 검증해 있을 경우 
//    "중복된 닉네임입니다." 라는 에러메세지를 response에 포함
// 6. nickname, password를 DB에 저장

const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 회원가입 API
router.post('/signup', async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;
    try {
        // 닉네임 형식 검사
        let nicknameCheck = /^[a-zA-Z0-9]{3,}$/
        if (!nicknameCheck.test(nickname)) {
            res.status(412).json({
                errorMessage: "닉네임의 형식이 일치하지 않습니다.",
            });
            return;
        }

        // password는 최소 4자 이상 
        if (password.length < 4) {
            res.status(412).json({
                errorMessage: "패스워드 형식이 일치하지 않습니다.",
            });
            return;
        }

        // 닉네임과 같은 값이 포함된 경우 회원가입에 실패로 만들기
        if (password.includes(nickname)) {
            res.status(412).json({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
            });
            return;
        }

        // password와 confirmPassword가 동일한지 검증 
        if (password !== confirmPassword) {
            res.status(412).json({
                errorMessage: "패스워드가 일치하지 않습니다.",
            });
            return;
        }

        // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
        const existsUser = await User.findOne({ nickname });
        if (existsUser) {
            // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
            res.status(412).json({
                errorMessage: "중복된 닉네임입니다.",
            });
            return;
        }

        const user = new User({ nickname, password });
        await user.save(); // DB에 저장한다.

        // status(201) = REST API의 원칙에 따라 Created라는 의미로 지정
        res.status(201).json({
            message: "회원 가입에 성공하였습니다."
        });
    } catch (err) {
        res.status(400).json({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        });
        return;
    }
});

// 과제에서 요구하는 로그인의 비즈니스 로직
// 1. nickname, password를 전달 받음
// 2. nickname에 해당하는 사용자가 DB에 존재하는지 검증
// 3. 사용자가 존재하지 않거나 사용자와 입력받은 password가 일치하는지 검증
// 4. 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요." 라는 에러메세지
// 5. 로그인 생성시 로그인에 성공한 유저의 정보를 JWT 생성 후 클라이언트에게 Cookie로 전달

// 로그인 API
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    try {
        const user = await User.findOne({ nickname });

        // 닉네임과 일치하는 사용자가 존재하지 않거나 
        // 사용자와 입력받은 password가 일치하는지 검증
        if (!user || user.password !== password) {
            res.status(412).json({
                errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
            });
            return;
        }
        // JWT를 생성
        const token = jwt.sign(
            { userId: user.userId },
            "customized-secret-key",
        );
        // 쿠키 생성   
        res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당합니다
        res.status(200).json({ token }); // JWT를 Response Body로 할당합니다
    } catch (err) {
        res.status(400).json({
            errorMessage: "로그인에 실패하였습니다."
        })
    }
});

module.exports = router;