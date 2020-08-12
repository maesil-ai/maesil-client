import React from 'react';
import usePromise from 'utility/usePromise';
import { getSubscribed, toggleSubscribe } from 'utility/api';

interface UserIntroduceProps {
    name: string,
    id: number,
};

export function UserIntroduce({ name, id } : UserIntroduceProps) {
    let [loading, initialSubscribed, subscribedError] = usePromise(() => getSubscribed(id));
    let [subscribed, setSubscribed] = React.useState<boolean>();

    React.useEffect(() => {
        setSubscribed(initialSubscribed);
    }, [initialSubscribed]);

    const onSubscribe = async () => {
        await toggleSubscribe(id, name, !subscribed);
        setSubscribed(!subscribed);
    }

    if (loading) return <></>;
    return (
        <div className='userIntroduce'>
            <div className='backgroundImage'/>
            <div className='information'>
                <div className='userName'> {name} </div>
                <button onClick={onSubscribe}>{ subscribed ? "구독중" : "구독" }</button>
            </div>
        </div>
    );
}

export default UserIntroduce;