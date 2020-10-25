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
  let [loadNext, setLoadNext] = React.useState<number>(10);
  

  let handleScroll = (event : any) => {
    const scrollTop = event.srcElement.scrollingElement.scrollTop;
    if ((document.body.scrollHeight - window.innerHeight) - scrollTop < window.innerHeight)
      setLoadNext(1);
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
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
      let newShelfs : JSX.Element[] = [];
      for (let i=0; i<loadNum; i++) {
        suggestContent(shelfSize+i).then((shelf) => {
          newShelfs = newShelfs.concat(shelf);
          if (newShelfs.length == loadNum) resolve(newShelfs);
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
        <div style={{height: '360px', background: '#1E1A14'}} >
          <img style={{position: 'absolute', left: '166px'}} src='https://maesil-storage.s3.ap-northeast-2.amazonaws.com/main.png' />
          <div style={{position: 'absolute', left: '55%', top: '64px', color: 'white', fontWeight: 'bold', fontSize: '36px'}}>
            매일매일 실내 트레이닝
          </div>
          <div style={{position: 'absolute', left: '55%', top: '132px', color: 'white', fontWeight: 'normal', fontSize: '18px', opacity: '0.6', lineHeight: '27px'}}>
            누구나 운동을 만들고 트레이닝할 수 있는 
            <br/>
            새로운 실내 헬스 트레이닝 플랫폼
          </div>
          <Link to='/studio'>
            <div style={{position: 'absolute', left: '55%', top: '240px'}} className='neonbox' >
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
