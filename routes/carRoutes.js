const express = require("express");
const Car = require("../models/carModel");
const router = express.Router();
const { isAdmin } = require("../middlewares/authForAdmin");
let io;

const setIo = (ioInstance)=>{
    io = ioInstance
}
// Middleware to check if the user is an admin
router.use("/admin/*", isAdmin);

// Add a new car (Admin only)
router.post("/admin/cars", async (req, res) => {
    try {
        const { make, model, year, reg_no, fuelType, rental_price, latitude, longitude } = req.body;

        // Check if reg_no is provided
        if (!reg_no) {
            return res.status(400).send("Registration number can't be null");
        }

        // Check if the registration number already exists in the database
        const existingCar = await Car.findOne({ reg_no });
        if (existingCar) {
            return res.status(400).send("A car with this registration number already exists.");
        }

        // Create and save the new car
        const newCar = new Car({
            make,
            model,
            year,
            reg_no,
            fuelType,
            rental_price,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
        });

        await newCar.save();
        res.redirect("/admin/cars");
    } catch (error) {
        console.error("Error adding new car:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Get all cars (Admin only)
router.get("/admin/cars", async (req, res) => {
    try {
        const cars = await Car.find();
        res.render("adminCars", { cars });
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Update car details (Admin only)
// Update car details (Admin only)
router.post("/admin/cars/:id/update", async (req, res) => {
    const { id } = req.params;
    const { make, model, year, reg_no, fuelType, rental_price, latitude, longitude, startDate, endDate, isAvailable } = req.body;
    try {
        // Convert startDate and endDate to Date objects if they are provided
        const updateData = {
            make,
            model,
            year,
            reg_no,
            fuelType,
            rental_price,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            isAvailable: isAvailable === 'on'  // Convert checkbox value to boolean
        };

        if (startDate) {
            updateData.startDate = new Date(startDate);
        }
        
        if (endDate) {
            updateData.endDate = new Date(endDate);
        }
        await Car.findByIdAndUpdate(id, updateData);
        res.redirect('/admin/cars');
    } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Get the car details for updating (Admin only)
router.get("/admin/cars/:id/update", async (req, res) => {
    const { id } = req.params;
    try {
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).send("Car not found");
        }
        res.render("updateCar", { car });
    } catch (error) {
        console.error("Error fetching car details:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Delete a car (Admin only)
router.post("/admin/cars/:id/delete", async (req, res) => {
    const { id } = req.params;
    try {
        await Car.findByIdAndDelete(id);
        res.redirect("/admin/cars");
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to view all cars (accessible to customers)
router.get("/cars", async (req, res) => {
    const {make,model,fuelType,minRent,maxRent,startDate,endDate} = req.query
    const query = {isAvailable:true}

    if(make) query.make = make;
    if(model) query.model = model
    if(fuelType) query.fuelType = fuelType
    if (minRent) query.rental_price = {$gte:minRent}
    if (maxRent) query.rental_price = {...query.rental_price,$lte:maxRent}

    try {
        const cars = await Car.find(query);
        res.render("customerCars", { cars,startDate: startDate|| "",endDate: endDate|| "" });
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to book a car (accessible to customers)
router.post("/cars/:id/book", async (req, res) => {
    const { id } = req.params;
    try {
        const car = await Car.findById(id);
        
        if (!car || !car.isAvailable) {
            return res.status(400).send("Car is not available for booking.");
        }

        // Update the car to mark it as unavailable
        car.isAvailable = false;
        await car.save();

        const io = req.app.get("socketio")
        io.emit("carBooked",{carId:id})
        
        res.redirect("/cars"); // Redirect to the list of cars or a booking confirmation page
    } catch (error) {
        console.error("Error booking car:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/maps',async(req,res)=>{
    try{
        const cars = await Car.find()
        const cars_loc = cars.map(car=>({
            lat:car.location.coordinates[1],
            lng:car.location.coordinates[0],
            status: car.isAvailable ? 'Available':'In trip'
        }))
        res.render("mapLocation",{cars_loc})
    }
    catch(error){
        console.error("Error fetching cars:", error);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = {router,setIo};
