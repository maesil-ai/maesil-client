import { getExercises, getCourses, searchContent, searchTag } from 'utility/api';

import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import Loading from 'pages/Loading';
import Shelf from 'components/Shelf';
import { ContentData } from 'utility/types';
import store from 'store';
import { Link, match } from 'react-router-dom';
import Tabs, { TabData } from 'components/Tabs';

interface MatchParams {
  query?: string;
  tag?: string;
};

interface ContentListProps {
  match: match<MatchParams>;
}

function ContentList({ match }: ContentListProps) {
    let [title, setTitle] = React.useState<string>("");
    let [content, setContent] = React.useState<ContentData[]>([]);
    let [tabData, setTab] = React.useState<TabData[]>([]);
    let [loading, setLoading] = React.useState<boolean>(true);
  
    if (match.params.query != undefined) {
      let query = match.params.query;
      React.useEffect(() => {
        searchContent(query).then((({ exerciseResult, courseResult }) => {
          let tabsList = [{
            name: `운동 (${exerciseResult.length})`,
            onClick: () => {
              setLoading(true);
              setContent(exerciseResult);
              setTab(tabsList.map((tab, index) => ({...tab, active: index == 0})));
              setTimeout(() => setLoading(false), 0.1);
            },
            active: false,
          }, {
            name: `코스 (${courseResult.length})`,
            onClick: () => {
              setLoading(true);
              setContent(courseResult);
              setTab(tabsList.map((tab, index) => ({...tab, active: index == 1})));
              setTimeout(() => setLoading(false), 0.1);
            },
            active: false,
          }];

          setTitle(`'${query}'에 대한 검색 결과입니다.`);
          tabsList[0].onClick();
          setLoading(false);
        }));
      }, []);
    }
    
    else if (match.params.tag != undefined) {
      let tag = match.params.tag;
      React.useEffect(() => {
        searchTag(tag).then((({ exerciseResult, courseResult }) => {
          let tabsList = [{
            name: `운동 (${exerciseResult.length})`,
            onClick: () => {
              setLoading(true);
              setContent(exerciseResult);
              setTab(tabsList.map((tab, index) => ({...tab, active: index == 0})));
              setTimeout(() => setLoading(false), 0.1);
            },
            active: false,
          }, {
            name: `코스 (${courseResult.length})`,
            onClick: () => {
              setLoading(true);
              setContent(courseResult);
              setTab(tabsList.map((tab, index) => ({...tab, active: index == 1})));
              setTimeout(() => setLoading(false), 0.1);
            },
            active: false,
          }];

          setTitle(`태그 #${tag}를 가진 운동 목록`);
          tabsList[0].onClick();
          setLoading(false);
        }));
      }, []);
    }
    

    if (loading) return <Loading/>;
    else {
      return (
        <>
          <Header />
          <div style={{marginBottom: '-32px'}} />
          { title && <Title title={title} size='small' /> }
          { tabData && <Tabs data={tabData} /> }
          { content && <Shelf contents={content} control={store.getState().user.loggedIn ? "heart" : null} /> }
          <Footer />
        </>
      );
    }
}

export default ContentList;
