import KakaoLogin from 'react-kakao-login';
import { kakaoJsKey } from 'utility/secret';
import React from 'react';
import { login } from 'utility/api';
import { Redirect } from 'react-router-dom';

interface LoginButtonProps {

};

const LoginButton = ({ } : LoginButtonProps) => {
    let [status, setStatus] = React.useState(0);

    if (status == 2) {
        return (
            <Redirect to='/signup'/>
        )
    }
    return (
        <KakaoLogin
            jsKey={kakaoJsKey}
            onSuccess={async (response) => {
                setStatus(1);
                const { token } = await login(response.profile.id, 
                    response.profile.kakao_account.profile.profile_image_url, 
                    response.response.access_token);
                localStorage.setItem('token', token);
                setStatus(2);
            }}
            onFailure={console.log}
            render={(props: any) => (
                <div onClick={props.onClick}>
                    { status == 0 && "로그인!" }
                    { status == 1 && "로그인 중..." }
                    { status == 2 && "회원가입 시켜야 되는데..." }
                </div>
            )}
            getProfile={true}
        />
    );
};

export default LoginButton;