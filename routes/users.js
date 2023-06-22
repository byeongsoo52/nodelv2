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

const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 내 정보 조회 API
router.get("/users/me", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  res.status(200).json({
    user: { nickname: nickname }
  });
});

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  // Validate nickname
  if (!/^[a-zA-Z0-9]{3,}$/.test(nickname)) {
    res.status(400).json({
      errorMessage: "닉네임은 최소 3자 이상의 알파벳 대소문자와 숫자로 이루어져야 합니다.",
    });
    return;
  }

  // password는 최소 4자 이상 
  if (password.length < 4) {
    res.status(400).json({
      errorMessage: "비밀번호는 최소 4자 이상이어야 합니다.",
    });
    return;
  }

  // 닉네임과 같은 값이 포함된 경우 회원가입에 실패로 만들기
  if (password.includes(nickname)) {
    res.status(400).json({
      errorMessage: "비밀번호에는 닉네임과 동일한 값을 포함할 수 없습니다.",
    });
    return;
  }

  // password와 confirmPassword가 동일한지 검증 
  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUser = await User.findOne({ nickname });
  if (existsUser) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
    res.status(400).json({
      errorMessage: "닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ nickname, password });
  await user.save(); // DB에 저장한다.

  // status(201) = REST API의 원칙에 따라 Created라는 의미로 지정
  res.status(201).json({});
});


module.exports = router;