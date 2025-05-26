import { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  function extractYouTubeVideoId(url) {
    try {
      const parsed = new URL(url);

      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.slice(1);
      }

      if (parsed.hostname.includes("youtube.com")) {
        if (parsed.pathname === "/watch") {
          return parsed.searchParams.get("v");
        }
        if (parsed.pathname.startsWith("/embed/")) {
          return parsed.pathname.split("/embed/")[1].split("?")[0];
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  const { token } = useContext(AuthContext);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");

    axios
      .get("/videos/feed", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFeed(res.data.feed);
        setLoading(false);
      });
  }, [token]);

  const handleBuy = async (videoId) => {
    try {
      const res = await axios.post(
        "/videos/purchase",
        { videoId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">🔥 Boom Feed</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {feed.map((video) => (
            <div key={video._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm text-gray-600">By {video.creator}</p>
              {video.type === "short" ? (
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  muted
                  className="mt-2 w-full max-h-96"
                />
              ) : (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeVideoId(
                      video.videoUrl
                    )}/hqdefault.jpg`}
                    alt="YouTube thumbnail"
                    className="mt-2 rounded"
                  />
                  <div className="mt-2">
                    {video.purchased || video.price === 0 ? (
                      <button
                        onClick={() => navigate(`/player/${video._id}`)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Watch
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuy(video._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Buy for ₹{video.price}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
