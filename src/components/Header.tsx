import React from 'react';

import {Link} from 'react-router-dom';

interface HeaderProps {

};

interface HeaderState {

};

class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    return (
      <header>
        <Link to="/">
                    매실
        </Link>
      </header>
    );
  }
};

export default Header;
