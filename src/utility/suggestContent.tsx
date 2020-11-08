import Logo from 'components/Logo';
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
    
    const maxRow = tags.length + 1;

    if (rowNumber >= maxRow) return null;

    const makeShelf = (title: string, contents: ContentData[]) => (
        <Shelf key={rowNumber} title={title} contents={contents} />
    );

    if (rowNumber == tags.length) {
        return (
            <Logo 
                background='rgb(222, 222, 222)'
                title='배~고~팡~'
                text={(
                <>
                    여기 뭐 넣지?
                </>
                )}
                button={(
                    <div className='neonbox bannerButton' >
                        처음 오셨나요?
                    </div>  
                )}
          />

        )
    }

    if (rowNumber < tags.length) {
        const tag = tags[rowNumber];
        const result = await searchTag(tag.name);
        return makeShelf(`#${tag.name}`, result.exerciseResult.concat(result.courseResult));
    }
}