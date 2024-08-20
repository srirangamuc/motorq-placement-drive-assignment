const mongoose = require("mongoose")
const {v4:uuidv4} = require("uuid")

class User{
    constructor(name,email,password,role='normal'){
        this.name = name
        this.email = email
        this.password = password
        this.role = role
    }
    static getSchema(){
        return new mongoose.Schema({
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true,
                unique:true
            },
            password:{
                type:String,
                required:true
            },
            customerId:{
                type:String,
                required:true,
                unique:true,
                default:uuidv4
            },
            contact:{
                phone:{
                    type:String,
                    required:true
                },
                email:{
                    type:String,
                    required:true
                }
            },
            drive_license:{
                type:String,
                require:true
            },
            role:{
                type:String,
                enum:['admin','customer'],
                default:'customer'
            }
        })
    }
    static getModel(){
        return mongoose.model('User',User.getSchema())
    }
}

module.exports = User.getModel()
