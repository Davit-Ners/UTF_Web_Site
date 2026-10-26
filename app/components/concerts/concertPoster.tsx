import Image from "next/image";
import type { Concert } from "@/app/lib/concerts";
import { getOriginalImagePath, IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import { concertPosterDimensions } from "@/app/lib/concertPosters";

type Props = {
  show: Concert;
  alt: string;
  sizes: string;
  className: string;
  priority?: boolean;
  blur?: boolean;
};

export default function ConcertPoster({ show, alt, sizes, className, priority, blur }: Props) {
  if (!show.posterUrl) return null;
  // Choose the existing local master only in the image presentation; stored data
  // and social metadata retain their current URLs.
  const src = getOriginalImagePath(show.posterUrl);
  const dimensions = concertPosterDimensions(src) ?? show.posterDimensions;
  if (!dimensions) {
    // Unknown artwork must keep its natural ratio without invented intrinsic sizes.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} loading={priority ? "eager" : "lazy"} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      {...dimensions}
      sizes={sizes}
      className={className}
      priority={priority}
      {...(blur ? { placeholder: "blur", blurDataURL: IMAGE_BLUR_DATA_URL } as const : {})}
    />
  );
}
