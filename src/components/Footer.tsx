import React from 'react';
import { headerLogo, headerLogoHorizontal } from 'utility/svg';

function Footer() {
  return (
    <footer>
      <div className='item logo'> 
        { headerLogoHorizontal } 
      </div>
      <div className='item text'>
        © SW마에스트로 11기 코드블루팀
      </div>
    </footer>
  );
}

export default Footer;
