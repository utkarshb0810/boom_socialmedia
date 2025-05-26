import { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

function convertToYouTubeEmbed(url) {
  try {
    const yt = new URL(url);

    // Handle both "watch?v=" and "embed/" URLs
    let videoId = "";
    if (yt.hostname.includes("youtube.com")) {
      if (yt.pathname === "/watch") {
        videoId = yt.searchParams.get("v");
      } else if (yt.pathname.startsWith("/embed/")) {
        videoId = yt.pathname.split("/embed/")[1].split("&")[0];
      }
    } else if (yt.hostname === "youtu.be") {
      videoId = yt.pathname.slice(1);
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch (e) {
    return null;
  }
}

export default function Player() {
  const { token, user } = useContext(AuthContext);
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    axios
      .get("/videos/feed", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const v = res.data.feed.find((v) => v._id === videoId);
        setVideo(v);
      });

    axios
      .get(`/videos/comments/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComments(res.data.comments));
  }, [videoId]);

  const submitComment = async () => {
    await axios.post(
      "/videos/comment",
      { videoId, text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setText("");
    const res = await axios.get(`/videos/comments/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments(res.data.comments);
  };

  const sendGift = async () => {
    const amount = parseInt(prompt("Enter gift amount (₹10, ₹50, ₹100):"));
    if (!amount || isNaN(amount)) return;

    try {
      const res = await axios.post(
        "/videos/gift",
        { videoId, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Gift failed");
    }
  };

  if (!video) return <p className="p-4">Loading video...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">🎬 {video.title}</h2>
      <p className="text-sm text-gray-500">By {video.creator}</p>
      <div className="mt-4">
        {video.type === "short" ? (
          <video
            src={`http://localhost:8000/${video.videoUrl}`}
            controls
            className="w-full max-h-[500px]"
          />
        ) : (
          <iframe
            className="w-full h-64"
            src={convertToYouTubeEmbed(video.videoUrl)}
            title="Video"
            allowFullScreen
          ></iframe>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <h3 className="font-semibold">💬 Comments</h3>
        <button
          onClick={sendGift}
          className="bg-pink-600 text-white px-4 py-1 rounded"
        >
          🎁 Gift Creator
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {comments.map((c) => (
          <div key={c._id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm font-semibold">{c.user}</p>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Write a comment..."
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          onClick={submitComment}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
