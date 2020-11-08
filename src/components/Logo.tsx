import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
    imageUrl?: string;
    background?: string;
    title: string;
    text: JSX.Element;
    button: JSX.Element;
};

function Logo({background, imageUrl, title, text, button} : LogoProps) {
    return (
        <div className='banner' style={background ? {background: background} : {}}>
          { imageUrl && <img className='bannerImage' src={ imageUrl } /> }
          <div className='bannerTitle'>
            { title }
          </div>
          <div className='bannerText'>
            { text }
          </div>
          <Link to='/tutorial'>
            { button }
          </Link>
        </div>
    );
}

export default Logo;