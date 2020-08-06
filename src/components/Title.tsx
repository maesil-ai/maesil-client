import React from 'react';

interface TitleProps {
  title: string;
}

function Title({ title }: TitleProps) {
  return <div className={'title element'}>{title}</div>;
}

export default Title;
