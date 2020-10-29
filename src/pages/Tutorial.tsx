import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import { warningIcon } from 'utility/svg';


function Tutorial() {
    return (
        <>
            <Header/>
            <div className='zone'>
                ㅋㅋ; 그냥 하셈 ㅋ ㅍㅇㅌ
            </div>
            <Footer/>
        </>
  );
}

export default Tutorial;
