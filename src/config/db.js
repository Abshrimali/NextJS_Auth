import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const connection = mongoose.connection;
    connection.on("connected", () => { 
      console.log("MongoDB Connected");
    });

    connection.on("error", (err) => {
      console.log("Database Connection failed : " + err);
      process.exit();
    });

  } catch (error) {
    console.log(`Connectin Failed ${error}`);
  }
};
export default connectDB;
