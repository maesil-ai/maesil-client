import { poseSimilarity } from 'posenet-similarity';

function extractPose(view) {
    if (!view.hasOwnProperty('poses')) return null;
    if (!view.poses.hasOwnProperty('poses')) return null;
    return view.poses.poses[0];
}

export async function scorePoseSimilarity(views) {
    if (views.length !== 2) return 0;
    const modelPose= extractPose(views[0]);
    const userPose = extractPose(views[1]);
    if (modelPose == null || userPose == null) return 0;
    
    const similarityScore = poseSimilarity(modelPose, userPose, { strategy: 'cosineSimilarity' });
    console.log(similarityScore);
    return similarityScore;
}