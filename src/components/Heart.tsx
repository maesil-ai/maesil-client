import React from 'react';

import FavoriteIcon from '@material-ui/icons/Favorite';
import { toggleLike } from 'utility/api';

interface HeartProps {
    id : number,
    initialStatus : boolean,
};

function Heart({ id, initialStatus } : HeartProps) {
    let [status, setStatus] = React.useState(initialStatus);

    let onClick = async () => {
        let response = await toggleLike(id, !status);
        if (response) setStatus(!status);
    }

    return (
        <div onClick={onClick}>
            { status ? <FavoriteIcon color="secondary" fontSize="large"/> : <FavoriteIcon color="disabled" fontSize="large"/> }
        </div>
    );
}

export default Heart;