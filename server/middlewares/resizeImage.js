import sharp from 'sharp';

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 600 })      // reduce width
    .jpeg({ quality: 70 })       // reduce file size
    .toBuffer();

  req.file.buffer = buffer;
  next();
};
export { resizeImage };
