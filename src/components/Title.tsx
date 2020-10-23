import React from 'react';

interface TitleProps {
  size?: string;
  title: string;
  subtitle?: string;
}

function Title({ size = 'large', title, subtitle }: TitleProps) {
  if (size == 'small') return (
    <>
      <div className='title small grey'> { title } </div>
    </>
  );
  
  else return (
    <>
      <div className='title large element'> { title } </div>
      { subtitle && <div className='subtitle element'> { subtitle } </div> }
    </>
  );
}

export default Title;
