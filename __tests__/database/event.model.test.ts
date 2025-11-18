import mongoose from 'mongoose';
import { Event, IEvent } from '@/database/event.model';

describe('Event Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid event with all required fields', async () => {
      const eventData = {
        title: 'Tech Conference 2025',
        description: 'A comprehensive tech conference',
        overview: 'Overview of the conference',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco, CA',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers and Tech Enthusiasts',
        agenda: ['Keynote', 'Workshops', 'Networking'],
        organizer: 'Tech Corp',
        tags: ['tech', 'conference', 'networking'],
      };

      const event = await Event.create(eventData);

      expect(event.title).toBe(eventData.title);
      expect(event.description).toBe(eventData.description);
      expect(event.overview).toBe(eventData.overview);
      expect(event.image).toBe(eventData.image);
      expect(event.venue).toBe(eventData.venue);
      expect(event.location).toBe(eventData.location);
      expect(event.date).toBe(eventData.date);
      expect(event.time).toBe(eventData.time);
      expect(event.mode).toBe(eventData.mode);
      expect(event.audience).toBe(eventData.audience);
      expect(event.agenda).toEqual(eventData.agenda);
      expect(event.organizer).toBe(eventData.organizer);
      expect(event.tags).toEqual(eventData.tags);
      expect(event.createdAt).toBeDefined();
      expect(event.updatedAt).toBeDefined();
    });

    it('should fail validation when required title is missing', async () => {
      const eventData = {
        description: 'A comprehensive tech conference',
        overview: 'Overview of the conference',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco, CA',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      await expect(Event.create(eventData)).rejects.toThrow();
    });

    it('should fail validation when required description is missing', async () => {
      const eventData = {
        title: 'Tech Conference 2025',
        overview: 'Overview of the conference',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco, CA',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      await expect(Event.create(eventData)).rejects.toThrow();
    });

    it('should fail validation when required overview is missing', async () => {
      const eventData = {
        title: 'Tech Conference 2025',
        description: 'A comprehensive tech conference',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco, CA',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      await expect(Event.create(eventData)).rejects.toThrow();
    });

    it('should fail validation when required image is missing', async () => {
      const eventData = {
        title: 'Tech Conference 2025',
        description: 'A comprehensive tech conference',
        overview: 'Overview of the conference',
        venue: 'Convention Center',
        location: 'San Francisco, CA',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      await expect(Event.create(eventData)).rejects.toThrow();
    });

    it('should fail validation when required venue is missing', async () => {
      const eventData = {
        title: 'Tech Conference 2025',
        description: 'A comprehensive tech conference',
        overview: 'Overview of the conference',
        image: 'https://example.com/image.jpg',
        location: 'San Francisco, CA',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      await expect(Event.create(eventData)).rejects.toThrow();
    });

    it('should fail validation when mode is invalid', async () => {
      const eventData = {
        title: 'Tech Conference 2025',
        description: 'A comprehensive tech conference',
        overview: 'Overview of the conference',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco, CA',
        date: '2025-12-25',
        time: '18:30',
        mode: 'invalid-mode' as any,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      await expect(Event.create(eventData)).rejects.toThrow();
    });

    it('should accept "online" as a valid mode', async () => {
      const eventData = {
        title: 'Online Workshop',
        description: 'Virtual workshop',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Zoom',
        location: 'Virtual',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session 1'],
        organizer: 'Tech Corp',
      };

      const event = await Event.create(eventData);
      expect(event.mode).toBe('online');
    });

    it('should accept "offline" as a valid mode', async () => {
      const eventData = {
        title: 'In-Person Meetup',
        description: 'Physical meetup',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Coffee Shop',
        location: 'Downtown',
        date: '2025-12-25',
        time: '18:30',
        mode: 'offline' as const,
        audience: 'Developers',
        agenda: ['Session 1'],
        organizer: 'Tech Corp',
      };

      const event = await Event.create(eventData);
      expect(event.mode).toBe('offline');
    });

    it('should trim whitespace from title', async () => {
      const eventData = {
        title: '  Tech Conference 2025  ',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      const event = await Event.create(eventData);
      expect(event.title).toBe('Tech Conference 2025');
    });

    it('should trim whitespace from description', async () => {
      const eventData = {
        title: 'Conference',
        description: '  A comprehensive conference  ',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      const event = await Event.create(eventData);
      expect(event.description).toBe('A comprehensive conference');
    });

    it('should trim whitespace from tags', async () => {
      const eventData = {
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
        tags: ['  tech  ', '  conference  '],
      };

      const event = await Event.create(eventData);
      expect(event.tags).toEqual(['tech', 'conference']);
    });
  });

  describe('Slug Generation', () => {
    it('should auto-generate slug from title on creation', async () => {
      const eventData = {
        title: 'Tech Conference 2025',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      const event = await Event.create(eventData);
      expect(event.slug).toBe('tech-conference-2025');
    });

    it('should handle special characters in slug generation', async () => {
      const eventData = {
        title: 'Tech & AI Conference 2025!',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Convention Center',
        location: 'San Francisco',
        date: '2025-12-25',
        time: '18:30',
        mode: 'hybrid' as const,
        audience: 'Developers',
        agenda: ['Keynote'],
        organizer: 'Tech Corp',
      };

      const event = await Event.create(eventData);
      expect(event.slug).toBe('tech-ai-conference-2025');
    });

    it('should update slug when title is modified', async () => {
      const event = await Event.create({
        title: 'Original Title',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.slug).toBe('original-title');

      event.title = 'Updated Title';
      await event.save();

      expect(event.slug).toBe('updated-title');
    });

    it('should not update slug when other fields are modified', async () => {
      const event = await Event.create({
        title: 'Tech Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      const originalSlug = event.slug;
      event.description = 'Updated Description';
      await event.save();

      expect(event.slug).toBe(originalSlug);
    });

    it('should enforce unique slug constraint', async () => {
      await Event.create({
        title: 'Tech Conference',
        description: 'Description 1',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      await expect(
        Event.create({
          title: 'Tech Conference',
          description: 'Description 2',
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
        })
      ).rejects.toThrow();
    });
  });

  describe('Date Normalization', () => {
    it('should normalize date to YYYY-MM-DD format', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '12/25/2025',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.date).toBe('2025-12-25');
    });

    it('should handle ISO date string format', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25T10:30:00.000Z',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.date).toBe('2025-12-25');
    });

    it('should reject invalid date format', async () => {
      await expect(
        Event.create({
          title: 'Conference',
          description: 'Description',
          overview: 'Overview',
          image: 'https://example.com/image.jpg',
          venue: 'Venue',
          location: 'Location',
          date: 'invalid-date',
          time: '18:30',
          mode: 'online' as const,
          audience: 'Developers',
          agenda: ['Session'],
          organizer: 'Organizer',
        })
      ).rejects.toThrow('Invalid date format');
    });

    it('should normalize date when modified', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      event.date = '01/15/2026';
      await event.save();

      expect(event.date).toBe('2026-01-15');
    });
  });

  describe('Time Normalization', () => {
    it('should normalize time to HH:mm 24-hour format', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '6:30 PM',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('18:30');
    });

    it('should handle AM times correctly', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '9:30 AM',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('09:30');
    });

    it('should handle 12:00 PM (noon) correctly', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '12:00 PM',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('12:00');
    });

    it('should handle 12:00 AM (midnight) correctly', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '12:00 AM',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('00:00');
    });

    it('should handle 24-hour format without conversion', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('18:30');
    });

    it('should handle time without colon', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '1830',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('18:30');
    });

    it('should pad single-digit hours', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '9:30 AM',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('09:30');
    });

    it('should reject invalid time format', async () => {
      await expect(
        Event.create({
          title: 'Conference',
          description: 'Description',
          overview: 'Overview',
          image: 'https://example.com/image.jpg',
          venue: 'Venue',
          location: 'Location',
          date: '2025-12-25',
          time: 'invalid-time',
          mode: 'online' as const,
          audience: 'Developers',
          agenda: ['Session'],
          organizer: 'Organizer',
        })
      ).rejects.toThrow('Time must be in HH:mm or valid format');
    });

    it('should reject time with invalid hour (>23)', async () => {
      await expect(
        Event.create({
          title: 'Conference',
          description: 'Description',
          overview: 'Overview',
          image: 'https://example.com/image.jpg',
          venue: 'Venue',
          location: 'Location',
          date: '2025-12-25',
          time: '25:30',
          mode: 'online' as const,
          audience: 'Developers',
          agenda: ['Session'],
          organizer: 'Organizer',
        })
      ).rejects.toThrow('Invalid hour');
    });

    it('should handle edge case: 1:00 PM', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '1:00 PM',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.time).toBe('13:00');
    });
  });

  describe('Timestamps', () => {
    it('should automatically set createdAt and updatedAt on creation', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt when document is modified', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      const originalUpdatedAt = event.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 10));

      event.description = 'Updated Description';
      await event.save();

      expect(event.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Array Fields', () => {
    it('should handle empty agenda array', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: [],
        organizer: 'Organizer',
      });

      expect(event.agenda).toEqual([]);
    });

    it('should handle multiple agenda items', async () => {
      const agenda = ['Registration', 'Keynote', 'Break', 'Workshop', 'Closing'];
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda,
        organizer: 'Organizer',
      });

      expect(event.agenda).toEqual(agenda);
    });

    it('should handle empty tags array', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
        tags: [],
      });

      expect(event.tags).toEqual([]);
    });

    it('should handle event without tags field', async () => {
      const event = await Event.create({
        title: 'Conference',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.tags).toBeDefined();
    });
  });

  describe('Model Operations', () => {
    it('should find event by slug', async () => {
      await Event.create({
        title: 'Tech Conference 2025',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      const event = await Event.findOne({ slug: 'tech-conference-2025' });
      expect(event).toBeTruthy();
      expect(event?.title).toBe('Tech Conference 2025');
    });

    it('should find events by mode', async () => {
      await Event.create({
        title: 'Online Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      await Event.create({
        title: 'Offline Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-26',
        time: '18:30',
        mode: 'offline' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      const onlineEvents = await Event.find({ mode: 'online' });
      expect(onlineEvents).toHaveLength(1);
      expect(onlineEvents[0].title).toBe('Online Event');
    });

    it('should update an event', async () => {
      const event = await Event.create({
        title: 'Original Title',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      event.title = 'Updated Title';
      event.venue = 'New Venue';
      await event.save();

      const updated = await Event.findById(event._id);
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.venue).toBe('New Venue');
    });

    it('should delete an event', async () => {
      const event = await Event.create({
        title: 'Event to Delete',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      await Event.findByIdAndDelete(event._id);

      const deleted = await Event.findById(event._id);
      expect(deleted).toBeNull();
    });

    it('should search events by tags', async () => {
      await Event.create({
        title: 'JavaScript Workshop',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
        tags: ['javascript', 'workshop', 'frontend'],
      });

      const events = await Event.find({ tags: 'javascript' });
      expect(events).toHaveLength(1);
      expect(events[0].title).toBe('JavaScript Workshop');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long title', async () => {
      const longTitle = 'A'.repeat(500);
      const event = await Event.create({
        title: longTitle,
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.title).toBe(longTitle);
    });

    it('should handle Unicode characters in title', async () => {
      const event = await Event.create({
        title: 'کنفرانس فناوری 2025 🚀',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2025-12-25',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.title).toBe('کنفرانس فناوری 2025 🚀');
    });

    it('should handle leap year date', async () => {
      const event = await Event.create({
        title: 'Leap Year Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2024-02-29',
        time: '18:30',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.date).toBe('2024-02-29');
    });

    it('should handle year 2000+ dates', async () => {
      const event = await Event.create({
        title: 'Future Event',
        description: 'Description',
        overview: 'Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Venue',
        location: 'Location',
        date: '2099-12-31',
        time: '23:59',
        mode: 'online' as const,
        audience: 'Developers',
        agenda: ['Session'],
        organizer: 'Organizer',
      });

      expect(event.date).toBe('2099-12-31');
      expect(event.time).toBe('23:59');
    });
  });
});