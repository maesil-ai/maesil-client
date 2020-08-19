import KakaoLogin from 'react-kakao-login';
import { kakaoJsKey } from 'utility/secret';
import React from 'react';
import { login } from 'utility/api';

const LoginButton = () => {
  let [status, setStatus] = React.useState(0);
  return (
    <KakaoLogin
      jsKey={kakaoJsKey}
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
        }>
          {status == 0 && '카카오톡으로 로그인!'}
          {status == 1 && '로그인 중...'}
        </div>
      )}
      getProfile={true}
    />
  );
};

export default LoginButton;
