import React from 'react';


import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { deleteExercise } from 'utility/api';

interface DeleteButtonProps {
    id : number,
    onClick : () => void,
};

function DeleteButton({ id, onClick } : DeleteButtonProps) {
    
    let onRealClick = async () => {
        onClick();
        let response = await deleteExercise(id);
    }

    return (
        <DeleteForeverIcon color="primary" fontSize="large" onClick={onRealClick}/> 
    );
}

export default DeleteButton;