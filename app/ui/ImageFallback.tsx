'use client';

import Image, { ImageProps } from "next/image";
import { useState } from "react"

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string
}

const ImageFallback = (props: ImageWithFallbackProps) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  if (imgSrc == null) {
    setImgSrc(fallbackSrc)
  }

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageFallback