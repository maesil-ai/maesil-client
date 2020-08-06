import React from 'react';
import { Link } from 'react-router-dom';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LoginButton from './LoginButton';
import { getUserInfo } from 'utility/api';
import { APIGetUserInfoData } from 'utility/types';

function Header() {
  let [status, setStatus] = React.useState<number>(0);
  let [userInfo, setUserInfo] = React.useState<APIGetUserInfoData>();

  React.useEffect(() => {
    let ok = true;
    getUserInfo().then((info) => {
      if (ok) {
        setUserInfo(info);
        if (info) setStatus(2);
        else setStatus(1);
      }
    });
    return () => {
      ok = false;
    };
  }, [status]);

  const handleLoginSuccess = () => {
    setStatus(2);
  };

  const dropdownMenu = (
    <li className="dropdown right">
      <div style={{ padding: '28.5px' }}>
        <PermIdentityIcon fontSize="large" />
      </div>
      <div className="dropdown-content">
        {userInfo ? (
          <div className="text"> {userInfo.nickname}님 안녕하세요! </div>
        ) : (
          <LoginButton onSuccess={handleLoginSuccess} />
        )}
        {userInfo && (
          <div>
            <Link to="/mypage"> 마이페이지 </Link>
          </div>
        )}
        {userInfo && (
          <div>
            <Link to="/upload"> 운동 업로드 </Link>
          </div>
        )}
        {userInfo && (
          <div>
            <Link to="/logout"> 로그아웃 </Link>
          </div>
        )}
      </div>
    </li>
  );

  return (
    <header>
      <ul>
        <li className="left">
          <Link to="/" style={{ padding: '32px' }}>
            매실
          </Link>
        </li>
        {status ? dropdownMenu : <></>}
      </ul>
    </header>
  );
}

export default Header;
