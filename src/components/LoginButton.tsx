import KakaoLogin from 'react-kakao-login';
import React from 'react';

import { login } from 'utility/api';
import * as dotenv from 'dotenv';
import { Redirect } from 'react-router-dom';

interface LoginButtonProps {

};

const LoginButton = ({}: LoginButtonProps) => {
  let [status, setStatus] = React.useState(0);
  if (status == 2) return <Redirect to="/signup" />;
  dotenv.config();

  console.log(process.env);

  return (
    <KakaoLogin
      jsKey={process.env.REACT_APP_KAKAO_JS_KEY}
      onSuccess={async (response) => {
        const id = response.profile.id;
        const profileImageUrl = response.profile.kakao_account.profile.profile_image_url;
        const kakaoToken = response.response.access_token;
        await login(id, profileImageUrl, kakaoToken);
      }}
      onFailure={console.log}
      render={(props: any) => (
        <div onClick={() => {
            setStatus(1);
            props.onClick();
          }
        } 
          style={{cursor:'pointer'}}
        >
          {status == 0 && '로그인'}
          {status == 1 && '로그인 중...'}
        </div>
      )}
      getProfile={true}
    />
  );
};

export default LoginButton;
