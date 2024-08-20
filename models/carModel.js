const mongoose = require("mongoose")

class Car{
    constructor(make,model,year,reg_no,fuelType,rent_price,isAvailale){
        this.make = make;
        this.model = model;
        this.year = year;
        this.reg_no = reg_no;
        this.fuelType = fuelType;
        this.rent_price = rent_price;
        this.isAvailable = isAvailale;
    }
    static getSchema(){
        return new mongoose.Schema({
            make:{
                type:String,
                required:true
            },
            model:{
                type:String,
                required:true
            },
            year:{
                type:Number,
                required:true
            },
            reg_number:{
                type:String,
                required:true,
                unique:true
            },
            fuelType:{
                type:String,
                required:true
            },
            rental_price:{
                type:Number,
                required:true
            },
            isAvailable:{
                type:Boolean,
                default:true
            }
        })
    }
    static getModel(){
        return mongoose.model('Car',Car.getSchema());
    }
}

module.exports = Car.getModel()