import React, { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import { headerLogo, searchIcon, userIcon, settingIcon, logoutIcon, headerLogoHorizontal, backIcon, sidebarIcon, closeIcon } from 'utility/svg';
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
  let [query, setQuery] = React.useState<string>();
  let [searchPhase, setSearchPhase] = React.useState<boolean>(false);
  let [sidebarOn, setRealSidebarOn] = React.useState<number>(0);
  let [sidebarNext, setSidebarOn] = React.useState<boolean>(false);

  React.useEffect(() => {
    let halt = false;
    setTimeout(() => {
      let nextSidebar = (sidebarOn * 3 + (sidebarNext ? 1 : 0)) / 4; 
      if (nextSidebar < 0.002) setRealSidebarOn(0);
      else if (nextSidebar > 0.998) setRealSidebarOn(1);
      else setRealSidebarOn(nextSidebar);
    }, 30);
    return () => halt = true;
  }, [sidebarOn, sidebarNext]);

  let sidebar = (
    <>
      <div className='sidebarShadow' style={{opacity: sidebarOn * 0.6}} onClick={() => setSidebarOn(false) }/>
      <div className='sidebar' style={{transform: `translateX(${(1-sidebarOn) * -(100)}%)`}}>
        <div className='profilePart'>
          <div className='profileBox middle'>
            <img className='profileImage' src={user.userInfo.profile_image}/>
          </div>
          <Link to={user.loggedIn ? '/mypage' : '/'} className='profileName'>
            { user.loggedIn ? `${user.userInfo.nickname}님, 안녕하세요!` : '먼저 로그인해 주세요.' }
          </Link>
        </div>
        <div className='closeButton' onClick={() => setSidebarOn(false) }>
          { closeIcon }
        </div>
        <div className='menuPart'>
          { user.loggedIn && (
            <>
              <Link to='/mypage' className='menu'>
                마이페이지
              </Link>
              <Link to='/studio' className='menu'>
                새로운 운동 올리기
              </Link>
            </>
          )}
          { user.loggedIn && user.subscribes.length > 0 && (
            <>
              <div className='line' />
              <div className='title'>
                { user.userInfo.nickname }님이 구독한 채널
              </div>
              { user.subscribes.map((channel) => (
                <Link to={`/user/${channel.name}`} className='menu' key={ channel.name }>
                  { channel.name }
                </Link>
              )) }
            </>
          )}
        </div>
        <div className='bottomPart'>
          <Link className='leftButton' to='/setting'>
            { settingIcon }
          </Link>
          { user.loggedIn && (
            <Link className='rightButton' to="/logout">
              { logoutIcon }
            </Link>
          )}
        </div>
      </div>
    </>
  );

  if (searchPhase) return (
    <>
      <header>
        <div className='menu leftMenu' style={{width: '100%'}}>
          <div style={{top: '32px', height: '32px', marginLeft: '20px' }} onClick={() => setSearchPhase(false)}>
            { backIcon }
          </div>
          <span className='blank' />
          <div style={{top: '23px', height: '33px', flexGrow: 1}}>
            <input className='search' value={query} onChange={(event) => setQuery(event.target.value) } style={{width: '100%'}} />	
          </div>
          <span className='blank' />
          <div style={{top: '26px', height: '32px', marginRight: '39px'}}>
            <Link to={`/search/${query}`}>
              { searchIcon }
            </Link>
          </div>
        </div>
      </header>
      { sidebarOn > 0 && sidebar }
      <div style={{paddingBottom: '98px'}} />
    </>
  )
  else return (
    <>
    <header>
      <div className="logo">
          <Link to="/" onClick={() => { system.error && store.dispatch(closeError()); } }>
            { headerLogoHorizontal }
          </Link>
      </div>
      <div className="menu leftmenu">
        <span className='blank' />
        <div style={{top: '22px', height: '31px'}} onClick={() => setSidebarOn(true) }>
          { sidebarIcon }
        </div>
      </div>

      <div className="menu rightmenu">
        <div className='desktopTabletOnly' style={{top: '23px', height: '33px'}}>
          <input className='search' value={query} onChange={(event) => setQuery(event.target.value) } />	
        </div>
        <span className='desktopTabletOnly blank' />
        <div className='desktopTabletOnly' style={{top: '26px', height: '32px'}}>
          <Link to={`/search/${query}`}>
            { searchIcon }
          </Link>
        </div>
        <div className='mobileOnly' style={{top: '26px', height: '32px'}} onClick={() => setSearchPhase(true)}>
          { searchIcon }
        </div>
        { user.loggedIn && (
          <>
            <span className='blank' />
            <Link to='/mypage' style={{transform: 'translateY(11px)'}}>
                <div className='profileBox middle'>
                  <img className='profileImage' src={user.userInfo.profile_image}/>
                </div>
            </Link>
          </>
        )}
        { !user.loggedIn && (
          <>
            <span className='blank' />
            <div style={{top: '0px', height: '32px'}}>
              <LoginButton/>
            </div>
          </>
        )}
        <span className='blank' />
      </div>
    </header>
    { sidebarOn > 0 && sidebar }
    <div style={{paddingBottom: '98px'}} />
    </>
  );
}

export default Header;
