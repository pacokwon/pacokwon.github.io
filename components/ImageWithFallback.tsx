import Image, { ImageProps } from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props extends ImageProps {
  fallback?: string;
}

const ImageWithFallback: React.FC<Props> = ({
  fallback,
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={setError}
      src={error ? fallback : src}
      {...props}
    />
  );
};

export default ImageWithFallback;
