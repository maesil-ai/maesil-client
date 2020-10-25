import { ContentData, RecordData, TagData } from "./types";

export interface RawAPIExerciseData {
    exercise_id: number;
    title: string;
    description: string;
    play_time: string;
    user_id: number;
    nickname: string;
    thumb_url: string;
    thumb_gif_url: string;
    video_url: string;
    skeleton: string;
    reward: number;
    like_counts: number;
    view_counts: number;
    status: string;
    created_at: string;
    updated_at: string;
    isLike?: boolean;
    tag_list: string | null;
}

export const processRawExerciseData = (rawData : RawAPIExerciseData) => {
    return {
        type: "exercise",
        id: rawData.exercise_id,
        name: rawData.title,
        description: rawData.description,
        playTime: rawData.play_time,
        userId: rawData.user_id,
        userName: rawData.nickname,
        thumbUrl: rawData.thumb_url,
        thumbGifUrl: rawData.thumb_gif_url,
        videoUrl: rawData.video_url,
        innerData: rawData.skeleton,
        reward: rawData.reward,
        heartCount: rawData.like_counts,
        viewCount: rawData.view_counts,
        status: rawData.status,
        createdAt: rawData.created_at,
        updatedAt: rawData.updated_at,
        heart: rawData.isLike,
        tagList: rawData.tag_list ? rawData.tag_list.split(',') : [],
    } as ContentData;
}
  

  
export interface RawAPICourseData {
    course_id: number;
    course_name: string;
    description: string;
    play_time: string;
    user_id: number;
    thumb_url: string;
    thumb_gif_url: string;
    video_url: string;
    exercise_list: string;
    reward: number;
    like_counts: number;
    view_counts: number;
    status: string;
    created_at: string;
    updated_at: string;
    isLike?: boolean;
    tag_list: string | null;
}

export const processRawCourseData = (rawData : RawAPICourseData) => {
    return {
        type: "course",
        id: rawData.course_id,
        name: rawData.course_name,
        description: rawData.description,
        playTime: rawData.play_time,
        userId: rawData.user_id,
        userName: rawData["user.nickname"],
        thumbUrl: rawData.thumb_url,
        thumbGifUrl: rawData.thumb_gif_url,
        videoUrl: rawData.video_url,
        innerData: rawData.exercise_list,
        reward: rawData.reward,
        heartCount: rawData.like_counts,
        viewCount: rawData.view_counts,
        status: rawData.status,
        createdAt: rawData.created_at,
        updatedAt: rawData.updated_at,
        heart: rawData.isLike,
        tagList: rawData.tag_list ? rawData.tag_list.split(',') : [],
    } as ContentData;
  }
  

export interface RawAPIRecordData {
    id: number;
    user_id: number;
    exercise_id: number;
    score: number;
    play_time: string;
    similarity_value: number;
    started_at: string;
    kcal: number;
    finished_at: string;
    created_at: string;
}

  
export const processRawRecordData = (rawData : RawAPIRecordData) => {
    return {
        id: rawData.id,
        userName: "",
        userId: rawData.user_id,
        exerciseName: "",
        exerciseId: rawData.exercise_id,
        score: rawData.score,
        playTime: 0,
        calorie: rawData.kcal,
        startedAt: rawData.started_at,
    } as RecordData;
}

export interface RawAPITagData {
    tag_id: number;
    tag_name: string;
    tag_english_name: string;
};

export const processRawTagData = (rawData : RawAPITagData) => {
    return {
      id: rawData.tag_id,
      name: rawData.tag_name,
      englishName: rawData.tag_english_name,
    } as TagData;
}