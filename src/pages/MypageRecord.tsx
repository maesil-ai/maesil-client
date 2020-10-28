import Footer from 'components/Footer';
import Header from 'components/Header';
import Tabs from 'components/Tabs';
import React from 'react';
import { getRecords, getUserInfo } from 'utility/api';
import { APIGetUserInfoData, RecordData } from 'utility/types';
import usePromise from 'utility/usePromise';
import Loading from './Loading';


function MypageRecord() {
    let [userInfoLoading, userInfo] = usePromise<APIGetUserInfoData>(getUserInfo);
    let [recordsLoading, records] = usePromise<RecordData[]>(getRecords);

    if (!recordsLoading) console.log(records);
    if (recordsLoading || userInfoLoading) return <Loading />;
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
            { records.map((record, index) => (
                <div key={index} className='zone' style={{marginBottom: '10px'}}>
                    { record.contentName }: { record.playTime }초 플레이, { record.calorie }칼로리 소모, { record.score }점
                </div>
            )) }
            <Footer />
        </>
    )
}


export default MypageRecord;