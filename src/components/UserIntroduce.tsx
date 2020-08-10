import React from 'react';
import Title from 'components/Title';

interface UserIntroduceProps {
    name: string,
};

export function UserIntroduce({ name } : UserIntroduceProps) {
    return (
        <div className='userIntroduce'>
            <div className='backgroundImage'/>
            <div className='information'>
                <div className='userName'> {name} </div>
                <button>구독</button>
            </div>
        </div>
    );
}

export default UserIntroduce;