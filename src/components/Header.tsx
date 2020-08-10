import React from 'react';
import { Link } from 'react-router-dom';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LoginButton from './LoginButton';
import { useStore, useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootReducerState } from 'reducers';

function Header() {
  let userInfo = useSelector((state : RootReducerState) => state.user.userInfo );

  const dropdownMenu = (
    <li className="dropdown right">
      <div style={{ padding: '28.5px' }}>
        <PermIdentityIcon fontSize="large" />
      </div>
      <div className="dropdown-content">
        {userInfo ? (
          <div className="text"> {userInfo.nickname}님 안녕하세요! </div>
        ) : (
          <LoginButton />
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
        { dropdownMenu }
      </ul>
    </header>
  );
}

export default Header;
