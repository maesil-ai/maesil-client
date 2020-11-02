import React from 'react';
import usePromise from 'utility/usePromise';
import { getSubscribed, toggleSubscribe } from 'utility/api';
import store from 'store';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';

interface UserIntroduceProps {
    name: string,
    id: number,
};

export function UserIntroduce({ name, id } : UserIntroduceProps) {
    let [loading, initialSubscribed] = usePromise(() => getSubscribed(id));
    let [subscribed, setSubscribed] = React.useState<boolean>();
    let myName = useSelector((state: RootReducerState) => state.user.userInfo ? state.user.userInfo.nickname : null );

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
                { name != myName && (
                    <button onClick={onSubscribe} className={subscribed ? 'inactive' : 'active'}>
                        { subscribed ? "구독중" : "구독" }
                    </button>
                )}  
                { name == myName && (
                    <Link to='/studio'> 
                        <button className='active'> 
                            운동 올리기 
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default UserIntroduce;