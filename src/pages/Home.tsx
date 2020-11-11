import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Loading from 'pages/Loading';
import { Link, match } from 'react-router-dom';
import suggestContent from 'utility/suggestContent';
import Tour, { ReactourStep } from 'reactour';
import Logo from 'components/Logo';
import { getPoseData } from 'utility/api';


const tourSteps : ReactourStep[] = [
  {
    selector: '.logo',
    content: '안녕하세요~ 누구나 운동을 만들고 트레이닝할 수 있는 새로운 실내 헬스 트레이닝 플랫폼 매실입니다.',
  },
  {
    selector: '.shelfItem',
    content: '아래 모든 컨텐츠들이 누구나 따라할 수 있도록 만들어진 운동 컨텐츠입니다.',
  },
  {
    selector: '.shelfItem',
    content: '이제, 기기를 잘 세워둔 다음, 한 발짝 물러서 서서, 운동을 시작해 봅시다!',
  },
];

interface MatchParams {
  remark?: string;
};

interface HomeProps {
  match: match<MatchParams>;
}

function Home({ match } : HomeProps) {
  let [shelfs, setShelfs] = React.useState<JSX.Element[]>([]);
  let [loadNext, setLoadNext] = React.useState<number>(0);
  let [loadDone, setLoadDone] = React.useState<boolean>(false);
  let isTutorial = React.useMemo(() => match.params.remark == 'tutorial', [match]);
  let [isTourOpen, setIsTourOpen] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    setIsTourOpen(isTutorial);
  }, [isTutorial]);

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
    if (loadDone) {
      setLoadNext(0);
      return;
    }
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
      newShelfs = newShelfs.filter((element) => element !== null);
      if (newShelfs.length != loadNum) {
        setLoadDone(true);
      }
      setShelfs(shelfs.concat(newShelfs));
      setLoadNext(0);
    });
  }, [loadNext]);

  return (
      <>
        <Header />
        <div style={{marginBottom: '-26px'}} />
        <Logo imageUrl='https://maesil-storage.s3.ap-northeast-2.amazonaws.com/main.png'
              title={(
                <>
                  <span className='nobr'>매일매일</span> <span className='nobr'>실내</span> <span className='nobr'>트레이닝</span>
                </>
              )}
              text={(
                <>
                  <span className='nobr'>누구나 운동을 만들고</span> <span className='nobr'>트레이닝할 수 있는</span>
                  <br/>
                  <span className='nobr'>새로운 실내운동 플랫폼</span>
                </>
              )}
              button={(
                <div className='neonbox bannerButton' >
                  처음 오셨나요?
                </div>  
              )}
            />
        { shelfs }
        { !loadDone && loadNext > 0 && <Loading mini={true} /> }
        <Footer />
        <Tour
          isOpen={isTourOpen}
          steps={tourSteps}
          onRequestClose={() => setIsTourOpen(false) }
        />
      </>
    );
}

export default Home;
