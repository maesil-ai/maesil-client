import React from 'react';
import { ContentData } from 'utility/types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import { smallViewIcon, smallHeartIcon } from 'utility/svg';

interface ContentDetailProps {
  data : ContentData;
};

function ContentDetail({ data }: ContentDetailProps) {
  let user = useSelector((state : RootReducerState) => state.user );

  return (
    <div className='contentInfo'>
      <h1> { `${data.name}` } </h1>
      <div style={{marginBottom: '16px'}} />
      <div style={{marginLeft: '0px'}}>
        <span style={{marginLeft: '20px'}}> { smallViewIcon } </span>
        <span> { data.viewCount } </span>
        <span style={{marginLeft: '20px'}}> { smallHeartIcon } </span>
        <span> { data.heartCount } </span>
      </div>
    </div>
  );
}

export default ContentDetail;
