import React, { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import { headerLogo, searchIcon, userIcon, settingIcon, logoutIcon } from 'utility/svg';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
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
  let [query, setQuery] = React.useState<string>();


  const dropdownMenu = real && React.useMemo(() => (
    <li className="dropdown right" onMouseLeave={() => setMouseHover(false)}>
      <div className="dropdown-content">
      <ArrowForwardIosIcon fontSize="large" onClick={() => setMouseHover(false)} />
      { user.loggedIn ? (
        <>
          <div className="text"> <Link to={`/user/${user.userInfo.nickname}`}><span style={{fontWeight: 700}}>{user.userInfo.nickname}</span></Link>님 안녕하세요! </div>
          <div> <Link to="/mypage"> 마이페이지 </Link> </div>
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

  return (
    <header>
      <div className="logo">
          <Link to="/" onClick={() => { system.error && store.dispatch(closeError()); } }>
            { headerLogo }
          </Link>
      </div>
      <div className="menu leftmenu">
        { user.loggedIn && (
          <div style={{top: '-8px', height: '16px'}}>
            <Link to="/studio">
              Studio
            </Link>
          </div>
        )}
      </div>
      <div className="menu rightmenu">
        { user.loggedIn && (
          <>
            <div style={{top: '-18px', height: '33px'}}>
              <input className='search' value={query} onChange={(event) => setQuery(event.target.value) } />	
            </div>
            <div style={{top: '-16px', height: '32px'}}>
              <span style={{paddingLeft: '48px'}} />
                <Link to={`/search/${query}`}>
                  { searchIcon }
                </Link>
                <span style={{paddingLeft: '64px'}} />
                <Link to="/mypage">
                  { userIcon }
                </Link>
                <span style={{paddingLeft: '64px'}} />
                <Link to="/setting">
                  { settingIcon }
                </Link>
                <span style={{paddingLeft: '64px'}} />
                <Link to="/logout">
                  { logoutIcon }
                </Link>
            </div>
          </>
        )}
        { !user.loggedIn && (
          <>
            <div style={{top: '-18px', height: '33px'}}>
              <input className='search' value={query} onChange={(event) => setQuery(event.target.value) } />	
            </div>
            <span style={{paddingLeft: '48px'}} />
            <div style={{top: '-16px', height: '32px'}}>
              <Link to={`/search/${query}`}>
                { searchIcon }
              </Link>
           </div>
            <span style={{paddingLeft: '64px'}} />
            <div style={{top: '-16px', height: '32px'}}>
              <LoginButton/>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
