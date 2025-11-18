// database/event.model.ts
import { Schema, model, models, Document, Model } from 'mongoose';
import slugify from 'slugify';

// Extend Document for instance methods
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string (e.g., "2025-12-25")
  time: string; // 24-hour format (e.g., "18:30")
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    overview: { type: String, required: [true, 'Overview is required'], trim: true },
    image: { type: String, required: [true, 'Image URL is required'] },
    venue: { type: String, required: [true, 'Venue is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    date: { type: String, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] },
    mode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      required: [true, 'Event mode is required'],
    },
    audience: { type: String, required: [true, 'Target audience is required'] },
    agenda: [{ type: String, required: true }],
    organizer: { type: String, required: [true, 'Organizer is required'] },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

// Ensure unique slug index
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save: generate slug only if title changed, normalize date/time
EventSchema.pre('save', function (next) {
  // Generate slug from title (only if title changed)
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Normalize date to YYYY-MM-DD
  if (this.isModified('date')) {
    try {
      const isoDate = new Date(this.date);
      if (isNaN(isoDate.getTime())) throw new Error('Invalid date');
      this.date = isoDate.toISOString().split('T')[0];
    } catch {
      return next(new Error('Invalid date format'));
    }
  }

  // Normalize time to HH:mm (24-hour)
  if (this.isModified('time')) {
    const timeMatch = this.time.match(/^(\d{1,2}):?(\d{2})\s*(AM|PM)?$/i);
    if (!timeMatch) return next(new Error('Time must be in HH:mm or valid format'));

    let [_, hours, minutes, period] = timeMatch;
    let h = parseInt(hours);
    const m = minutes.padStart(2, '0');

    if (period) {
      period = period.toUpperCase();
      if (h === 12) h = period === 'AM' ? 0 : 12;
      else if (period === 'PM') h += 12;
    }

    if (h < 0 || h > 23) return next(new Error('Invalid hour'));
    this.time = `${h.toString().padStart(2, '0')}:${m}`;
  }

  next();
});

export const Event: Model<IEvent> = models.Event || model<IEvent>('Event', EventSchema);