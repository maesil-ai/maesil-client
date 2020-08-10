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
        <div> { `유저 ${data.userId}님이 만듦 | ${data.playTime}초 | 조회수 ${data.viewCount} | 좋아요 ${data.heartCount}` } </div>
        <div> { `${data.description}` } </div>
        <Link to={ `/exercise/${data.id}` }> <button> 운동 시작하기 </button> </Link>
    </div>
  );
}

export default ExerciseDetail;
