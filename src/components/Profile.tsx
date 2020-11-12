import React from 'react';
import { ContentData } from 'utility/types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import { smallViewIcon, smallHeartIcon } from 'utility/svg';
import { getSubscribed, toggleSubscribe } from 'utility/api';
import usePromise from 'utility/usePromise';

interface ProfileProps {
  id: number;
  name: string;
  profileImageUrl: string;
};

function Profile({ id, name, profileImageUrl }: ProfileProps) {
  let [loading, initialSubscribed] = usePromise(() => getSubscribed(id));
  let [subscribed, setSubscribed] = React.useState<boolean>();
  let user = useSelector((state : RootReducerState) => state.user );
  let myName = useSelector((state: RootReducerState) => state.user.userInfo ? state.user.userInfo.nickname : null );

  React.useEffect(() => {
    setSubscribed(initialSubscribed);
  }, [initialSubscribed]);

  const onSubscribe = async () => {
      await toggleSubscribe(id, name, !subscribed);
      setSubscribed(!subscribed);
  }

  return (
      <div className='profile' >
        <Link to={`/user/${name}`}> 
          <div className='profileBox small'>
            <img className='profileImage' src={profileImageUrl}/>
          </div>
        </Link>
        <div className='profileName'>
            <span style={{marginRight: '7px'}}> 
                <Link to={`/user/${name}`}> 
                    { name } 
                </Link>
            </span>
            <span>
              { name != myName && (
                  <button onClick={onSubscribe} className={subscribed ? 'backgroundGradient' : ''} style={{margin: '-10px 10px'}}>
                      { subscribed ? "구독중" : "구독" }
                  </button>
              )}
            </span>
        </div>
      </div>
  );
}

export default Profile;
