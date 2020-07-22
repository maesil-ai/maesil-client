import React from 'react';

import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
        <Link to='/'>
          <div>매실</div>
        </Link>
    </header>
  );
}

export default Header;