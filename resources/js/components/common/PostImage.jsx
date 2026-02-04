import { useState } from "react";

export default function PostImage({ src, alt = "Post media", className }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return null; // or return a placeholder div if you want
  }

  return (
    <div
      className="postImageWrapper"
      style={{
        borderRadius: 0,
        overflow: "hidden",
        backgroundColor: "#000", // black bg for letterbox
        maxHeight: 600,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setError(true)}
        className={className ?? "postImage"}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover", // nice crop
        }}
      />
    </div>
  );
}
