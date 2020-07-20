import React from 'react';

interface StatViewProps {
    time: number,
    calorie: number,
    score: number,
};

function StatView({time, calorie, score} : StatViewProps) {
  return (
    <div className={'boxContainer'}>
      <div className={'box'}> {(time - time%60) / 60}분 {time%60}초 </div>
      <div className={'box'}> {calorie}칼로리 소모 </div>
      <div className={'box'}> {score*100}점 </div>
    </div>
  );
}

StatView.defaultProps = {
  time: 63,
  calorie: 0,
  score: 0,
};

export default StatView;
