import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';


function Error() {
    let system = useSelector((state: RootReducerState) => state.system);
    return (
        <>
            <Header real={false}/>
            <Title title='아니, 이게 무슨 일이죠?' />
            <div className='zone'>
                <div> 저희가 제대로 만들어졌다면 이런 페이지가 뜨면 안 되는데... </div>
                <div> 아래와 같은 에러가 발생했습니다. 죄송합니다. </div>
                <div/> 
                <div> { system.message } </div>
            </div>
            <Footer/>
        </>
  );
}

export default Error;
