import { createImageUpload } from "novel";
import { toast } from "sonner";

const onUpload = (file: File): Promise<string | File> => {
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file.type || "application/octet-stream",
      "x-vercel-filename": file.name || "image.png",
    },
    body: file,
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as { url: string };
          // preload the image
          const image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error(
            "`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.",
          );
          // Unknown error
        } else {
          throw new Error("Error uploading image. Please try again.");
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => {
          const error =
            e instanceof Error
              ? e
              : new Error(
                  typeof e === "string" ? e : "An unknown error occurred",
                );
          reject(error);
          return error.message;
        },
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file: File): boolean => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
