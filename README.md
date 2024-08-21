# Car Rental Management System

## (Video Demo)[https://drive.google.com/file/d/10PKPp2uHmbt8B_RuWRwtEUxG8i57n8x2/view?usp=drive_link]

## Overview

This project is a Car Rental Management System that allows both administrators and customers to manage and book vehicles. The system provides functionalities for car inventory management, vehicle booking, trip management, and conflict management. It also includes real-time vehicle availability tracking on a map.

## Features

### 1. Car Inventory Management (Administrator's Perspective)
- **Add a Car:** Admins can add new cars to the system with details such as make, model, year, license number, rent rate, and location.
- **View Car Inventory:** Admins can view the list of all cars in the inventory, with options to edit or delete car details.

### 2. Vehicle Booking (Customer's Perspective)
- **Search and Filter Cars:** Customers can search for available cars based on location, dates, car type, and price range.
- **Book a Car:** Customers can select a car, choose the rental period, and confirm the booking. Upon booking, a confirmation email is sent to the customer.

### 3. Trip Management (Customer's Perspective)
- **Manage Active Trips:** Customers can view their active bookings, including details such as the car, rental period, and booking status.
- **Start a Ride:** When a customer starts a booked ride, the car's status changes to "InTrip", and it is reflected in both the customer and admin interfaces.

### 4. Conflict Management (Administrator's Perspective)
- **Handle Booking Conflicts:** The system prevents booking conflicts by ensuring that a car cannot be booked by multiple customers for overlapping periods.
- **Booking Lock Mechanism:** If multiple customers attempt to book the same vehicle simultaneously, the system locks the booking for the first customer who completes it.

### 5. Vehicle Availability and Location (Administrator's Perspective)
- **Real-Time Inventory Availability:** Admins can view the real-time availability of cars, including their current status (e.g., "In Garage", "InTrip").
- **Map View:** Admins and customers can view a map that shows the real-time location of all cars, with markers color-coded based on availability.

### 6. Email Notifications
- **Booking Confirmation Emails:** Upon successful booking, customers receive a confirmation email with details about their booking.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Frontend:** EJS templating engine, HTML, CSS
- **Real-time Communication:** Socket.io (for real-time map updates)
- **Email:** Nodemailer for sending booking confirmation emails
- **Map Integration:** Leaflet.js or Google Maps API (depending on your implementation)

## Project Structure

/models
userModel.js # Mongoose model for User
carModel.js # Mongoose model for Car
bookingModel.js # Mongoose model for Booking

/routes
carRoutes.js # Routes for car-related operations
userRoutes.js # Routes for user-related operations

/views
index.ejs # Home page
dashboard.ejs # Admin dashboard
customerCar.ejs # Customer car booking page

/public
/css # CSS files for styling
/js # JavaScript files for frontend logic

/app.js # Main server file


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-url.git
   cd your-repository-folder

2. Install Dependencies
  ```bash
  npm install

3. Start the Server
    ```bash
    npm start

## Usage 
### Admin Login
- Sign up as an admin user via the /signup page.
- Once signed up, log in at /login to access the admin dashboard.
- Use the dashboard to manage car inventory and view bookings.
### Customer Interface
- Sign up as a customer via the /signup page.
- Log in and use the search and filter options to find available cars.
- Book a car by selecting a vehicle and rental period. A confirmation email will be sent upon successful booking.
### Map View
View the map on the customer or to see real-time vehicle locations.
### Known Issues
- The email notification system is set up for Gmail. If using another service, modify the nodemailer configuration.
- Real-time updates for car locations rely on socket.io. Ensure the server is correctly broadcasting updates.
### Future Enhancements
- Payment Integration: Add a payment gateway for processing car rental payments.
- Enhanced Filtering: Improve search filters with more criteria, like car features.
- Mobile Responsiveness: Optimize the user interface for mobile devices.
- Reports: Add a reporting feature for admins to view booking statistics.
