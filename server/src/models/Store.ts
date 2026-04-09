import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    street: String,
    number: String,
    complement: String,
    district: String,
    city: String,
    state: String,
    stateAcronym: String,
    zipCode: String,
  },
  { _id: false },
);

const storeSchema = new mongoose.Schema(
  {
    storeId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, index: true },
    avatar: String,
    premium: { type: Boolean, default: false },
    address: addressSchema,
  },
  { timestamps: true },
);

export default mongoose.model('Store', storeSchema);
