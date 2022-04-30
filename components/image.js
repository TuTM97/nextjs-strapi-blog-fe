import { getStrapiMedia } from "../lib/media";
import NextImage from "next/image";

const Image = ({ image, style, alt }) => {
  if (!image) return null;
  const { alternativeText, width, height } = image.data.attributes;

  return (
    <NextImage
      layout="responsive"
      width={width}
      height={height}
      objectFit="contain"
      src={getStrapiMedia(image)}
      alt={alt || alternativeText || ""}
      style={style}
    />
  );
};

export default Image;
