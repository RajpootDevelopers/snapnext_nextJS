import mongoose, { Document, Model } from "mongoose";

export interface IUser{
    userName : string,
    fullName : string,
    email : string,
    avatar? : string
}

export interface IUserDocument extends IUser, Document{
    createdAt : Date;
    updatedAt : Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
    {
        userName : {
            type : String,
            required : true,
            unique : true,
        },
        fullName : {
            type : String,
            required : true,
        },
        email : {
            type : String,
            required : true, 
            unique : true,
        },
        avatar : {
            type : String,
            default : ""
        }
    },{
        // createdAt, updateAt
        timestamps : true
    }
)

// creating Model : 

const User:Model<IUserDocument> = mongoose.models?.User || mongoose.model("User", userSchema) 
export default User;