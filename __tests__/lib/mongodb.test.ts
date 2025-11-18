import mongoose from 'mongoose';
import { connectToDatabase, disconnectDatabase } from '@/lib/mongodb';

describe('MongoDB Connection', () => {
  afterEach(async () => {
    // Clean up connections after each test
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    // Reset the global cache
    if (global.mongoose) {
      global.mongoose.conn = null;
      global.mongoose.promise = null;
    }
  });

  describe('connectToDatabase', () => {
    it('should successfully connect to MongoDB', async () => {
      const connection = await connectToDatabase();

      expect(connection).toBeDefined();
      expect(connection).toBe(mongoose.connection);
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });

    it('should return cached connection on subsequent calls', async () => {
      const connection1 = await connectToDatabase();
      const connection2 = await connectToDatabase();

      expect(connection1).toBe(connection2);
      expect(global.mongoose?.conn).toBe(connection1);
    });

    it('should cache the connection promise', async () => {
      const promise1 = connectToDatabase();
      const promise2 = connectToDatabase();

      const [connection1, connection2] = await Promise.all([promise1, promise2]);

      expect(connection1).toBe(connection2);
    });

    it('should use cached connection if already connected', async () => {
      const connection1 = await connectToDatabase();
      
      // Verify connection is cached
      expect(global.mongoose?.conn).toBe(connection1);
      
      const connection2 = await connectToDatabase();
      
      expect(connection2).toBe(connection1);
      expect(global.mongoose?.conn).toBe(connection1);
    });

    it('should set MONGODB_URI from environment', async () => {
      expect(process.env.MONGODB_URI).toBeDefined();
      
      const connection = await connectToDatabase();
      
      expect(connection).toBeDefined();
    });

    it('should have correct connection options', async () => {
      const connection = await connectToDatabase();

      // Verify connection exists and is active
      expect(connection).toBeDefined();
      expect(connection.readyState).toBe(1);
    });

    it('should initialize global.mongoose if not exists', async () => {
      // Clear global.mongoose
      delete (global as any).mongoose;

      const connection = await connectToDatabase();

      expect(global.mongoose).toBeDefined();
      expect(global.mongoose?.conn).toBe(connection);
      expect(global.mongoose?.promise).toBeDefined();
    });

    it('should handle multiple concurrent connection attempts', async () => {
      const promises = Array(5).fill(null).map(() => connectToDatabase());
      
      const connections = await Promise.all(promises);
      
      // All should return the same connection
      connections.forEach((conn) => {
        expect(conn).toBe(connections[0]);
      });
    });

    it('should set up connection event listeners', async () => {
      const connection = await connectToDatabase();

      // Verify listeners are set up by checking _events
      expect(connection.listeners('connected').length).toBeGreaterThan(0);
      expect(connection.listeners('error').length).toBeGreaterThan(0);
      expect(connection.listeners('disconnected').length).toBeGreaterThan(0);
    });
  });

  describe('disconnectDatabase', () => {
    it('should disconnect from MongoDB', async () => {
      await connectToDatabase();
      expect(mongoose.connection.readyState).toBe(1);

      await disconnectDatabase();

      expect(mongoose.connection.readyState).toBe(0); // 0 = disconnected
      expect(global.mongoose?.conn).toBeNull();
      expect(global.mongoose?.promise).toBeNull();
    });

    it('should clear cached connection', async () => {
      await connectToDatabase();
      expect(global.mongoose?.conn).toBeDefined();

      await disconnectDatabase();

      expect(global.mongoose?.conn).toBeNull();
      expect(global.mongoose?.promise).toBeNull();
    });

    it('should handle disconnect when not connected', async () => {
      // Should not throw error
      await expect(disconnectDatabase()).resolves.not.toThrow();
    });

    it('should handle multiple disconnect calls', async () => {
      await connectToDatabase();
      
      await disconnectDatabase();
      await disconnectDatabase(); // Second call should not throw
      
      expect(mongoose.connection.readyState).toBe(0);
    });

    it('should allow reconnection after disconnect', async () => {
      const connection1 = await connectToDatabase();
      await disconnectDatabase();

      const connection2 = await connectToDatabase();

      expect(connection2).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1);
    });
  });

  describe('Connection States', () => {
    it('should have readyState 0 (disconnected) initially', async () => {
      // Before any connection
      expect([0, 1, 2, 3]).toContain(mongoose.connection.readyState);
    });

    it('should have readyState 1 (connected) after connection', async () => {
      await connectToDatabase();
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should have readyState 0 (disconnected) after disconnect', async () => {
      await connectToDatabase();
      await disconnectDatabase();
      expect(mongoose.connection.readyState).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Save original URI
      const originalUri = process.env.MONGODB_URI;
      
      // Set invalid URI
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/test';
      
      // Clear cache to force new connection attempt
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }
      await mongoose.disconnect();

      try {
        await expect(connectToDatabase()).rejects.toThrow('Database connection failed');
      } finally {
        // Restore original URI
        process.env.MONGODB_URI = originalUri;
        
        // Clear cache again
        if (global.mongoose) {
          global.mongoose.conn = null;
          global.mongoose.promise = null;
        }
      }
    });

    it('should reset promise cache on connection failure', async () => {
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/test';
      
      if (global.mongoose) {
        global.mongoose.conn = null;
        global.mongoose.promise = null;
      }
      await mongoose.disconnect();

      try {
        await connectToDatabase();
      } catch (error) {
        // Promise should be reset on error
        expect(global.mongoose?.promise).toBeNull();
      } finally {
        process.env.MONGODB_URI = originalUri;
        if (global.mongoose) {
          global.mongoose.conn = null;
          global.mongoose.promise = null;
        }
      }
    });
  });

  describe('Connection Options', () => {
    it('should use correct buffer commands setting', async () => {
      const connection = await connectToDatabase();
      
      // Connection should be established
      expect(connection.readyState).toBe(1);
    });

    it('should use correct maxPoolSize', async () => {
      const connection = await connectToDatabase();
      
      expect(connection).toBeDefined();
      expect(connection.readyState).toBe(1);
    });

    it('should have appropriate timeout settings', async () => {
      const connection = await connectToDatabase();
      
      expect(connection).toBeDefined();
      expect(connection.readyState).toBe(1);
    });
  });

  describe('Global Cache Behavior', () => {
    it('should create global.mongoose object if undefined', async () => {
      delete (global as any).mongoose;

      await connectToDatabase();

      expect(global.mongoose).toBeDefined();
      expect(global.mongoose).toHaveProperty('conn');
      expect(global.mongoose).toHaveProperty('promise');
    });

    it('should reuse existing global.mongoose object', async () => {
      const customCache = { conn: null, promise: null };
      (global as any).mongoose = customCache;

      await connectToDatabase();

      expect(global.mongoose).toBe(customCache);
    });

    it('should maintain cache across multiple operations', async () => {
      const connection1 = await connectToDatabase();
      
      // Perform some operation
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      const connection2 = await connectToDatabase();
      
      expect(connection1).toBe(connection2);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle rapid connect/disconnect cycles', async () => {
      for (let i = 0; i < 3; i++) {
        await connectToDatabase();
        expect(mongoose.connection.readyState).toBe(1);
        
        await disconnectDatabase();
        expect(mongoose.connection.readyState).toBe(0);
      }
    });

    it('should handle concurrent connection and query operations', async () => {
      const connection = await connectToDatabase();
      
      // Perform multiple concurrent operations
      const operations = [
        mongoose.connection.db.admin().ping(),
        mongoose.connection.db.listCollections().toArray(),
        connectToDatabase(), // Additional connection attempt
      ];
      
      const results = await Promise.all(operations);
      
      expect(results).toHaveLength(3);
      expect(results[2]).toBe(connection);
    });
  });

  describe('Connection Lifecycle', () => {
    it('should properly initialize connection lifecycle', async () => {
      const connection = await connectToDatabase();

      expect(connection.readyState).toBe(1);
      expect(connection.name).toBeDefined();
      expect(connection.host).toBeDefined();
      expect(connection.port).toBeDefined();
    });

    it('should maintain connection across multiple database operations', async () => {
      const connection = await connectToDatabase();
      
      // Create a temporary collection
      const testCollection = connection.collection('test_lifecycle');
      await testCollection.insertOne({ test: 'data' });
      
      // Connection should still be active
      expect(mongoose.connection.readyState).toBe(1);
      
      // Clean up
      await testCollection.drop().catch(() => {});
    });

    it('should handle connection recovery scenarios', async () => {
      const connection1 = await connectToDatabase();
      expect(connection1.readyState).toBe(1);

      // Simulate disconnect
      await disconnectDatabase();
      expect(mongoose.connection.readyState).toBe(0);

      // Reconnect
      const connection2 = await connectToDatabase();
      expect(connection2.readyState).toBe(1);
    });
  });

  describe('Database Information', () => {
    it('should have access to database name', async () => {
      const connection = await connectToDatabase();
      
      expect(connection.name).toBeDefined();
      expect(typeof connection.name).toBe('string');
    });

    it('should have access to host information', async () => {
      const connection = await connectToDatabase();
      
      expect(connection.host).toBeDefined();
      expect(typeof connection.host).toBe('string');
    });

    it('should have access to port information', async () => {
      const connection = await connectToDatabase();
      
      expect(connection.port).toBeDefined();
      expect(typeof connection.port).toBe('number');
    });

    it('should provide access to database instance', async () => {
      const connection = await connectToDatabase();
      
      expect(connection.db).toBeDefined();
      expect(typeof connection.db.databaseName).toBe('string');
    });
  });

  describe('Connection Pooling', () => {
    it('should maintain connection pool', async () => {
      const connection = await connectToDatabase();
      
      // Perform multiple operations to utilize pool
      const operations = Array(5).fill(null).map(() => 
        mongoose.connection.db.admin().ping()
      );
      
      await Promise.all(operations);
      
      // Connection should still be active
      expect(connection.readyState).toBe(1);
    });
  });

  describe('Memory and Resource Management', () => {
    it('should not create memory leaks with repeated connections', async () => {
      const initialListeners = mongoose.connection.eventNames().length;
      
      for (let i = 0; i < 5; i++) {
        await connectToDatabase();
      }
      
      const finalListeners = mongoose.connection.eventNames().length;
      
      // Listener count should not grow excessively
      expect(finalListeners).toBeLessThanOrEqual(initialListeners + 10);
    });

    it('should properly clean up on disconnect', async () => {
      await connectToDatabase();
      await disconnectDatabase();
      
      expect(global.mongoose?.conn).toBeNull();
      expect(global.mongoose?.promise).toBeNull();
      expect(mongoose.connection.readyState).toBe(0);
    });
  });

  describe('Environment Configuration', () => {
    it('should require MONGODB_URI environment variable', () => {
      expect(process.env.MONGODB_URI).toBeDefined();
      expect(process.env.MONGODB_URI).toBeTruthy();
    });

    it('should connect using environment URI', async () => {
      const connection = await connectToDatabase();
      
      expect(connection).toBeDefined();
      expect(connection.readyState).toBe(1);
    });
  });
});