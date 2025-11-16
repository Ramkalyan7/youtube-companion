import axios from "axios";

export function createYouTubeClient(accessToken: string) {
  return axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

export async function getVideoDetails(accessToken: string, videoId: string) {
  const client = createYouTubeClient(accessToken);
  const res = await client.get("/videos", {
    params: { part: "snippet", id: videoId },
  });
  return res.data.items?.[0];
}

export async function getComments(accessToken: string, videoId: string) {
  const client = createYouTubeClient(accessToken);
  const res = await client.get("/commentThreads", {
    params: { part: "snippet,replies", videoId, maxResults: 50 },
  });
  return res.data.items || [];
}

export async function postComment(accessToken: string, videoId: string, text: string) {
  const client = createYouTubeClient(accessToken);
  const res = await client.post(
    "/commentThreads",
    {
      snippet: {
        videoId,
        topLevelComment: {
          snippet: {
            textOriginal: text,
          },
        },
      },
    },
    {
      params: { part: "snippet" },
    }
  );
  return res.data;
}

export async function postReply(accessToken: string, parentId: string, text: string) {
  const client = createYouTubeClient(accessToken);
  const res = await client.post(
    "/comments",
    {
      snippet: {
        parentId,
        textOriginal: text,
      },
    },
    {
      params: { part: "snippet" },
    }
  );
  return res.data;
}

export async function deleteComment(accessToken: string, commentId: string) {
  const client = createYouTubeClient(accessToken);
  await client.delete("/comments", { params: { id: commentId } });
}

export async function updateVideoMetadata(
  accessToken: string,
  videoId: string,
  title: string,
  description: string,
) {
  const client = createYouTubeClient(accessToken);

  const res = await client.put(
    "/videos",
    {
      id: videoId,
      snippet: {
        title,
        description,
       categoryId: 22
      },
    },
    { params: { part: "snippet" } }
  );
  return res.data;
}
