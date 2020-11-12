import KakaoLogin from 'react-kakao-login';
import React from 'react';

import { login } from 'utility/api';
import * as dotenv from 'dotenv';

interface LoginButtonProps {

};

const LoginButton = ({}: LoginButtonProps) => {
  dotenv.config();

  return (
    <KakaoLogin
      jsKey={process.env.REACT_APP_KAKAO_JS_KEY}
      onSuccess={async (response) => {

        console.log(response);
        const id = response.profile.id;
        const profileImageUrl = response.profile.kakao_account.profile.profile_image_url;
        const kakaoToken = response.response.access_token;
        await login(id, profileImageUrl, kakaoToken);
      }}
      onFailure={console.log}
      useDefaultStyle={true}
      getProfile={true}
    />
  );
};

export default LoginButton;
