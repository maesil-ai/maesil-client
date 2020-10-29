import { getExercises, getCourses } from 'utility/api';

import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Loading from 'pages/Loading';
import Shelf from 'components/Shelf';
import { ContentData } from 'utility/types';
import store from 'store';
import { Link } from 'react-router-dom';
import suggestContent from 'utility/suggestContent';


function Home() {
  let [shelfs, setShelfs] = React.useState<JSX.Element[]>([]);
  let [loadNext, setLoadNext] = React.useState<number>(0);
  
  let handleScroll = (event? : any) => {
    if (loadNext) return;
    const scrollTop = event ? event.srcElement.scrollingElement.scrollTop : 0;
    let loadNum = Math.floor((window.innerHeight - (document.body.scrollHeight - window.innerHeight - scrollTop)) / 320);
    if (loadNum > 0) setLoadNext(loadNum);
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  React.useEffect(() => {
    console.log(loadNext);
    if (loadNext == 0) return;
    const loadNum = loadNext;
    const shelfSize = shelfs.length;

    new Promise<JSX.Element[]>((resolve) => {
      let newShelfs : JSX.Element[] = new Array(loadNum);
      let okay = 0;
      for (let i=0; i<loadNum; i++) {
        suggestContent(shelfSize+i).then((shelf) => {
          newShelfs[i] = shelf;
          okay++;
          if (okay == loadNum) resolve(newShelfs);
        });
      }
    }).then((newShelfs) => {
      setShelfs(shelfs.concat(newShelfs));
      setLoadNext(0);
    });
  }, [loadNext]);

  return (
      <>
        <Header />
        <div style={{marginBottom: '-32px'}} />
        <div className='banner' >
          <img className='bannerImage' src='https://maesil-storage.s3.ap-northeast-2.amazonaws.com/main.png' />
          <div className='bannerTitle'>
            매일매일 실내 트레이닝
          </div>
          <div className='bannerText'>
            누구나 운동을 만들고 트레이닝할 수 있는 
            <br/>
            새로운 실내 헬스 트레이닝 플랫폼
          </div>
          <Link to='/studio'>
            <div className='neonbox bannerButton' >
              MAESIL STUDIO
            </div>
          </Link>
        </div>
        { shelfs }
        { loadNext > 0 && <Loading mini={true} /> }
        <Footer />
      </>
    );
}

export default Home;
