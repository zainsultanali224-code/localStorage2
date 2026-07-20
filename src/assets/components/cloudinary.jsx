export const uploadImage = async (file) => {
  const data = new FormData();

  data.append("file", file);
  data.append("upload_preset", "profile_upload");

  console.log("Selected file:", file);

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/mkspul6y/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();
  

  console.log("Status:", res.status);
  console.log("Response:", result);

  return result.secure_url;
};