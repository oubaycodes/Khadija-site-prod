const cloudinary = require("cloudinary");

const deleteImage = async (deletedElement) => {
  try {
    // cloud config
    cloudinary.v2.config({
      cloud_name: "drrsws4la",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    if (Array.isArray(deletedElement.mealImage)) {
      for (let i = 1; i <= deletedElement.mealImage.length; i++) {
        await cloudinary.v2.api.delete_resources(deletedElement.altText + i, {
          type: "upload",
          resource_type: "image",
        });
        console.log(deletedElement.altText + i + " was successfully deleted");
      }
      return;
    }
    const fetchJson = await cloudinary.v2.api.delete_resources(
      [deletedElement.altText],
      {
        type: "upload",
        resource_type: "image",
      }
    );
    console.log(deletedElement.altText + " was deleted successfully");

    //
  } catch (err) {
    console.error(err.message);
  }
};
module.exports = deleteImage;
