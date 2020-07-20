import React from 'react';

import {Link} from 'react-router-dom';

interface HeaderProps {

};

interface HeaderState {

};

/**
 * Header 클래스
 * @class Header
 * @extends {React.Component<HeaderProps, HeaderState>}
 */
class Header extends React.Component<HeaderProps, HeaderState> {
  /**
   * react render 함수
   * @return {any} HTML 반환
   * @memberof Header
   */
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
