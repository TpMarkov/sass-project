"use client";

import React from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { dataUrl, debounce } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

function TransformedImage({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) {
  const downloadHandler = () => {};

  const width = image?.width || 800;
  const height = image?.height || 600;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="dark-600 h3-bold">Transformed</h3>
        {hasDownload && (
          <button className="download-btn" onClick={downloadHandler}>
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-[6px]"
            />
            Download
          </button>
        )}
      </div>
      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={width}
            height={height}
            src={image?.secureUrl}
            alt={title || image?.title}
            sizes="(max-width:767px) 100vw,50vw"
            placeholder={dataUrl as PlaceholderValue}
            className="transformed-image"
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000);
            }}
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="transforming-loader">
              <Image
                src="/assets/icons/spinner.svg"
                alt="Transforming..."
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed</div>
      )}
    </div>
  );
}

export default TransformedImage;
