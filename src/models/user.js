const mongoose = require("../config/db.config");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { boolean } = require("yup");

const userSchema = new Schema({
    _id: {type:String, unique:true},
    firstname: {
        type: String,
        required: "Firstname is required",
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: "Lastname is required",
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: "Email is required",
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    verifiedStatus: {
        type : Boolean,
        default: false
    },  token : {
        type: String,
        default: null
    }
})

// deleting unwanted data from response
userSchema.methods.toJSON = function () {
    const obj = this.toObject({versionKey:false}); // versionKey: false prevents the version key generated by mongodb to be displayed in the response sent.
    delete obj.password;
    return obj
}

// compare email in database with new email
userSchema.statics.emailExist = async function (email) {
  return await this.findOne({ email });
};

// compare password in database with new password
userSchema.methods.comparePassword = async function (password) {
      return await bcrypt.compareSync(password, this.password);
};

// Function to generate verification token
userSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id , email:user.email},
        process.env.TOKEN_KEY,
        { expiresIn: "900000" }
    );
    return verificationToken;
};

const user = mongoose.model('user', userSchema);
module.exports = user