import React from 'react';
import { ContentData } from 'utility/types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import { smallViewIcon, smallHeartIcon } from 'utility/svg';
import Profile from './Profile';

interface ContentDetailProps {
  data : ContentData;
};

function ContentDetail({ data }: ContentDetailProps) {

  return (
    <div className='contentInfo'>
      <h1> { `${data.name}` } </h1>
      <div style={{marginBottom: '16px'}} />
      <div style={{marginLeft: '-15px'}}>
        <span style={{marginLeft: '20px'}}> { smallViewIcon } </span>
        <span> { data.viewCount } </span>
        <span style={{marginLeft: '20px'}}> { smallHeartIcon } </span>
        <span> { data.heartCount } </span>
      </div>

      <div className='line' style={{marginTop: '24px', marginBottom: '8px'}} />

      <Profile id={data.userId} name={data.userName} profileImageUrl={data.profileImageUrl} />

      <div className='line' style={{marginTop: '16px', marginBottom: '8px'}} />

    </div>
  );
}

export default ContentDetail;
