import  connectDB  from "@/lib/mongodb";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

export async function POST(req :NextRequest) {
    try{
        await connectDB;
        const formData = await req.formData();
        let event;
        try{
            event = Object.fromEntries(formData.entries());
        }
        catch(e){
        console.log(e);
        return NextResponse.json({message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown Error'}, {status: 400}) 
    }

    const createEvent = await Event.create(event);
    return NextResponse.json({message : 'Event Created Successfully' , event: createEvent}, {status: 201});
    }
    catch(e){
        console.log(e);
        return NextResponse.json({message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown Error'},{status: 400}) 
    }
}