const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    reg_no: { type: String, required: true},
    fuelType: { type: String, required: true },
    rental_price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    bookings: [
        {
            customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true }
        }
    ],
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
    }
});

carSchema.index({ location: "2dsphere" });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
