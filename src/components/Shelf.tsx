import React from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';


export interface Exercise {
    id : number,
    name : string,
    thumbUrl : string,
    playTime : string,
};

interface ShelfProps {
  exercises : Exercise[],
};

function Shelf({exercises} : ShelfProps) {
  return (
    <div className={'shelf'}>
      { exercises.map((exercise) => (
        <GridListTile key={exercise.id} className={'gridList'}>
            <Link to={'/exercise/' + exercise.id}>
                <img src={exercise.thumbUrl} alt={exercise.name} className={'pretty'} width={300} />
            </Link>
            <GridListTileBar
              title={exercise.name}
              subtitle={exercise.playTime}
              classes={{
                root: 'titleBar',
                title: 'titleText',
              }}
            />
        </GridListTile>
      )) }
    </div>
  );
}

export default Shelf;
