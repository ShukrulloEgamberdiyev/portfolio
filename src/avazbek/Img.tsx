import type { ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  src: string;
  alt: string;
  /** Ota elementni to'ldiradi (ota `relative` bo'lishi kerak) */
  fill?: boolean;
  /** Birinchi ekran rasmi: eager + yuqori prioritet */
  priority?: boolean;
};

/** next/image o'rnini bosuvchi yengil komponent: lazy loading, async decode, fill rejimi. */
export default function Img({ fill, priority, className = '', loading, ...rest }: Props) {
  const extra = priority ? { fetchpriority: 'high' } : {};
  return (
    <img
      {...rest}
      {...(extra as Record<string, string>)}
      loading={priority ? 'eager' : loading ?? 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      className={`${fill ? 'absolute inset-0 h-full w-full ' : ''}${className}`}
    />
  );
}
