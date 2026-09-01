import { useEffect, useRef, type ImgHTMLAttributes } from "react";
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

  return (
    <>
      <div className="homeVideo">
        <video
          ref={videoRef}
          src={src}
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          {...props}
        />

        {title && (
          <h1 className="splitTextContainer">
            <span className="textPart left">
              {title.slice(0, title.indexOf(" "))}
            </span>

            <span className="textPart right">
              {icon}
              {title.slice(title.indexOf(" ") + 1)}
            </span>
          </h1>
        )}
      </div>
    </>
  )
}