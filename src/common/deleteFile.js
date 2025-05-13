const fs = require("fs");
const path = require("path");
// Helper function to delete uploaded files
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../../uploads", filename);
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting file:", err);
  });
};

module.exports = deleteFile;
