import mongoose from 'mongoose';

const filtersSchema = new mongoose.Schema(
  {
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }],
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    formats: [Number],
    startDate: Date,
    endDate: Date,
  },
  { _id: false },
);

const calendarSchema = new mongoose.Schema(
  {
    googleCalendarId: { type: String, required: true },
    name: { type: String, required: true },
    filters: filtersSchema,
    tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' }],
    lastSyncedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model('Calendar', calendarSchema);
