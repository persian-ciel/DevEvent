// database/booking.model.ts
import { Schema, model, models, Document, Model } from 'mongoose';
import { Event } from './event.model';

export interface IBooking extends Document {
  eventId: Schema.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v),
        message: 'Please provide a valid email address',
      },
    },
  },
  { timestamps: true }
);

BookingSchema.index({ eventId: 1 });

// Validate event reference before save
BookingSchema.pre('save', async function () {
  if (this.isModified('eventId') || this.isNew) {
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) {
      throw new Error('Cannot create booking: the referenced event does not exist');
    }
  }
});

export const Booking: Model<IBooking> =
  models.Booking || model<IBooking>('Booking', BookingSchema);