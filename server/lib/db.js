import mongoose from "mongoose";

//connection to mongodb

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/chitchatter`);
    } catch (error) {
        console.log(error);
    }
}