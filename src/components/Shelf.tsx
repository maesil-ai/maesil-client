import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: 'auto',
      justifyContent: 'flex-start',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: 350,
      height: 350,
      flexWrap: 'nowrap',
      display: 'inline-block',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      fontWeight: 700,
    },
    titleBar: {
      background:
        'rgba(100, 100, 100, 0.54)',
    },
  }),
);

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
    const classes = useStyles();

    return (
      <GridList className={classes.root} cellHeight={300} cols={5.5}>
        { exercises.map((exercise) => (
          <GridListTile key={exercise.id} className={classes.gridList}>
              <Link to={'/exercise/' + exercise.id}>
                  <img src={exercise.thumbUrl} alt={exercise.name} width={300} />
              </Link>
              <GridListTileBar
                title={exercise.name}
                subtitle={exercise.playTime}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
          </GridListTile>
        )) }
      </GridList>
    );
}

export default Shelf;
