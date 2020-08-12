import React from 'react';
import { ExerciseData } from 'utility/types';
import { Link } from 'react-router-dom';

interface ExerciseDetailProps {
  data : ExerciseData;
};

function ExerciseDetail({ data }: ExerciseDetailProps) {
  return (
    <div className='detail'>
        <h1> { `${data.name}` } </h1>
        <div> <Link to={`/user/${data.userName}`}>{data.userName}</Link>{`님이 만듦 | ${data.playTime}초 | 조회수 ${data.viewCount} | 좋아요 ${data.heartCount}` } </div>
        <div> { `${data.description}` } </div>
        <Link to={ `/exercise/${data.id}` }> <button> 운동 시작하기 </button> </Link>
        <div> 지금은 로그인하지 않으면 운동 결과를 볼 수가 없어요..^^;; </div>
    </div>
  );
}

export default ExerciseDetail;
