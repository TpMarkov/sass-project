"use client";

import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { toast } from "sonner";

type UploadedImage = {
  publicId: string;
  width: number;
  height: number;
  secureUrl: string;
};

type MediaUploaderProps = {
  uploadPreset: string;
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<React.SetStateAction<UploadedImage | null>>;
  publicId: string;
  image: UploadedImage | null;
  type: string;
};

const MediaUploader = ({
  uploadPreset = "jsm_imaginify",
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const onUploadSuccessHandler = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;

    const info = result.info as {
      public_id: string;
      width: number;
      height: number;
      secure_url: string;
    };

    setImage({
      publicId: info.public_id,
      width: info.width,
      height: info.height,
      secureUrl: info.secure_url,
    });

    onValueChange(info.public_id);

    toast("Upload successfully. 1 credit deducted");
  };

  const onUploadErrorHandler = () => {
    toast("Error when uploading image. Please try again later");
  };

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset || "jsm_image"}
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>

          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                width={getImageSize(type, image!, "width")}
                height={getImageSize(type, image!, "height")}
                src={publicId}
                alt="image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
            </div>
          ) : (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
