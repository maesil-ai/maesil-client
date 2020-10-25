import Shelf from 'components/Shelf';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import store from 'store';
import { getCourses, getExercises, getLikes } from './api';
import { ContentData } from './types';


export default async function suggestContent(rowNumber: number) {    
    let user = store.getState().user;
    
    const makeShelf = (title: string, contents: ContentData[]) => (
        <Shelf key={rowNumber} title={title} contents={contents} />
    );

    if (user.loggedIn && rowNumber % 5 == 3) return makeShelf(`${user.userInfo.nickname}님이 좋아하는 운동들`, await getLikes());
    if (rowNumber % 2 == 0) return makeShelf("모든 운동들", await getExercises());
    else return makeShelf("모든 운동 코스들", await getCourses());
}