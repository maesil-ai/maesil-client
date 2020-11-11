import React, { useEffect } from 'react';
import Heart from 'components/Heart';
import { ContentData } from 'utility/types';
import DeleteButton from 'components/DeleteButton';
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
  const maxX = contents.length * 320 - screen.width + 60;
  const defaultThumbUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg';
  const defaultThumbGifUrl = 'https://thumbs.gfycat.com/AdmiredTangibleBeardedcollie-size_restricted.gif';

  useEffect(() => {
    setContents(initialContents);
  }, []);

  useEffect(() => {
    let halt = false;
    setTimeout(() => {
      if (halt) return;
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
      { contents.length == 0 && <div style={{paddingBottom: '320px'}} /> }
      <div className='shelf'>
      { contents.map((content, index) => (
        <div className='shelfItem' key={index} style={{transform: `translateX(${-currentPosition}px)`}}>
          { typeof control != 'function'
          ? <Link to={`/${content.type}/${content.id}`}>
              <img 
                src={content.thumbUrl ? content.thumbUrl : defaultThumbUrl}
                onMouseOver={changeImageFunc(content.thumbGifUrl ? content.thumbGifUrl : defaultThumbGifUrl)}
                onMouseOut={changeImageFunc(content.thumbUrl ? content.thumbUrl : defaultThumbUrl)}
                style={{width: '100%', height: '65%', cursor: 'pointer'}}
              />
            </Link>
          :   <img 
                src={content.thumbUrl ? content.thumbUrl : defaultThumbUrl}
                onMouseOver={changeImageFunc(content.thumbGifUrl ? content.thumbGifUrl : defaultThumbGifUrl)}
                onMouseOut={changeImageFunc(content.thumbUrl ? content.thumbUrl : defaultThumbUrl)}
                style={{width: '100%', height: '65%', cursor: 'pointer'}}
                onClick={ () => control(content) }
              />
          }

          <div style={{width: '100%', height: '25%'}}>
            <div className='profileBox small'>
              <img className='profileImage' src={content.profileImageUrl}/>
            </div>
            <div className='shelfTitle'> {content.name.length > 17 ? content.name.substr(0, 17) + '...' : content.name } </div>
            <div className='creator'>
              { content.userName && <span style={{marginRight: '7px'}}> <Link to={`/user/${content.userName}`}> { content.userName } </Link> </span> }
              { content.tagList.map((tag) => (
                <span style={{marginRight: '7px'}}> <Link to={`/tag/${tag}`}> #{ tag + ' ' } </Link> </span>
              ))}
            </div>
          </div>
          
          <div className='line' style={{marginBottom: '4px'}} />

          <div className='info' style={{width: '100%', height: '10%'}}>
            <div style={{marginLeft: '0px'}}>
              { content.customData 
              ? <span>
                  { content.customData }
                </span>
              : <>
                  <span style={{marginLeft: '4px'}}> { smallViewIcon } </span>
                  <span> { content.viewCount } </span>
                  <span style={{marginLeft: '20px'}}> { smallHeartIcon } </span>
                  <span> { content.heartCount } </span>
                </>
              }
            </div>
          </div>
        </div>
      ))}
      { position > 0 && <div className='arrow leftArrow' onClick={moveLeft}> { leftArrow } </div> }
      { position < maxX && <div className='arrow rightArrow' onClick={moveRight}> { rightArrow } </div> }
      { maxX > 0 && (
        <div className='progress'>
          <div className='bar' style={{left: `${currentPosition / maxX * 140}px`}} />
        </div>
      )}
      </div>
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
