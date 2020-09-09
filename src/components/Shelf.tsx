import React, { useEffect } from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Heart from 'components/Heart';
import { ContentData } from 'utility/types';
import DeleteButton from 'components/DeleteButton';
import ContentDetail from 'components/ContentDetail';
import Title from 'components/Title';

interface ShelfProps {
  exercises: ContentData[];
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

function Shelf({ exercises: initialExercises, control = 'heart', title }: ShelfProps) {
  let [exercises, setExercises] = React.useState<ContentData[]>([]);
  let [selected, select] = React.useState<number>(-1);
  const defaultThumbUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg';
  const defaultThumbGifUrl = 'https://thumbs.gfycat.com/AdmiredTangibleBeardedcollie-size_restricted.gif';

  useEffect(() => {
    setExercises(initialExercises);
  }, []);

  return (
    <>
      {title && <Title title={title}/>}
      <div className={'shelf'}>
        {exercises.map((exercise, index) => (
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
              subtitle={exercise.description}
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
        ))}
      </div>
      { selected != -1 && exercises[selected] && <ContentDetail data={exercises[selected]} /> }
    </>
  );
}

export default Shelf;
