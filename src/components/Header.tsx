import React from 'react';
import { Link } from 'react-router-dom';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

function Header() {
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
              <Link to='/upload'>
                스튜디오
              </Link>
              <div>
                로그아웃
              </div>
            </div>
          </li>
        </ul>
    </header>
  );
}

export default Header;