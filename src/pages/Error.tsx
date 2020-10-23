import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import { warningIcon } from 'utility/svg';


function Error() {
    let system = useSelector((state: RootReducerState) => state.system);
    return (
        <>
            <Header real={false}/>
            <div className='zone'>
                { warningIcon }
                <div style={{paddingBottom: '16px'}} />
                <h1 className='grey'> 이런! </h1>
                <div style={{paddingBottom: '16px'}} />
                <div className='grey'> 어디선가 문제가 생겼습니다... 이 페이지를 보게 되는 일이 있으면 안 되는데, 죄송합니다. </div>
                <div style={{paddingBottom: '16px'}} />
                <div> { system.message } </div>
            </div>
            <Footer/>
        </>
  );
}

export default Error;
