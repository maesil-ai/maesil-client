import React from 'react';
import { APIGetExerciseData } from 'utility/types';

interface ExerciseDetailProps {
  rawData : APIGetExerciseData;
};

function ExerciseDetail({ rawData }: ExerciseDetailProps) {
  return (
    <div className='zone'>
        <div> { `${rawData.exercise_id} ${rawData.title}` } </div>
        <div> { `${rawData.user_id}번 유저 만듦` } </div>
        <div> { `${rawData.play_time}초` } </div>
        <div> { `조회수 ${rawData.view_counts} 좋아요 ${rawData.like_counts}` } </div>
        <div> { `${rawData.description}` } </div>
    </div>
  );
}

export default ExerciseDetail;
