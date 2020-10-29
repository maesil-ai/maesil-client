import Shelf from 'components/Shelf';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import store from 'store';
import { getCourses, getExercises, getLikes, searchTag } from './api';
import { ContentData } from './types';


export default async function suggestContent(rowNumber: number) {    
    let user = store.getState().user;
    let tags = store.getState().system.tags;
    
    let dice = Math.floor(Math.random() * 1000000);
    
    const makeShelf = (title: string, contents: ContentData[]) => (
        <Shelf key={rowNumber} title={title} contents={contents} />
    );

    if (user.loggedIn && dice % 9 == 0) return makeShelf(`${user.userInfo.nickname}님이 좋아하는 운동들`, await getLikes());
    if (dice % 2 == 0) {
        let tag = tags[Math.floor(Math.random() * tags.length)];
        let result = await searchTag(tag.name);
        return makeShelf(`#${tag.name}`, result.exerciseResult.concat(result.courseResult));
    }
    if (rowNumber % 2 == 0) return makeShelf("모든 운동들", await getExercises());
    else return makeShelf("모든 운동 코스들", await getCourses());
}