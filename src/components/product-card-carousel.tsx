"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CarouselImage = {
  key: string;
  url: string;
  label: string;
};

type ProductCardCarouselProps = {
  images: CarouselImage[];
};

export function ProductCardCarousel({ images }: ProductCardCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const width = track.clientWidth;
    if (width <= 0) {
      return;
    }
    const index = Math.round(track.scrollLeft / width);
    const nextIndex = Math.min(images.length - 1, Math.max(0, index));
    setActiveIndex(nextIndex);
  }, [images.length]);

  const scrollByAmount = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const amount = track.clientWidth * 0.85;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateActiveIndex();
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const handleScroll = () => updateActiveIndex();
    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex]);

  const imageNodes = useMemo(
    () =>
      images.map((image, index) => (
        <div key={image.key} className="relative h-full w-full shrink-0 snap-start">
          <Image
            src={image.url}
            alt={image.label}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={70}
            className="object-contain p-2.5 transition duration-500 group-hover:scale-[1.03]"
            priority={index === 0}
            onLoadingComplete={updateActiveIndex}
          />
        </div>
      )),
    [images, updateActiveIndex],
  );

  return (
    <div className="relative h-full w-full">
      <div
        ref={trackRef}
        className="product-card-carousel flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth touch-pan-x"
      >
        {imageNodes}
      </div>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            aria-label="Geser foto ke kiri"
            className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-sky-200/40 bg-slate-950/70 text-sm font-bold text-sky-100 shadow-sm transition hover:border-sky-200/70 hover:bg-slate-900/80 sm:flex"
          >
            {"<"}
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            aria-label="Geser foto ke kanan"
            className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-sky-200/40 bg-slate-950/70 text-sm font-bold text-sky-100 shadow-sm transition hover:border-sky-200/70 hover:bg-slate-900/80 sm:flex"
          >
            {">"}
          </button>

          <div className="pointer-events-none absolute left-3 right-3 bottom-2 sm:hidden">
            <div className="h-1.5 rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-sky-200/80 transition-[transform,width] duration-200"
                style={{
                  width: `${100 / images.length}%`,
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
