"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted">
        <Image
          src={images[selected]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                selected === i
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              )}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
