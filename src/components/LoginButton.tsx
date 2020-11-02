import KakaoLogin from 'react-kakao-login';
import React from 'react';

import { login } from 'utility/api';
import * as dotenv from 'dotenv';
import { Redirect } from 'react-router-dom';
import { loginIcon } from 'utility/svg';

interface LoginButtonProps {

};

const LoginButton = ({}: LoginButtonProps) => {
  let [status, setStatus] = React.useState(0);
  if (status == 2) return <Redirect to="/signup" />;
  dotenv.config();

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
        <>
          <span onClick={() => {
              setStatus(1);
              props.onClick();
            }
          } 
            style={{cursor: 'pointer'}}
          >
            { loginIcon }
          </span>
        </>
      )}
      getProfile={true}
    />
  );
};

export default LoginButton;
