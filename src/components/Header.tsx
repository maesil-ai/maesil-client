import React, { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LoginButton from './LoginButton';
import {  useSelector, useDispatch } from 'react-redux';
import { RootReducerState } from 'reducers';
import store from 'store';
import { closeError } from 'actions';

interface HeaderProps {
  real?: boolean;
};

function Header({ real = true } : HeaderProps) {
  let user = useSelector((state : RootReducerState) => state.user );
  let system = useSelector((state : RootReducerState) => state.system );

  const dropdownMenu = real && React.useMemo(() => (
    <li className="dropdown right">
      <div style={{ padding: '28.5px' }}>
        <PermIdentityIcon fontSize="large" />
      </div>
      <div className="dropdown-content">
        {user.loggedIn ? (
          <>
            <div className="text"> {user.userInfo.nickname}님 안녕하세요! </div>
            <div> <Link to="/mypage"> 마이페이지 </Link> </div>
            <div> <Link to={`/user/${user.userInfo.nickname}`}> 내 채널 </Link> </div>
            <div> <Link to="/upload/exercise"> 운동 올리기 </Link> </div>
            <div> <Link to="/upload/course"> 운동 코스 올리기 </Link> </div>
            <div> <Link to="/setting"> 설정 </Link> </div>
            <div> <Link to="/logout"> 로그아웃 </Link> </div>
            <div className="text"> 구독한 채널들 </div>
            {user.loggedIn && user.subscribes.map((channel) => (
              <div key={channel.id}>
                <Link to={`/user/${channel.name}`}> {channel.name} </Link>
              </div>
            ))}
          </>
            ) : (
          <LoginButton />
        )}
      </div>
    </li>
  ), [user]);


  return (
    <header>
      <ul>
        <li className="left">
          <Link to="/" style={{ padding: '32px' }} onClick={() => { system.error && store.dispatch(closeError()); } }>
            매실
          </Link>
        </li>
        { dropdownMenu }
      </ul>
    </header>
  );
}

export default Header;
