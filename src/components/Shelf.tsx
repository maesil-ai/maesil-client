import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'rgba(255, 255, 255, 0.54)',
    },
  }),
);

export interface Exercise {
    id : number,
    name : string,
    thumbUrl : string,
};

interface ShelfProps {
  exercises : Exercise[],
};

function Shelf({exercises} : ShelfProps) {
    const classes = useStyles();

    const exercisesCode = exercises.map((exercise) => (
        <GridListTile key={exercise.id} className={classes.gridList}>
            <Link to={'/exercise/' + exercise.id}>
                <img src={exercise.thumbUrl} alt={exercise.name} width={400} />
            </Link>
            <GridListTileBar
              title={exercise.name}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
            />
        </GridListTile>
    ));
    
    
    return (
        <GridList className={classes.root} cellHeight={300}>
            { exercisesCode }
        </GridList>
    );
}

export default Shelf;
