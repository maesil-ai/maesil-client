import React from 'react';
import { GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';


export interface Exercise {
    id : number,
    name : string,
    thumbUrl : string,
    thumbGifUrl? : string,
    playTime : string,
};

interface ShelfProps {
  exercises : Exercise[],
};

function changeImage(imageUrl : string | undefined) {
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
                  onMouseOver={changeImage(exercise.thumbGifUrl)} 
                  onMouseOut={changeImage(exercise.thumbUrl)}
                />
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
