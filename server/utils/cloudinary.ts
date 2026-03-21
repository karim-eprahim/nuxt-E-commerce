// server/utils/cloudinary.ts
export const deleteResourceFromCloudinary = async (
  resourceName: string,
  resourceType: string = "image"
) => {
  const config = useRuntimeConfig();

  const cloudName = config.cloudinaryCloudName;
  const apiKey = config.cloudinaryApiKey;       // private
  const apiSecret = config.cloudinaryApiSecret; // private

  const timestamp = Math.floor(Date.now() / 1000);
  const crypto = await import("crypto");

  // Cloudinary signature
  const stringToSign = `public_id=${resourceName}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

  const formData = new URLSearchParams();
  formData.append("public_id", resourceName);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  // REST API call لحذف الصورة
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;

  const res = await $fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res;
};