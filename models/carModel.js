const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    reg_no: { type: String, required: true, unique: true }, // Added unique constraint for registration number
    fuelType: { type: String, required: true },
    rental_price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    bookings: [
        {
            customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            bookedAt: { type: Date, default: Date.now } // Optional: Timestamp for when the booking was made
        }
    ],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { 
            type: [Number], 
            required: true, 
            validate: {
                validator: function(v) {
                    return v.length === 2; // Ensure there are two coordinates (longitude, latitude)
                },
                message: props => `${props.value} is not a valid coordinate pair!`
            }
        }
    }
});

// Ensure we have a 2dsphere index for geospatial queries
carSchema.index({ location: "2dsphere" });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
