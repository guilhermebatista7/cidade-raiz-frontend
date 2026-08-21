import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { HomeImg } from "../HomeImg/HomeImg";
import "./HomeVideo.css";
import type { ReactNode } from "react";

interface VideoProps extends ImgHTMLAttributes<HTMLVideoElement> {
  src: string;
  title?: string;
  icon?: ReactNode;
  fallbackSrc?: string;
  playbackRate?: number;
}

export function HomeVideo({
  src,
  title,
  icon,
  fallbackSrc,
  playbackRate = 0.7,
  ...props
}: VideoProps) {
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const resumePlayback = () => {
      if (video.paused) {
        void video.play().catch(() => undefined);
      }
    };

    video.addEventListener("canplay", resumePlayback);
    video.addEventListener("stalled", resumePlayback);

    return () => {
      video.removeEventListener("canplay", resumePlayback);
      video.removeEventListener("stalled", resumePlayback);
    };
  }, [src]);

  if (hasVideoError) {
    return (
      <HomeImg
        src={fallbackSrc ?? src}
        alt="Cidade Raiz"
        title={title}
        className="image home-fallback"
      />
    );
  }

  return (
    <>
      <div className="home-video">
        <video
          ref={videoRef}
          src={src}
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setHasVideoError(true)}
          {...props}
        />

        {title && (
          <h1 className="split-text-container">
            <span className="text-part left">
              {title.slice(0, title.indexOf(" "))}
            </span>

            <span className="text-part right">
              {icon} 
              {title.slice(title.indexOf(" ") + 1)}
            </span> 
          </h1>
        )}
      </div>
    </>
  )
}