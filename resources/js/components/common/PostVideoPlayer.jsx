import { useRef, useState, useEffect } from "react";

export default function PostVideoPlayer({ src, className }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0);

  const PRIMARY = "#0000FFB4";

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setProgress(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => setIsPlaying(false);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className="postVideoWrapper"
      style={{
        position: "relative",
        maxWidth: "100%",
        marginTop: 8,
        borderRadius: 0,
        overflow: "hidden",
        backgroundColor: "#000", // black background
        aspectRatio: "16 / 9",   // consistent player height
      }}
    >
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className={className ?? "postVideo"}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          maxHeight: 500,
          objectFit: "contain",    // keep full video visible
          backgroundColor: "#000", // black bars if not fit
        }}
        onClick={togglePlay}
      />

      {/* Center overlay play button */}
      <button
        type="button"
        onClick={togglePlay}
        className="postVideoCenterButton"
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 52,
          height: 52,
          borderRadius: "9999px",
          border: "none",
          backgroundColor: "rgba(0,0,0,0.45)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transform: isPlaying ? "scale(0.9)" : "scale(1)",
          opacity: isPlaying ? 0 : 1,
          transition: "all 150ms ease-out",
          pointerEvents: isPlaying ? "none" : "auto",
        }}
      >
        <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`} />
      </button>

      {/* Bottom controls bar */}
      <div
        className="postVideoControls"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "6px 8px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)",
          color: "#fff",
          fontSize: 11,
        }}
      >
        {/* Play/pause small button */}
        <button
          type="button"
          onClick={togglePlay}
          style={{
            width: 28,
            height: 28,
            borderRadius: "9999px",
            border: "none",
            backgroundColor: PRIMARY,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          }}
        >
          <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`} />
        </button>

        {/* Mute */}
        <button
          type="button"
          onClick={toggleMute}
          style={{
            width: 28,
            height: 28,
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "rgba(0,0,0,0.35)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className={`fa-solid ${
              isMuted ? "fa-volume-xmark" : "fa-volume-high"
            }`}
          />
        </button>

        {/* Time */}
        <span
          style={{
            minWidth: 80,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            opacity: 0.85,
          }}
        >
          {formatTime(progress)} / {formatTime(duration)}
        </span>

        {/* Seek bar click area */}
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 9999,
            backgroundColor: "rgba(255,255,255,0.25)",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            const video = videoRef.current;
            if (!video || !duration) return;
            const newTime = Math.max(
              0,
              Math.min(duration, duration * ratio)
            );
            video.currentTime = newTime;
            setProgress(newTime);
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progressPercent}%`,
              borderRadius: 9999,
              backgroundColor: PRIMARY,
            }}
          />
        </div>
      </div>
    </div>
  );
}
