import React from 'react';
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
            <tr key={index}>
                <td> { index + 1 } </td>
                <td>
                <select 
                    value={codeToType[content.phase]}
                    onChange={(event) => onChangeType(typeToCode[event.target.value])} 
                >
                {(typeList).map((value) => (
                    <option value={value} key={value}> {value} </option>
                ))}
                </select>
                </td>
                <td> { content.phase != 'break' && <input onClick={() => setSelecting(true)} value={contentName} /> }
                </td>
                <td> <input type='number' value={content.repeat} onChange={(event) => onChangeRepeat(event.target.value)} /> </td>
                <td className="fill"> <input value={content.message} onChange={(event) => onChangeMessage(event.target.value)} /> </td>
                <td> <button onClick={onRemove}> {" - "} </button> </td>
            </tr>
            { selecting && 
                <tr>
                    <td colSpan={6}>
                        <Shelf contents={exercises} control={(content) => {
                            onChangeId(Number.prototype.toString(content.id)); 
                            setContentName(content.name);
                            setSelecting(false);
                        }} />
                    </td>
                </tr>
            }
        </>
    );
}

export default ComposeCourse;