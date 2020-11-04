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

  console.log(data);
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

      <div className='profile' >
        <Link to={`user/${data.userName}`}> 
          <div className='profileBox small'>
            <img className='profileImage' src={data.profileImageUrl}/>
          </div>
        </Link>
        <div className='profileName'>
          <span style={{marginRight: '7px'}}> 
            <Link to={`/user/${data.userName}`}> 
              { data.userName } 
            </Link>
          </span>
        </div>
      </div>

      <div className='line' style={{marginTop: '16px', marginBottom: '8px'}} />

    </div>
  );
}

export default ContentDetail;
