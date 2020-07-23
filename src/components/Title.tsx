import React from 'react';

interface TitleProps {
  title : string,
};

/**
 * 타이틀 컴포넌트 결과창 위에 있는 타이틀
 * @param {TitleProps} {title}
 * @return {HTML} title div
 */
function Title({title} : TitleProps) {
  return (
    <div className={'title element'}>
      { title }
    </div>
  );
}

export default Title;
