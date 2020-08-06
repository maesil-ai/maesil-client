import React, { useEffect } from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Heart from 'components/Heart';
import { ExerciseView } from 'utility/types';
import DeleteButton from './DeleteButton';

interface ShelfProps {
  exercises: ExerciseView[];
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

function Shelf({ exercises, control = 'heart' }: ShelfProps) {
  let [currentExercises, setExercises] = React.useState<ExerciseView[]>([]);

  useEffect(() => {
    setExercises(exercises);
  }, []);

  return (
    <div className={'shelf'}>
      {currentExercises.map((exercise) => (
        <GridListTile key={exercise.id} className={'gridList'}>
          <Link to={'/exercise/' + exercise.id}>
            <img
              src={exercise.thumbUrl}
              alt={exercise.name}
              width={300}
              className="hoverHide"
              onMouseOver={changeImageFunc(exercise.thumbGifUrl)}
              onMouseOut={changeImageFunc(exercise.thumbUrl)}
            />
          </Link>
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
                      currentExercises.filter((element) => element != exercise)
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
  );
}

export default Shelf;
