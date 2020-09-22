import React from 'react';

interface TitleProps {
  title: string;
  subtitle?: string;
}

function Title({ title, subtitle }: TitleProps) {
  return (
    <>
      <div className={'title element'}> { title } </div>
      { subtitle && <div className={'subtitle element'}> { subtitle } </div> }
    </>
  );
}

export default Title;
