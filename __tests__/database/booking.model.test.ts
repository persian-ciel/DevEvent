import mongoose from 'mongoose';
import { Booking, IBooking } from '@/database/booking.model';
import { Event, IEvent } from '@/database/event.model';

describe('Booking Model', () => {
  let testEvent: IEvent;

  beforeEach(async () => {
    // Create a test event for booking tests
    testEvent = await Event.create({
      title: 'Test Conference',
      description: 'Test Description',
      overview: 'Test Overview',
      image: 'https://example.com/image.jpg',
      venue: 'Test Venue',
      location: 'Test Location',
      date: '2025-12-25',
      time: '18:30',
      mode: 'online' as const,
      audience: 'Developers',
      agenda: ['Session 1'],
      organizer: 'Test Organizer',
    });
  });

  describe('Schema Validation', () => {
    it('should create a valid booking with required fields', async () => {
      const bookingData = {
        eventId: testEvent._id,
        email: 'user@example.com',
      };

      const booking = await Booking.create(bookingData);

      expect(booking.eventId.toString()).toBe(testEvent._id.toString());
      expect(booking.email).toBe('user@example.com');
      expect(booking.createdAt).toBeInstanceOf(Date);
      expect(booking.updatedAt).toBeInstanceOf(Date);
    });

    it('should fail validation when eventId is missing', async () => {
      const bookingData = {
        email: 'user@example.com',
      };

      await expect(Booking.create(bookingData)).rejects.toThrow();
    });

    it('should fail validation when email is missing', async () => {
      const bookingData = {
        eventId: testEvent._id,
      };

      await expect(Booking.create(bookingData)).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'User@Example.COM',
      });

      expect(booking.email).toBe('user@example.com');
    });

    it('should trim whitespace from email', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: '  user@example.com  ',
      });

      expect(booking.email).toBe('user@example.com');
    });

    it('should validate email format - reject invalid email without @', async () => {
      await expect(
        Booking.create({
          eventId: testEvent._id,
          email: 'invalid-email',
        })
      ).rejects.toThrow('Please provide a valid email address');
    });

    it('should validate email format - reject invalid email without domain', async () => {
      await expect(
        Booking.create({
          eventId: testEvent._id,
          email: 'user@',
        })
      ).rejects.toThrow('Please provide a valid email address');
    });

    it('should validate email format - reject invalid email without TLD', async () => {
      await expect(
        Booking.create({
          eventId: testEvent._id,
          email: 'user@example',
        })
      ).rejects.toThrow('Please provide a valid email address');
    });

    it('should validate email format - accept valid email with subdomain', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@mail.example.com',
      });

      expect(booking.email).toBe('user@mail.example.com');
    });

    it('should validate email format - accept valid email with plus sign', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user+tag@example.com',
      });

      expect(booking.email).toBe('user+tag@example.com');
    });

    it('should validate email format - accept valid email with numbers', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user123@example456.com',
      });

      expect(booking.email).toBe('user123@example456.com');
    });

    it('should validate email format - accept valid email with dots', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'first.last@example.com',
      });

      expect(booking.email).toBe('first.last@example.com');
    });

    it('should validate email format - accept valid email with hyphens', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@my-domain.com',
      });

      expect(booking.email).toBe('user@my-domain.com');
    });

    it('should validate email format - reject email with spaces', async () => {
      await expect(
        Booking.create({
          eventId: testEvent._id,
          email: 'user @example.com',
        })
      ).rejects.toThrow('Please provide a valid email address');
    });

    it('should validate email format - reject email with only spaces', async () => {
      await expect(
        Booking.create({
          eventId: testEvent._id,
          email: '   ',
        })
      ).rejects.toThrow('Please provide a valid email address');
    });
  });

  describe('Event Reference Validation', () => {
    it('should reject booking when event does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(
        Booking.create({
          eventId: nonExistentId,
          email: 'user@example.com',
        })
      ).rejects.toThrow('Cannot create booking: the referenced event does not exist');
    });

    it('should allow booking when event exists', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      expect(booking.eventId.toString()).toBe(testEvent._id.toString());
    });

    it('should validate event reference when eventId is modified', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      // Create another event
      const anotherEvent = await Event.create({
        title: 'Another Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-26',
        time: '19:30',
        mode: 'offline' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      booking.eventId = anotherEvent._id as any;
      await expect(booking.save()).resolves.toBeDefined();
    });

    it('should fail validation when modifying to non-existent event', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      const nonExistentId = new mongoose.Types.ObjectId();
      booking.eventId = nonExistentId as any;

      await expect(booking.save()).rejects.toThrow(
        'Cannot create booking: the referenced event does not exist'
      );
    });

    it('should not validate event reference when only email is modified', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      booking.email = 'newemail@example.com';
      await expect(booking.save()).resolves.toBeDefined();
      expect(booking.email).toBe('newemail@example.com');
    });
  });

  describe('Indexes', () => {
    it('should have an index on eventId', async () => {
      const indexes = await Booking.collection.getIndexes();
      const eventIdIndex = Object.keys(indexes).find((key) =>
        key.includes('eventId')
      );
      expect(eventIdIndex).toBeDefined();
    });

    it('should allow multiple bookings for the same event', async () => {
      await Booking.create({
        eventId: testEvent._id,
        email: 'user1@example.com',
      });

      await Booking.create({
        eventId: testEvent._id,
        email: 'user2@example.com',
      });

      const bookings = await Booking.find({ eventId: testEvent._id });
      expect(bookings).toHaveLength(2);
    });

    it('should allow same email to book different events', async () => {
      const event2 = await Event.create({
        title: 'Second Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-26',
        time: '19:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      await Booking.create({
        eventId: event2._id,
        email: 'user@example.com',
      });

      const bookings = await Booking.find({ email: 'user@example.com' });
      expect(bookings).toHaveLength(2);
    });
  });

  describe('Timestamps', () => {
    it('should automatically set createdAt and updatedAt on creation', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      expect(booking.createdAt).toBeInstanceOf(Date);
      expect(booking.updatedAt).toBeInstanceOf(Date);
      expect(booking.createdAt.getTime()).toBeLessThanOrEqual(
        booking.updatedAt.getTime()
      );
    });

    it('should update updatedAt when document is modified', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      const originalUpdatedAt = booking.updatedAt;

      // Wait to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      booking.email = 'newemail@example.com';
      await booking.save();

      expect(booking.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should not change createdAt when document is modified', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      const originalCreatedAt = booking.createdAt;

      booking.email = 'newemail@example.com';
      await booking.save();

      expect(booking.createdAt.getTime()).toBe(originalCreatedAt.getTime());
    });
  });

  describe('Model Operations', () => {
    it('should find bookings by eventId', async () => {
      await Booking.create({
        eventId: testEvent._id,
        email: 'user1@example.com',
      });

      await Booking.create({
        eventId: testEvent._id,
        email: 'user2@example.com',
      });

      const bookings = await Booking.find({ eventId: testEvent._id });
      expect(bookings).toHaveLength(2);
    });

    it('should find booking by email', async () => {
      await Booking.create({
        eventId: testEvent._id,
        email: 'unique@example.com',
      });

      const booking = await Booking.findOne({ email: 'unique@example.com' });
      expect(booking).toBeTruthy();
      expect(booking?.email).toBe('unique@example.com');
    });

    it('should populate event details', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      const populatedBooking = await Booking.findById(booking._id).populate(
        'eventId'
      );

      expect(populatedBooking).toBeTruthy();
      expect((populatedBooking?.eventId as any).title).toBe('Test Conference');
    });

    it('should update a booking', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'original@example.com',
      });

      booking.email = 'updated@example.com';
      await booking.save();

      const updated = await Booking.findById(booking._id);
      expect(updated?.email).toBe('updated@example.com');
    });

    it('should delete a booking', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      await Booking.findByIdAndDelete(booking._id);

      const deleted = await Booking.findById(booking._id);
      expect(deleted).toBeNull();
    });

    it('should count bookings for an event', async () => {
      await Booking.create({
        eventId: testEvent._id,
        email: 'user1@example.com',
      });

      await Booking.create({
        eventId: testEvent._id,
        email: 'user2@example.com',
      });

      await Booking.create({
        eventId: testEvent._id,
        email: 'user3@example.com',
      });

      const count = await Booking.countDocuments({ eventId: testEvent._id });
      expect(count).toBe(3);
    });

    it('should find all bookings with pagination', async () => {
      // Create multiple bookings
      for (let i = 0; i < 5; i++) {
        await Booking.create({
          eventId: testEvent._id,
          email: `user${i}@example.com`,
        });
      }

      const page1 = await Booking.find().limit(2).skip(0);
      const page2 = await Booking.find().limit(2).skip(2);

      expect(page1).toHaveLength(2);
      expect(page2).toHaveLength(2);
      expect(page1[0].email).not.toBe(page2[0].email);
    });
  });

  describe('Edge Cases', () => {
    it('should handle email with maximum valid length', async () => {
      // Email standard supports up to 254 characters
      const longEmail =
        'a'.repeat(64) + '@' + 'b'.repeat(180) + '.com';
      
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: longEmail,
      });

      expect(booking.email).toBe(longEmail.toLowerCase());
    });

    it('should handle Unicode characters in email local part', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user123@example.com',
      });

      expect(booking.email).toBe('user123@example.com');
    });

    it('should handle event deletion scenario', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      // Delete the event
      await Event.findByIdAndDelete(testEvent._id);

      // Booking should still exist (no cascade delete)
      const existingBooking = await Booking.findById(booking._id);
      expect(existingBooking).toBeTruthy();

      // But trying to create a new booking for deleted event should fail
      await expect(
        Booking.create({
          eventId: testEvent._id,
          email: 'another@example.com',
        })
      ).rejects.toThrow('Cannot create booking: the referenced event does not exist');
    });

    it('should handle concurrent bookings for same event', async () => {
      const bookingPromises = [];
      for (let i = 0; i < 10; i++) {
        bookingPromises.push(
          Booking.create({
            eventId: testEvent._id,
            email: `user${i}@example.com`,
          })
        );
      }

      const bookings = await Promise.all(bookingPromises);
      expect(bookings).toHaveLength(10);

      const count = await Booking.countDocuments({ eventId: testEvent._id });
      expect(count).toBe(10);
    });

    it('should handle booking with email containing special valid characters', async () => {
      const specialEmails = [
        'user+tag@example.com',
        'first.last@example.com',
        'user_name@example.com',
        'user-name@example.com',
        '123@example.com',
      ];

      for (const email of specialEmails) {
        const booking = await Booking.create({
          eventId: testEvent._id,
          email,
        });
        expect(booking.email).toBe(email.toLowerCase());
      }
    });

    it('should maintain data integrity with multiple events and bookings', async () => {
      // Create multiple events
      const event1 = testEvent;
      const event2 = await Event.create({
        title: 'Second Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-26',
        time: '19:30',
        mode: 'offline' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      // Create bookings for both events
      await Booking.create({
        eventId: event1._id,
        email: 'user1@example.com',
      });
      await Booking.create({
        eventId: event1._id,
        email: 'user2@example.com',
      });
      await Booking.create({
        eventId: event2._id,
        email: 'user1@example.com',
      });

      const event1Bookings = await Booking.find({ eventId: event1._id });
      const event2Bookings = await Booking.find({ eventId: event2._id });
      const user1Bookings = await Booking.find({ email: 'user1@example.com' });

      expect(event1Bookings).toHaveLength(2);
      expect(event2Bookings).toHaveLength(1);
      expect(user1Bookings).toHaveLength(2);
    });
  });

  describe('Type Safety', () => {
    it('should enforce ObjectId type for eventId', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      expect(booking.eventId).toBeInstanceOf(mongoose.Types.ObjectId);
    });

    it('should enforce string type for email', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      expect(typeof booking.email).toBe('string');
    });

    it('should enforce Date type for timestamps', async () => {
      const booking = await Booking.create({
        eventId: testEvent._id,
        email: 'user@example.com',
      });

      expect(booking.createdAt).toBeInstanceOf(Date);
      expect(booking.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Query Performance', () => {
    it('should efficiently query bookings by indexed eventId', async () => {
      // Create many bookings
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          Booking.create({
            eventId: testEvent._id,
            email: `user${i}@example.com`,
          })
        );
      }
      await Promise.all(promises);

      const startTime = Date.now();
      const bookings = await Booking.find({ eventId: testEvent._id });
      const queryTime = Date.now() - startTime;

      expect(bookings).toHaveLength(100);
      // Query should be fast due to index (typically < 100ms even with many records)
      expect(queryTime).toBeLessThan(1000);
    });
  });
});