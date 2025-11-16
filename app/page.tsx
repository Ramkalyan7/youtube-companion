"use client";

import { useState, useEffect } from "react";
import {
  getVideoDetails,
  getComments,
  postComment,
  postReply,
  deleteComment,
  updateVideoMetadata,
} from "@/lib/axios/axios";

export default function Home() {
  const [accessToken, setAccessToken] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoDetails, setVideoDetails] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [notes, setNotes] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken || !videoId) {
      setVideoDetails(null);
      setComments([]);
      setNotes([]);
      return;
    }

    setLoading(true);
    setError("");

    getVideoDetails(accessToken, videoId)
      .then((video) => {
        setVideoDetails(video);
        setTitleInput(video?.snippet?.title ?? "");
        setDescriptionInput(video?.snippet?.description ?? "");
      })
      .catch(() => setError("Failed to fetch video details"))
      .finally(() => setLoading(false));

    getComments(accessToken, videoId)
      .then(setComments)
      .catch(() => setError("Failed to fetch comments"))
      .finally(() => setLoading(false));

    fetch(`/api/notes?videoId=${videoId}`)
      .then((res) => res.json())
      .then(setNotes)
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [accessToken, videoId]);

  async function handleAddComment() {
    if (!commentInput.trim()) return;
    setLoading(true);
    try {
      await postComment(accessToken, videoId, commentInput);
      setCommentInput("");
      const updatedComments = await getComments(accessToken, videoId);
      setComments(updatedComments);
      await logEvent("comment_added", { videoId, content: commentInput });
    } catch {
      setError("Failed to post comment");
    }
    setLoading(false);
  }

  async function handleReply(commentId: string) {
    const text = replyInput[commentId];
    if (!text?.trim()) return;
    setLoading(true);
    try {
      await postReply(accessToken, commentId, text);
      setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
      const updatedComments = await getComments(accessToken, videoId);
      setComments(updatedComments);
      await logEvent("comment_replied", { videoId, parentId: commentId, content: text });
    } catch {
      setError("Failed to post reply");
    }
    setLoading(false);
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("Delete this comment?")) return;
    setLoading(true);
    try {
      await deleteComment(accessToken, commentId);
      const updatedComments = await getComments(accessToken, videoId);
      setComments(updatedComments);
      await logEvent("comment_deleted", { videoId, commentId });
    } catch {
      setError("Failed to delete comment");
    }
    setLoading(false);
  }

  // Update video metadata handler
  async function handleUpdateMetadata() {
    if (!titleInput.trim()) return alert("Title is required");
    setLoading(true);
    try {
      await updateVideoMetadata(accessToken, videoId, titleInput, descriptionInput);
      alert("Video metadata updated");
      await logEvent("video_metadata_updated", { videoId, title: titleInput, description: descriptionInput });
    } catch {
      setError("Failed to update video metadata");
    }
    setLoading(false);
  }

  // Notes handlers
  async function handleAddNote() {
    if (!noteInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, content: noteInput }),
      });
      if (!res.ok) throw new Error("Failed to add note");

      setNoteInput("");
      const updatedNotes = await fetch(`/api/notes?videoId=${videoId}`).then((r) => r.json());
      setNotes(updatedNotes);
      await logEvent("note_added", { videoId, content: noteInput });
    } catch {
      setError("Failed to add note");
    }
    setLoading(false);
  }

  // Simple event logging function (implement your event logging API accordingly)
  async function logEvent(eventType: string, details: any) {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, videoId, details, timestamp: new Date().toISOString() }),
      });
    } catch {
      // ignore logging errors in UI for now
    }
  }

  return (
    <main className="min-h-screen bg-blue-100 text-gray-900 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-10 space-y-10">
        <h1 className="text-4xl font-extrabold text-center">YouTube Companion Dashboard</h1>

        {/* Instructions */}
        <section className="bg-blue-100 border border-blue-300 rounded p-4 text-blue-900 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li className="wrap-break-word">
              Obtain your <b>OAuth Access Token</b> with scope <code>https://www.googleapis.com/auth/youtube.force-ssl</code> via{" "}
              <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noreferrer" className="underline">
                OAuth 2.0 Playground
              </a>.
            </li>
            <li>Paste your access token into the field below.</li>
            <li>Enter the YouTube Video ID you want to manage.</li>
            <li>Use the options to update video details, post comments, reply, delete, or add notes.</li>
          </ol>
        </section>

        {/* OAuth Token & Video ID Inputs */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div>
            <label htmlFor="accessToken" className="block font-semibold mb-1">
              OAuth Access Token
            </label>
            <input
              type="text"
              id="accessToken"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your OAuth access token here"
              spellCheck={false}
              autoComplete="off"
              className="w-full border border-gray-300 rounded p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="videoId" className="block font-semibold mb-1">
              YouTube Video ID
            </label>
            <input
              type="text"
              id="videoId"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="Enter YouTube Video ID"
              spellCheck={false}
              autoComplete="off"
              className="w-full border border-gray-300 rounded p-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Error Message */}
        {error && <p className="text-red-600 font-semibold text-center">{error}</p>}

        {/* Loading Indicator */}
        {loading && <p className="text-center text-lg font-medium">Loading...</p>}

        {/* Video Section */}
        {videoDetails && !loading && (
          <>
            {/* Video Details */}
            <section className="border border-gray-300 rounded p-6 shadow max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl font-semibold">Video Details</h2>
              <input
                className="w-full border border-gray-300 rounded p-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Title"
                spellCheck={false}
              />
              <textarea
                className="w-full border border-gray-300 rounded p-3 text-black placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="Description"
              />
              <button
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                onClick={handleUpdateMetadata}
                disabled={loading}
              >
                Update Metadata
              </button>
            </section>

            {/* Comments Section */}
            <section className="border border-gray-300 rounded p-6 shadow max-w-3xl mx-auto space-y-4">
              <h3 className="text-2xl font-semibold">Comments</h3>

              <textarea
                className="w-full border border-gray-300 rounded p-3 text-black resize-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add new comment"
              />
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                onClick={handleAddComment}
                disabled={loading || !commentInput.trim()}
              >
                Post Comment
              </button>

              {comments.length === 0 && <p className="text-center">No comments yet.</p>}

              {comments.map((thread) => {
                const topComment = thread.snippet.topLevelComment;
                const replies = thread.replies?.comments || [];

                return (
                  <div key={thread.id} className="border border-gray-200 rounded p-4 bg-gray-50 space-y-3">
                    <p dangerouslySetInnerHTML={{ __html: topComment.snippet.textDisplay }} />
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteComment(topComment.id)}
                      disabled={loading}
                    >
                      Delete Comment
                    </button>

                    <textarea
                      className="w-full border border-gray-300 rounded p-2 resize-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                      value={replyInput[topComment.id] || ""}
                      onChange={(e) =>
                        setReplyInput((prev) => ({ ...prev, [topComment.id]: e.target.value }))
                      }
                      placeholder="Write a reply..."
                      disabled={loading}
                    />
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleReply(topComment.id)}
                      disabled={loading || !(replyInput[topComment.id]?.trim())}
                    >
                      Reply
                    </button>

                    {replies.length > 0 && (
                      <div className="ml-6 border-l-2 pl-4 space-y-2">
                        {replies.map((reply) => (
                          <div key={reply.id} className="bg-white p-2 rounded shadow-sm">
                            <p dangerouslySetInnerHTML={{ __html: reply.snippet.textDisplay }} />
                            <button
                              className="text-red-600 hover:underline"
                              onClick={() => handleDeleteComment(reply.id)}
                              disabled={loading}
                            >
                              Delete Reply
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            {/* Notes Section */}
            <section className="border border-gray-300 rounded p-6 shadow max-w-3xl mx-auto space-y-4">
              <h3 className="text-2xl font-semibold">Notes</h3>

              <textarea
                className="w-full border border-gray-300 rounded p-3 resize-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a note about this video"
              />
              <button
                className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                onClick={handleAddNote}
                disabled={!noteInput.trim() || loading}
              >
                Add Note
              </button>

              {notes.length === 0 && <p className="text-center">No notes yet.</p>}
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {notes.map((note) => (
                  <li key={note.id} className="bg-yellow-50 p-3 rounded break-words">
                    {note.content}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
