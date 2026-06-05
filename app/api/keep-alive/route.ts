import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        

        if(mongoose.connection.readyState !== 1){
            await mongoose.connect(process.env.MONGODB_URI as string)
        }
        await mongoose.connection.db?.admin().ping()

        return NextResponse.json(
            {message: "MongoDB and vercel are active!"},
            {status: 200}
        )
    } catch (error) {
        return NextResponse.json(
            {error: 'Failed to keep alive'},
            {status: 500}
        )
    }
}