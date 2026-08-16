import type { ImgHTMLAttributes } from "react";
import "./HomeImg.css";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  title?: string;
}
export function HomeImg({ src, alt, fallbackSrc, title, ...props }: ImageProps) {
  return (
    <>
      <div className="home-img">
        <img
          src={src}
          alt={alt}
          onError={(event) => {
            if (
              fallbackSrc &&
              event.currentTarget.src !== fallbackSrc
            ) {
              event.currentTarget.src = fallbackSrc;
            }
          }}
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