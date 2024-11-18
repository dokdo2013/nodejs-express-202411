const express = require("express");
const axios = require("axios");
const qs = require("qs");

const app = express();
const port = 3000;

// 카카오 REST API 키와 Redirect URI 설정 (자신의 값으로 변경)
const REST_API_KEY = "";
const REDIRECT_URI = "http://localhost:3000/login-callback";

// 카카오 로그인 페이지로 리다이렉트하는 라우트
app.get("/login", (req, res) => {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.redirect(kakaoAuthURL);
});

// 카카오 인증 후 Redirect URI로 돌아왔을 때 호출되는 콜백 라우트
app.get("/login-callback", async (req, res) => {
  const { code } = req.query; // Authorization Code 받기

  try {
    // Authorization Code를 이용하여 Access Token 요청
    const tokenResponse = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      data: qs.stringify({
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    const { access_token } = tokenResponse.data; // Access Token 추출

    // Access Token을 이용하여 사용자 정보 조회
    const userResponse = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    // 사용자 정보를 클라이언트에게 전달
    // res.json(userResponse.data);

    res.json({
      profile_image: userResponse.data.kakao_account.profile.profile_image_url,
      profile_nickname: userResponse.data.kakao_account.profile.nickname,
    });
  } catch (error) {
    console.error(error);
    res.json(error.response.data);
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
