import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    cityId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

export default mongoose.model('City', citySchema);
