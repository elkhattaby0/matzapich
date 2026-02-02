import { useState, useRef, useEffect } from "react";
import detectDirection from '../../components/common/detectDirection'


export default function ShowMoreText({ text, lines = 2 }) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // temporarily remove clamp to measure full height
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = lineHeight * lines;

    setShowButton(el.scrollHeight > maxHeight);
  }, [text, lines]);

  return (
    <div>
      <p dir={detectDirection(text)}
        ref={textRef}
        className={`text ${expanded ? "expanded" : "clamped"}`}
        style={{
          WebkitLineClamp: expanded ? "unset" : lines,
        }}
      >
        {text}
      </p>

      {showButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="btn"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
