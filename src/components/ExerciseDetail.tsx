import React from 'react';
import { ExerciseData } from 'utility/types';

interface ExerciseDetailProps {
  data : ExerciseData;
};

function ExerciseDetail({ data }: ExerciseDetailProps) {
  return (
    <div className='zone'>
        <div> { `${data.id} ${data.name}` } </div>
        <div> { `${data.userId}번 유저 만듦` } </div>
        <div> { `${data.playTime}초` } </div>
        <div> { `조회수 ${data.viewCount} 좋아요 ${data.heartCount}` } </div>
        <div> { `${data.description}` } </div>
    </div>
  );
}

export default ExerciseDetail;
