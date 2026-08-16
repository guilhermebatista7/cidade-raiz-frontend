import { useState, type ImgHTMLAttributes } from "react";
import { HomeImg } from "../HomeImg/HomeImg";
import "./HomeVideo.css";

interface VideoProps extends ImgHTMLAttributes<HTMLVideoElement> {
  src: string;
  title?: string;
  fallbackSrc?: string;
}

export function HomeVideo({ src, title, fallbackSrc, ...props }: VideoProps) {
  const [hasVideoError, setHasVideoError] = useState(false);

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
          src={src}
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
              {title.slice(title.indexOf(" ") + 1)}
            </span>
          </h1>
        )}
      </div>
    </>
  )
}