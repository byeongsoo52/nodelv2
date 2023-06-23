const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;
    // Nullish coalescing operator
    // 널 병합 연산자 (??) 는 왼쪽 피연산자가 null 또는 undefined일 때 오른쪽 피연산자를 반환하고,
    // 그렇지 않으면 왼쪽 피연산자를 반환하는 논리 연산자이다.
    // authorization 쿠키가 존재하지 않았을 때를 대비
    const [authType, authToken] = (Authorization ?? "").split(" ");

    // authType === Bearer값인지 확인
    // authToken 검증
    if (!authToken || authType !== "Bearer") {
        res.status(403).json({
            errorMessage: "로그인이 필요한 기능입니다.",
        });
        return;
    }

    // jwt 검증
    try {
        // 1. authToken이 만료되었는지 확인
        // 2. authToken이 서버가 발급 토큰이 맞는지 검증
        const { userId } = jwt.verify(authToken, "customized-secret-key");
        
        // 3. autoToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
        const user = await User.findById(userId);
        
        // 데이터베이스에서 사용자 정보를 가져오지 않게 할 수 있도록 
        // express가 제공하는 안전한 변수인 res.locals에 담아두고, 
        // 언제나 꺼내서 사용할 수 있게 작성
        res.locals.user = user;
        next(); // 이 미들웨어 다음으로 보낸다.
    } catch (err) {
        console.error(err);
        res.status(403).json({
            errorMessage: "전달된 쿠키에서 오류가 발생하였습니다.",
        });
        return;
    };
};