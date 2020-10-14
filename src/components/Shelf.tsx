import React, { useEffect } from 'react';
import Heart from 'components/Heart';
import { ContentData } from 'utility/types';
import DeleteButton from 'components/DeleteButton';
import ContentDetail from 'components/ContentDetail';
import Title from 'components/Title';
import { leftArrow, rightArrow, smallHeartIcon, smallViewIcon } from 'utility/svg';
import { Link } from 'react-router-dom';

interface ShelfProps {
  contents: ContentData[];
  title?: string;
  control?: 'heart' | 'remove' | ((data: ContentData) => void);
}

function changeImageFunc(imageUrl: string | undefined) {
  if (imageUrl) {
    return (event) => {
      event.currentTarget.src = imageUrl;
    };
  } else {
    return () => {};
  }
}

function Shelf({ contents: initialContents, control = null, title }: ShelfProps) {
  let [contents, setContents] = React.useState<ContentData[]>([]);
  let [selected, select] = React.useState<number>(-1);
  let [position, setPosition] = React.useState<number>(0);
  let [currentPosition, setCurrentPosition] = React.useState<number>(0);
  const defaultThumbUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg';
  const defaultThumbGifUrl = 'https://thumbs.gfycat.com/AdmiredTangibleBeardedcollie-size_restricted.gif';

  useEffect(() => {
    setContents(initialContents);
  }, []);

  useEffect(() => {
    let halt = false;
    setTimeout(() => {
      if (halt) return;
      let maxX = contents.length * 320 - screen.width + 60;
      let nextPosition = (9 * currentPosition + position) / 10;
      if (Math.abs(currentPosition - position) < 1) setCurrentPosition(position);
      if (maxX > 0 && nextPosition > maxX) {
        setPosition(maxX + (position - maxX) * 0.8);
        setCurrentPosition(maxX + (nextPosition - maxX) * 0.7);
      }
      else if (nextPosition < 0) {
        setPosition(position * 0.8);
        setCurrentPosition(nextPosition * 0.7);
      }
      else setCurrentPosition(nextPosition);
    }, 30);
    return () => halt = true;
  }, [currentPosition, position]);

  const moveLeft = () => {
    setPosition(position - Math.floor(screen.width / 320) * 320);
  }

  const moveRight = () => {
    setPosition(position + Math.floor(screen.width / 320) * 320);
  }

  return (
    <>
      {title && <Title size='small' title={title}/>}
      <div className='shelf'>
      { contents.map((content, index) => (
        <div className='shelfItem' key={index} style={{transform: `translateX(${-currentPosition}px)`}}>
          <Link to={`/${content.type}/${content.id}`}>
            <img 
              src={content.thumbUrl ? content.thumbUrl : defaultThumbUrl}
              onMouseOver={changeImageFunc(content.thumbGifUrl ? content.thumbGifUrl : defaultThumbGifUrl)}
              onMouseOut={changeImageFunc(content.thumbUrl ? content.thumbUrl : defaultThumbUrl)}
              style={{width: '100%', height: '72.5%', cursor: 'pointer'}}
            />
          </Link>
          <div style={{width: '100%', height: '17.5%'}}>
            <div className='title'> {content.name} </div>
            <div className='creator'> {content.userName} </div>
          </div>
          
          <div className='info' style={{width: '100%', height: '10%'}}>
            <div style={{marginLeft: '0px'}}>
              <span style={{marginLeft: '4px'}}> { smallViewIcon } </span>
              <span> { content.viewCount } </span>
              <span style={{marginLeft: '20px'}}> { smallHeartIcon } </span>
              <span> { content.heartCount } </span>
            </div>
          </div>
        </div>
      ))}
      { position > 0 && <div className='arrow leftArrow' onClick={moveLeft}> { leftArrow } </div> }
      { position < contents.length * 320 - screen.width + 60 && <div className='arrow rightArrow' onClick={moveRight}> { rightArrow } </div> }
      </div>
      { selected != -1 && contents[selected] && <ContentDetail data={contents[selected]} /> }
    </>
  );
}

/*


          <GridListTile key={exercise.id} className={'gridList'} style={{margin: '5px'}}>
            <img
                src={exercise.thumbUrl ? exercise.thumbUrl : defaultThumbUrl}
                alt={exercise.name}
                width={300}
                className="hoverHide MuiGridListTile-imgFullHeight"
                onMouseOver={changeImageFunc(exercise.thumbGifUrl ? exercise.thumbGifUrl : defaultThumbGifUrl)}
                onMouseOut={changeImageFunc(exercise.thumbUrl ? exercise.thumbUrl : defaultThumbUrl)}
                onClick={() => {
                  if (typeof control == 'function') {
                    control(exercise);
                  } else {
                    if (selected != index) select(index);
                    else select(-1);
                  }
                }}
                style={{cursor:'pointer'}}
            />
            <GridListTileBar
              title={exercise.name}
              classes={{
                root: 'titleBar',
                title: 'titleText',
              }}
              actionIcon={
                control == 'heart' ? (
                  <Heart
                    id={exercise.id}
                    initialStatus={exercise.heart}
                    heartCount={exercise.heartCount}
                  />
                ) : control == 'remove' ? (
                  <DeleteButton
                    id={exercise.id}
                    onClick={() => {
                      setExercises(
                        exercises.filter((element) => element != exercise)
                      );
                    }}
                  />
                ) : (
                  <></>
                )
              }
            />
          </GridListTile>

*/

export default Shelf;
