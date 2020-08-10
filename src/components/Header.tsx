import React, { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LoginButton from './LoginButton';
import {  useSelector, useDispatch } from 'react-redux';
import { RootReducerState } from 'reducers';
import { UserAction } from 'actions';
import { getUserInfo } from 'utility/api';
import { SET_USER } from 'actions/ActionTypes';

function Header() {
  let userInfo = useSelector((state : RootReducerState) => state.user.userInfo );
  let dispatch = useDispatch<Dispatch<UserAction>>();

  React.useEffect(() => {
    getUserInfo().then((data) => {
      if (data) {
        dispatch({
          type: SET_USER,
          userInfo: data,
        });
      }
    });
  }, []);

  const dropdownMenu = React.useMemo(() => (
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
  ), [userInfo]);

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
