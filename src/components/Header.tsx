import React, { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import { headerLogo, searchIcon, userIcon, settingIcon, logoutIcon, headerLogoHorizontal, backIcon } from 'utility/svg';
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
  let [searchPhase, setSearchPhase] = React.useState<boolean>(false);

  if (searchPhase) return (
    <header>
      <div className='menu leftMenu' style={{width: '100%'}}>
        <div style={{top: '44px', height: '32px', marginLeft: '20px' }} onClick={() => setSearchPhase(false)}>
          { backIcon }
        </div>
        <span className='blank' />
        <div style={{top: '33px', height: '33px', flexGrow: 1}}>
          <input className='search' value={query} onChange={(event) => setQuery(event.target.value) } style={{width: '100%'}} />	
        </div>
        <span className='blank' />
        <div style={{top: '36px', height: '32px', marginRight: '39px'}}>
          <Link to={`/search/${query}`}>
            { searchIcon }
          </Link>
        </div>
      </div>
    </header>
  )
  else return (
    <header>
      <div className="logo">
          <Link to="/" onClick={() => { system.error && store.dispatch(closeError()); } }>
            { headerLogoHorizontal }
          </Link>
      </div>
      <div className="menu leftmenu">
        <span className='blank' />
        <div className='desktopOnly' style={{top: '37px', height: '33px'}}>
          <input className='search' value={query} onChange={(event) => setQuery(event.target.value) } />	
        </div>
        <span className='desktopOnly' style={{paddingLeft: '48px'}} />
        <div className='desktopOnly' style={{top: '37px', height: '32px'}}>
          <Link to={`/search/${query}`}>
            { searchIcon }
          </Link>
        </div>
      </div>

      <div className="menu rightmenu">
        <div className='tabletOnly' style={{top: '37px', height: '33px'}}>
          <input className='search' value={query} onChange={(event) => setQuery(event.target.value) } />	
        </div>
        <span className='tabletOnly blank' />
        <div className='tabletOnly' style={{top: '37px', height: '32px'}}>
          <Link to={`/search/${query}`}>
            { searchIcon }
          </Link>
        </div>
        <div className='mobileOnly' style={{top: '37px', height: '32px'}} onClick={() => setSearchPhase(true)}>
          { searchIcon }
        </div>
        { user.loggedIn && (
          <>
            <div style={{top: '34px', height: '32px'}}>
                <span className='blank' />
                <Link to="/mypage">
                  { userIcon }
                </Link>
                <span className='blank' />
                <Link to="/setting">
                  { settingIcon }
                </Link>
                <span className='blank tabletDesktopOnly' />
                <Link className='tabletDesktopOnly' to="/logout">
                  { logoutIcon }
                </Link>
            </div>
          </>
        )}
        { !user.loggedIn && (
          <>
            <span className='blank' />
            <div style={{top: '36px', height: '32px'}}>
              <LoginButton/>
            </div>
          </>
        )}
                <span className='blank' />
      </div>
    </header>
  );
}

export default Header;
