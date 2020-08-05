import React from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Heart from 'components/Heart';
import { ExerciseView } from 'utility/types';

interface ShelfProps {
  exercises : ExerciseView[],
};

function changeImageFunc(imageUrl : string | undefined) {
  if (imageUrl) {
    return (event) => {
      event.currentTarget.src = imageUrl;
    };
  }
  else {
    return () => {};
  }
}

function Shelf({exercises} : ShelfProps) {
  return (
    <div className={'shelf'}>
      { exercises.map((exercise) => (
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
              subtitle={exercise.playTime}
              classes={{
                root: 'titleBar',
                title: 'titleText',
              }}
              actionIcon={
                <Heart id={exercise.id} initialStatus={exercise.heart}/>
              }
            />
        </GridListTile>
      )) }
    </div>
  );
}

export default Shelf;
