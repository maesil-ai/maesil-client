import React, { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import LockIcon from '@material-ui/icons/Lock';
import LoginButton from './LoginButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootReducerState } from 'reducers';
import store from 'store';
import { closeError } from 'actions';

interface HeaderProps {
  real?: boolean;
};

function Header({ real = true } : HeaderProps) {
  let user = useSelector((state : RootReducerState) => state.user );
  let system = useSelector((state : RootReducerState) => state.system );
  let [mouseHover, setMouseHover] = React.useState(false);

  const dropdownMenu = real && React.useMemo(() => (
    <li className="dropdown right" onMouseLeave={() => setMouseHover(false)}>
      <div className="dropdown-content">
      { user.loggedIn ? <PermIdentityIcon fontSize="large" /> : <LockIcon fontSize="large" /> }
      {user.loggedIn ? (
        <>
          <div className="text"> {user.userInfo.nickname}님 안녕하세요! </div>
          <div> <Link to="/mypage"> 마이페이지 </Link> </div>
          <div> <Link to={`/user/${user.userInfo.nickname}`}> 내 채널 </Link> </div>
          <div> <Link to="/upload/exercise"> 스튜디오 </Link> </div>
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

  const smallDropdownMenu = real && React.useMemo(() => (
    <li className="dropdown right" onMouseEnter={() => setMouseHover(true)}>
      <div className="dropdown-content">
      { user.loggedIn ? <PermIdentityIcon fontSize="large" /> : <LockIcon fontSize="large" /> }
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
        { mouseHover ? dropdownMenu : smallDropdownMenu }
      </ul>
    </header>
  );
}

export default Header;
