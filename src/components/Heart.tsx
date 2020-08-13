import React from 'react';

import FavoriteIcon from '@material-ui/icons/Favorite';
import { toggleLike } from 'utility/api';

interface HeartProps {
  id: number;
  initialStatus: boolean;
  heartCount: number;
}

function Heart({ id, initialStatus, heartCount }: HeartProps) {
  let [status, setStatus] = React.useState(initialStatus);
  let [count, setCount] = React.useState(heartCount);

  let onClick = async () => {
    await toggleLike(id, !status);
    setCount(count + (status ? -1 : 1));
    setStatus(!status);
  };

  return (
    <FavoriteIcon
      color={status ? 'secondary' : 'disabled'}
      fontSize="large"
      onClick={onClick}
    />
  );
}

export default Heart;
