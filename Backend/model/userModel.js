
const mongoose = require("mongoose");



const schemaRules = {
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email should be unique"],
    },
    state : {
       type: String,
        required: [true, "state is required"], 
    },
    district : {
       type: String,
        required: [true, "district is required"], 
    },
    phone: {
        type:String,
         required: [true, "phone is required"], 
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [6, "password should be atleast of 6 length"],
    },
   confirmPassword: {
    type: String,
    minLength: 6,
    validate: {
        validator: function (el) {
            return el === this.password;
        },
        message: "Password and confirm password must match"
    }
},
    createdAt: {
        type: Date,
        default: Date.now()
    },
   
    
   
}

const userSchema = new mongoose.Schema(schemaRules);

/******hooks in mongodb********/
userSchema.pre("save", function (next) {
    // console.log("Pre save was called");
    this.confirmPassword = undefined;
    next();
})
userSchema.post("save", function () {
    console.log("post save was called");
    this.__v = undefined;
    this.password = undefined;
})
// final touch point
const UserModel = mongoose.model("User", userSchema);
// default export
module.exports = UserModel;
