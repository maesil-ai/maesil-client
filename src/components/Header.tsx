import React from 'react';

import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
        <Link to='/'>
          <div className={"top-bar-left"}>매실</div>
        </Link>
        <Link to='/upload'>
          <div className={"top-bar-right"}>업로드</div>
        </Link>
        <div className={"top-bar-right font-effect-fire-animation"}></div>
    </header>
  );
}

export default Header;