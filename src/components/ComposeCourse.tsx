import React from 'react';
import { minusIcon } from 'utility/svg';
import { ContentData, CourseContent } from 'utility/types';
import Shelf from './Shelf';

interface ComposeCourseProps {
    content: CourseContent;
    index: number;
    onRemove: () => void;
    onChangeType: (type: 'exercise' | 'break') => void;
    onChangeRepeat: (repeat: string) => void;
    onChangeId: (id: string) => void;
    onChangeMessage: (message: string) => void;
    exercises: ContentData[];
};

const typeList = ['운동', '휴식'];
const typeToCode = {
  '운동': 'exercise',
  '휴식': 'break',
}
const codeToType = {
  'exercise': '운동',
  'break': '휴식',
}

// <input type='number' value={content.id} onChange={(event) => onChangeId(event.target.value)} /> 

function ComposeCourse({content, index, onRemove, onChangeType, onChangeRepeat, onChangeId, onChangeMessage, exercises} : ComposeCourseProps) {
    let [selecting, setSelecting] = React.useState(false);
    let [contentName, setContentName] = React.useState("");

    return (
        <>
            <div className='zone' style={{height: '0px', display: 'flex', marginBottom: '12px'}}>
                <div onClick={onRemove} style={{margin: '-24px 24px 0px 12px'}}> { minusIcon } </div>
                <div style={{marginTop: '-12px'}}> { index + 1 } </div>
                <div style={{marginTop: '-24px', minWidth: '110px'}}>
                    <select 
                        value={codeToType[content.phase]}
                        onChange={(event) => onChangeType(typeToCode[event.target.value])} 
                    >
                    {(typeList).map((value) => (
                        <option value={value} key={value}> {value} </option>
                    ))}
                    </select>
                </div>
                <div style={{marginTop: '-24px', minWidth: '120px', maxWidth: '240px'}}> 
                    { content.phase != 'break' && ( 
                        contentName 
                        ? <input onClick={() => setSelecting(true)} value={contentName} /> 
                        : <button className='submit mini' onClick={() => setSelecting(true)}> 운동 선택 </button>) }
                </div>
                <div style={{marginTop: '-24px', maxWidth: '100px'}}> 
                    <input type='number' value={content.repeat} onChange={(event) => onChangeRepeat(event.target.value)} /> 
                </div>
                <div style={{marginTop: '-12px', minWidth: '60px'}}>
                    { content.phase == 'exercise' ? '번 반복' : '초' }
                </div>
                <div className='fill' style={{marginTop: '-24px'}}> 
                    <input placeholder='설명' className='underbar' value={content.message} onChange={(event) => onChangeMessage(event.target.value)} /> 
                </div>
            </div>
            { selecting && 
                <div style={{margin: '0px 50px'}}>
                    <Shelf contents={exercises} control={(content) => {
                        onChangeId(Number.prototype.toString(content.id)); 
                        setContentName(content.name);
                        setSelecting(false);
                    }} />
                </div>
            }
        </>
    );
}

export default ComposeCourse;