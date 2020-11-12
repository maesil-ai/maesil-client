import Footer from 'components/Footer';
import Header from 'components/Header';
import Shelf from 'components/Shelf';
import Tabs from 'components/Tabs';
import React from 'react';
import { getExercises, getRecords, getUserInfo } from 'utility/api';
import { defaultProfileImageUrl } from 'utility/apiTypes';
import { APIGetUserInfoData, ContentData, RecordData } from 'utility/types';
import usePromise from 'utility/usePromise';
import Loading from './Loading';


function MypageRecord() {
    let [userInfoLoading, userInfo] = usePromise<APIGetUserInfoData>(getUserInfo);
    let [recordsLoading, records] = usePromise<RecordData[]>(getRecords);
    let [allExercisesLoading, allExercises] = usePromise<ContentData[]>(getExercises);

    if (recordsLoading || userInfoLoading || allExercisesLoading) return <Loading />;
    return (
        <>
            <Header />
            <Tabs data={[{
                name: "정보",
                link: "/mypage/info",
                active: false,
            }, {
                name: "운동 기록",
                link: "/mypage/record",
                active: true,
            }, {
                name: "내 채널",
                link: `/user/${userInfo.nickname}`,
                active: false,
            }]} />
            <Shelf contents={
                records.map((record) => ({
                    ...allExercises.find((exercise) => exercise.id == record.contentId),
                    customData: `${record.playTime} 플레이 | ${record.calorie}kcal 소모`,
                }))} 
                control={() => {}}
            />
            <Footer />
        </>
    )
}


export default MypageRecord;