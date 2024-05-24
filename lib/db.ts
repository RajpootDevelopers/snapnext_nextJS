import mongoose, { Connection } from "mongoose";

export async function connectToMongoDB() {

    let cachedConnection:Connection | null = null;
    if(cachedConnection){
        console.log("Using cashed MongoDB connection")
        return cachedConnection;
    }

    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI as string)
        cachedConnection = conn.connection;
        console.log("New Connection Of MongDB is established.")
        return cachedConnection;

    }catch(err){
        console.log(err)
        throw err
    }
    
}