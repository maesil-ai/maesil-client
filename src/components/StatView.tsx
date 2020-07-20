import React from 'react';

interface StatViewProps {
    time: number,
    calorie: number,
    score: number,
};

/**
 * 결과창 페이지 인자로 보여줄 스탯값을 넘겨주고 예쁘게 출력
 * @param {StatViewProps} {time, calorie, score}
 * @return {any} HTML 페이지
 */
function StatView({time, calorie, score} : StatViewProps) {
  return (
    <div className={'boxContainer'}>
      <div className={'box'}> {(time - time%60) / 60}분 {time%60}초 </div>
      <div className={'box'}> {Math.round(calorie)}칼로리 소모 </div>
      <div className={'box'}> {Math.round(score*100)}점 </div>
    </div>
  );
}

StatView.defaultProps = {
  time: 63,
  calorie: 0,
  score: 0,
};

export default StatView;
