import { getExercises, getExercise, toggleLike } from 'utility/api';

import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import Loading from 'pages/Loading';

import Shelf from 'components/Shelf';
import usePromise from 'utility/usePromise';
import { RootReducerState } from 'reducers';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { emptyHeartIcon, filledHeartIcon, mainLogo } from 'utility/svg';
import ContentDetail from 'components/ContentDetail';
import store from 'store';
import { setContent } from 'actions';

function Result() {
  let [loading, nextExercises] = usePromise(getExercises);
  let {content, record} = useSelector((state : RootReducerState) => state.content );

  if (!content || !record) return <Redirect to='/' />;
  if (loading) return <Loading />;
  else return (
    <>
      <Header />
      <div className='zone'>
        { mainLogo }
        <div style={{paddingBottom: '32px'}} />
        <h1> 운동을 완료했습니다! </h1>
        <div style={{paddingBottom: '48px'}} />
        <table style={{width: '50%', margin: 'auto'}}>
          <tbody>
            <tr style={{height: '48px'}}>
              <td className='labelColumn'> 운동 시간 </td>
              <td className='contentColumn'> { Math.floor((record.playTime - (record.playTime % 60)) / 60) }분 { Math.floor(record.playTime % 60) }초 </td>
            </tr>
            <tr style={{height: '48px'}}>
              <td className='labelColumn'> 소모 칼로리 </td>
              <td className='contentColumn'> { record.calorie.toFixed(3) } kcal </td>
            </tr>
          </tbody>
        </table>
        <span onClick={() => {
          if (content.type == 'exercise') {
            toggleLike(content.id, !content.heart);
            store.dispatch(setContent({
              ...content,
              heart: !content.heart,
            }));
          }
        }}> 
          { content.heart ? filledHeartIcon : emptyHeartIcon } 
        </span>
        <Link to={`/${content.type}/${content.id}`}><button className='submit' style={{transform: 'translate(12px, -2px)'}}> 한 번 더 하기 </button></Link>
      </div>
      <Shelf title="다음에 할 운동들" contents={nextExercises} />
      <Footer />
    </>
  )
}

export default Result;
