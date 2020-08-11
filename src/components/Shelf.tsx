import React, { useEffect } from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Heart from 'components/Heart';
import { ExerciseData } from 'utility/types';
import DeleteButton from 'components/DeleteButton';
import ExerciseDetail from 'components/ExerciseDetail';
import Title from 'components/Title';

interface ShelfProps {
  exercises: ExerciseData[];
  title?: string;
  control?: string;
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
  let [exercises, setExercises] = React.useState<ExerciseData[]>([]);
  let [selected, select] = React.useState<number>(-1);

  useEffect(() => {
    setExercises(initialExercises);
  }, []);

  return (
    <>
      {title && <Title title={title}/>}
      <div className={'shelf'}>
        {exercises.map((exercise, index) => (
          <GridListTile key={exercise.id} className={'gridList'}>
            <img
                src={exercise.thumbUrl}
                alt={exercise.name}
                width={300}
                className="hoverHide MuiGridListTile-imgFullHeight"
                onMouseOver={changeImageFunc(exercise.thumbGifUrl)}
                onMouseOut={changeImageFunc(exercise.thumbUrl)}
                onClick={() => {
                  if (selected != index) select(index);
                  else select(-1);
                }}
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
      { selected != -1 && exercises[selected] && <ExerciseDetail data={exercises[selected]} /> }
    </>
  );
}

export default Shelf;
