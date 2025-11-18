# Test Suite Documentation

This directory contains comprehensive unit tests for the DevEvent application.

## Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Test Files

- `database/event.model.test.ts` - Event model tests (200+ assertions)
- `database/booking.model.test.ts` - Booking model tests (150+ assertions)
- `lib/mongodb.test.ts` - MongoDB connection tests (100+ assertions)

## Test Coverage

The test suite provides comprehensive coverage including:
- Schema validation
- Data normalization
- Relationship validation
- Error handling
- Edge cases
- Concurrent operations