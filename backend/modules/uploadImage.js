const cloudinary = require("cloudinary");

const uploadImage = async (request) => {
  try {
    // cloud config
    cloudinary.v2.config({
      cloud_name: "drrsws4la",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const imagePath = request.path;

    if (Array.isArray(imagePath)) {
      const urlArr = await Promise.all(
        imagePath.map(async (image, index) => {
          const uploadResult = await cloudinary.v2.uploader.upload(image, {
            public_id: request.altText + (index + 1),
            overwrite: true,
          });
          console.log(request.altText + " was uploaded successfully");
          return uploadResult.secure_url;
        })
      );

      return urlArr;
    }

    const fetchJson = await cloudinary.v2.uploader.upload(imagePath, {
      public_id: request.altText,
      overwrite: true,
    });
    console.log(request.altText + " was uploaded successfully");

    return fetchJson.secure_url;

    //
  } catch (err) {
    throw err;
  }
};
module.exports = uploadImage;
