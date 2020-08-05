import React from 'react';
import { Link } from 'react-router-dom';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LoginButton from './LoginButton';
import { getAccessToken, getUserInfo } from 'utility/api';
import { APIGetUserInfoData } from 'utility/types';

function Header() {
  let [userInfo, setUserInfo] = React.useState<APIGetUserInfoData>();

  React.useEffect(() => {
    getUserInfo(getAccessToken()).then((info) => {
      setUserInfo(info);
      console.log(info);
    });
  }, []);

  return (
    <header>
        <ul>
          <li className="left">
            <Link to='/' style={{ padding: "32px" }}>
              매실
            </Link>
          </li>
          <li className="dropdown right">
            <div style={{ padding: "28.5px" }}>
              <PermIdentityIcon fontSize="large" />
            </div>
            <div className="dropdown-content">
              { userInfo ? <div className="text"> {userInfo.nickname}님 안녕하세요! </div> : <LoginButton/> }
              { userInfo && <div><Link to='/mypage'> 마이페이지 </Link></div> }
              { userInfo && <div><Link to='/upload'> 운동 업로드 </Link></div> }
            </div>
          </li>
        </ul>
    </header>
  );
}

export default Header;