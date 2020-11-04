import { ContentData, DailyRecordData, RecordData, TagData } from "./types";

export const defaultProfileImageUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/apple.png';

export const processRawExerciseData = (rawData : any) => {
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
        profileImageUrl: rawData.profile_image || defaultProfileImageUrl,
        videoUrl: rawData.video_url,
        innerData: rawData.skeleton,
        reward: rawData.reward,
        heartCount: rawData.like_counts,
        viewCount: rawData.view_counts,
        status: rawData.status,
        createdAt: rawData.created_at,
        updatedAt: rawData.updated_at,
        heart: rawData.isLike,
        tagList: (rawData.tag_list && rawData.tag_list.split(',')) || (rawData.tags && rawData.tags.split(',')) || (rawData.tag_name && rawData.tag_name.split(',')) || [],
    } as ContentData;
}

export const processRawCourseData = (rawData : any) => {
    return {
        type: "course",
        id: rawData.course_id,
        name: rawData.course_name,
        description: rawData.description,
        playTime: rawData.play_time,
        userId: rawData.user_id,
        userName: rawData.nickname,
        thumbUrl: rawData.thumb_url,
        thumbGifUrl: rawData.thumb_gif_url,
        profileImageUrl: rawData.profile_image || defaultProfileImageUrl,
        videoUrl: rawData.video_url,
        innerData: rawData.exercise_list,
        reward: rawData.reward,
        heartCount: rawData.like_counts,
        viewCount: rawData.view_counts,
        status: rawData.status,
        createdAt: rawData.created_at,
        updatedAt: rawData.updated_at,
        heart: rawData.isLike,
        tagList: (rawData.tag_list && rawData.tag_list.split(',')) || (rawData.tags && rawData.tags.split(',')) || (rawData.tag_name && rawData.tag_name.split(',')) || [],
    } as ContentData;
  }
  

export const processRawRecordData = (rawData : any) => {
    return {
        contentName: rawData.title,
        contentId: rawData.exercise_id,
        thumbUrl: rawData.thumb_url,
        thumbGifUrl: rawData.thumb_gif_url,
        score: rawData["SUM(eh.similarity_value)"],
        playTime: rawData.total_time,
        calorie: rawData.total_kcal,
    } as RecordData;
}


export const processRawDailyRecordData = (rawData : any) => {
    return {
        dateString: rawData.today_date,
        year: Number.parseInt(rawData.today_date.substring(0, 4)),
        month: Number.parseInt(rawData.today_date.substring(5, 7)),
        date: Number.parseInt(rawData.today_date.substring(8, 10)),
        playTime: rawData.total_time,
        calorie: Number.parseInt(rawData.total_kcal),
        score: rawData.similarity_value,
    } as DailyRecordData;
}

export const processRawTagData = (rawData : any) => {
    return {
      id: rawData.tag_id,
      name: rawData.tag_name,
      englishName: rawData.tag_english_name,
    } as TagData;
}