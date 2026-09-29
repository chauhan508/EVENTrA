const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Coding Competition', 'Hackathon', 'Workshop', 'Competition', 'Technical Session'],
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 300
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    registrationOpen: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual for checking if deadline has passed
eventSchema.virtual('isPastDeadline').get(function () {
  return new Date() > new Date(this.registrationDeadline);
});

// Virtual for active registration status
eventSchema.virtual('isRegistrationAvailable').get(function () {
  return this.registrationOpen && new Date() <= new Date(this.registrationDeadline);
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
