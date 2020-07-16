import { poseSimilarity } from 'posenet-similarity';

export function extractPose(view) {
    if (!view || !view.poses || !view.poses.poses) return null;
    // if (!view.poses.hasOwnProperty('poses')) return null;
    if (view.poses.poses.length > 1) {
        console.log("multi person detected");
        return null;
    }
    return view.poses.poses[0];
}

// views: Screen.views (view[])
// return: -1: 현재 모델이 제대로 측정 안됨, 0~1 값 점수 
export async function scorePoseSimilarity(views) {
    if (views.length !== 2) return -1;
    const modelPose= extractPose(views[0]);
    const userPose = extractPose(views[1]);
    if (modelPose == null) return -1;
    if (userPose == null) return 0;

    return poseSimilarity(modelPose, modelPose, {strategy: "weightedDistance"}); // 0일수록 비슷 아마 1넘어가기 힘들듯?
    // return poseSimilarity(modelPose, userPose, {strategy: "cosineDistance"}); // 0일수록 비슷 0~2사이 값 
    // return poseSimilarity(modelPose, userPose, {strategy: "cosineSimilarity"});// -1~1 사이 값, -1이면 방향 완전 반대, 1이면 완전 똑같음
}
