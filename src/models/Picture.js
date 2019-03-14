const mongoose = require('mongoose');
const { Schema } = mongoose;

const PictureSchema = new Schema({
  platform: { type: String, required: true, index: true  },
  metaData: { type: Object, required: true }
}, { timestamps: true });

PictureSchema.statics.hydrate = function (picture) {
  return new Picture({
    platform: picture.platform,
    metaData: picture.metaData
  });
};

PictureSchema.statics.add = function (picture) {
  const newPic = new Picture({
    platform: picture.platform,
    metaData: picture.metaData
  });
  return newPic.save();
};

const Picture = mongoose.model('Picture', PictureSchema);

module.exports = Picture;
