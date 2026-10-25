import Image from "next/image";
import type { Concert } from "@/app/lib/concerts";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";

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
  if (!show.posterDimensions) {
    // Unknown artwork must keep its natural ratio without invented intrinsic sizes.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={show.posterUrl} alt={alt} className={className} loading={priority ? "eager" : "lazy"} />;
  }
  return (
    <Image
      src={show.posterUrl}
      alt={alt}
      {...show.posterDimensions}
      sizes={sizes}
      className={className}
      priority={priority}
      {...(blur ? { placeholder: "blur", blurDataURL: IMAGE_BLUR_DATA_URL } as const : {})}
    />
  );
}
