require("dotenv").config();
const mongoose = require("mongoose");
const dbhost = process.env.DATABASE_HOST

mongoose
    .connect(`${dbhost}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).catch(err => {
    console.log("------------------Cannot connect to the database!-----------------------------------", err);
    process.exit();
  });
mongoose.connection.on("open", () => console.log("MongoDB connected"));

// export mongoose to access via router.
module.exports = mongoose;
