import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import { CourseContent } from 'utility/types';
import usePromise from 'utility/usePromise';
import { getExercises, postCourse } from 'utility/api';
import Loading from './Loading';

const typeList = ['운동', '휴식'];
const typeToCode = {
  '운동': 'exercise',
  '휴식': 'break',
}
const codeToType = {
  'exercise': '운동',
  'break': '휴식',
}

const emptyContent: CourseContent = {
  phase: 'exercise',
  id: 11,
  repeat: 1,
  message: "",
};

function UploadCourse() {
  let [contents, setContents] = React.useState<CourseContent[]>([emptyContent]);
  let [title, setTitle] = React.useState<string>('');
  let [description, setDescription] = React.useState<string>('');
  let [message, setMessage] = React.useState<string>('');
  let [thumbnail, setThumbnail] = React.useState<File>();
  let [gifThumbnail, setGifThumbnail] = React.useState<File>();
  let [exercisesLoading, exercises, exercisesError] = usePromise(getExercises);

  const addContent = () => {
    setContents(contents.concat([emptyContent]));
  }

  const removeContent = (index: number) => {
    setContents(contents.filter((_, elementIndex) => index != elementIndex ));
  }

  const onChangeType = (index: number, str: string) => {
    console.log(index, str);
    let newContents = contents.map((content) => ({...content}));
    newContents[index].phase = typeToCode[str];
    setContents(newContents);
  }

  const onChangeId = (index: number, str: string) => {
    console.log(index, str);
    let newContents = contents.map((content) => ({...content}));
    newContents[index].id = Number.parseInt(str);
    setContents(newContents);
  }

  const onChangeRepeat = (index: number, str: string) => {
    console.log(index, str);
    let newContents = contents.map((content) => ({...content}));
    newContents[index].repeat = Number.parseInt(str);
    setContents(newContents);
  }

  const onChangeMessage = (index: number, str: string) => {
    console.log(index, str);
    let newContents = contents.map((content) => ({...content}));
    newContents[index].message = str;
    setContents(newContents);
  }

  const upload = async () => {
    setMessage('올리는 중...');
    let response = await postCourse({
      
      description: description,
      play_time: 0,
      thumbnail: thumbnail,
      reward: 103,
      level: 103103,
      course_name: title,
      gif_thumbnail: gifThumbnail,
      exercise_list: JSON.stringify(contents),
      tag_id: 0,
    })
    if (response) setMessage('업로드 성공!');
    else setMessage('업로드 실패!');
  };

  if (exercisesLoading) return <Loading/>;
  return (
    <>
      <Header/>
      <Title title="운동 코스 올리기" />
      <div className="zone">
        <table>
          <tbody>
            <tr>
              <td> 제목 </td>
              <td className="fill">
                <input
                  className="inputTitle"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> 설명 </td>
              <td className="fill">
                <textarea
                  className="inputDescription"
                  rows={1}
                  value={description}
                  onChange={(e) => setDescription(e.target.value) }
                />
              </td>
            </tr>
            <tr>
              <td> 썸네일 이미지 </td>
              <td className="fill">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
              </td>
            </tr>
            <tr>
              <td> 움직이는 썸네일 이미지 </td>
              <td className="fill">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setGifThumbnail(e.target.files[0])}
                />
              </td>
            </tr>
          </tbody>
        </table>

        운동 코스 구성하기

        <table>
          <thead>
            <tr>
              <th> </th>
              <th> 동작 </th>
              <th> 운동 ID </th>
              <th> 반복 횟수 (시간) </th>
              <th className="fill"> 설명 </th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            { contents.map((content, index) => (
              <tr key={index}>
                <td> { index + 1 } </td>
                <td>
                  <select 
                    value={codeToType[content.phase]}
                    onChange={(event) => onChangeType(index, event.target.value)} 
                  >
                  {(typeList).map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                  </select>
                </td>
                <td> { content.phase != 'break' && <input type='number' value={content.id} onChange={(event) => onChangeId(index, event.target.value)} /> } </td>
                <td> <input type='number' value={content.repeat} onChange={(event) => onChangeRepeat(index, event.target.value)} /> </td>
                <td className="fill"> <input value={content.message} onChange={(event) => onChangeMessage(index, event.target.value)} /> </td>
                <td> <button onClick={() => removeContent(index)}> {" - "} </button> </td>
              </tr>
            )).concat([(
              <tr key={-1}>
                <td/> <td/> <td/> <td/> <td/>
                <td> <button onClick={addContent}> {" + "} </button> </td>
              </tr>
            )]) }
          </tbody>
        </table>
        {message ? message : <button onClick={upload}> 올리기! </button>}
      </div>
      <Footer />
    </>
  );
}

export default UploadCourse;
