import KakaoLogin from 'react-kakao-login';
import { kakaoJsKey } from 'utility/secret';
import React from 'react';
import { login, getUserInfo, setAccessToken } from 'utility/api';
import { Redirect } from 'react-router-dom';
import { userInfoHasMetadata } from 'utility/types';
import { useSelector, useStore } from 'react-redux';
import { RootReducerState as RootReducerState } from 'reducers';

interface LoginButtonProps {

}

const LoginButton = ({ }: LoginButtonProps) => {
  let [status, setStatus] = React.useState(0);
  let store = useStore();
  let userInfo = useSelector((state : RootReducerState) => state.user.userInfo );

  if (status == 2) return <Redirect to="/signup" />;

  return (
    <KakaoLogin
      jsKey={kakaoJsKey}
      onSuccess={async (response) => {
        setStatus(1);
        const { token } = await login(
          response.profile.id,
          response.profile.kakao_account.profile.profile_image_url,
          response.response.access_token,
          store.dispatch,
        );
        if (!userInfoHasMetadata(await getUserInfo())) setStatus(2);
      }}
      onFailure={console.log}
      render={(props: any) => (
        <div onClick={props.onClick}>
          {status == 0 && '로그인!'}
          {status == 1 && '로그인 중...'}
        </div>
      )}
      getProfile={true}
    />
  );
};

export default LoginButton;
