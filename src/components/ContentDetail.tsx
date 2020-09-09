import React from 'react';
import { ContentData } from 'utility/types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';

interface ContentDetailProps {
  data : ContentData;
};

function ContentDetail({ data }: ContentDetailProps) {
  let user = useSelector((state : RootReducerState) => state.user );

  return (
    <div className='detail'>
        <h1> { `${data.name}` } </h1>
        <div> <Link to={`/user/${data.userName}`}>{data.userName}</Link>{`님이 만듦 | ${data.playTime}초 | 조회수 ${data.viewCount} | 좋아요 ${data.heartCount} | ` } </div>
        <div> { `${data.description}` } </div>
        <Link to={ `/${data.type}/${data.id}` }> <button style={{cursor:'pointer'}}> {data.type == "exercise" ? "운동 시작하기" : "운동 코스 시작하기"} </button> </Link>
        { !user.loggedIn && <div> 지금은 로그인하지 않으면 운동 결과를 볼 수 없습니다. </div> }
    </div>
  );
}

export default ContentDetail;
