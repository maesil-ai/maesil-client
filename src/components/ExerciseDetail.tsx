import React from 'react';
import { ExerciseData } from 'utility/types';
import { Link } from 'react-router-dom';

interface ExerciseDetailProps {
  data : ExerciseData;
};

function ExerciseDetail({ data }: ExerciseDetailProps) {
  return (
    <div className='zone'>
        <div> { `${data.id}번: ${data.name}` } </div>
        <div> { `유저 ${data.userId}가 만듦` } </div>
        <div> { `${data.playTime}초` } </div>
        <div> { `조회수 ${data.viewCount} 좋아요 ${data.heartCount}` } </div>
        <div> { `${data.description}` } </div>
        <Link to={ `/exercise/${data.id}` }> <button> ㄱㄱ </button> </Link>
    </div>
  );
}

export default ExerciseDetail;
