import mongoose from 'mongoose';

const detailsSchema = new mongoose.Schema(
  {
    name: String,
    format: Number,
    dateTime: Date,
    price: Number,
    numberOfRegistered: Number,
  },
  { _id: false },
);

const tournamentSchema = new mongoose.Schema(
  {
    tournamentId: { type: Number, required: true, unique: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    details: detailsSchema,
    calendarEventId: String,
    syncedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model('Tournament', tournamentSchema);
