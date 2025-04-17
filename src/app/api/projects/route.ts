import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
    const {title,description,githubUrl,liveUrl,image} = await req.json();

    try{
        const newProject =await prisma.project.create({
         data:{  
            title,
            description,
            githubUrl,
            liveUrl,
            image,
        }
        });
        return NextResponse.json(newProject,{status:201});
    }
    catch(error){
        return NextResponse.json(error,{status:500});
    }
}

export async function GET() {
    try{
        const projects = await prisma.project.findMany();
        return NextResponse.json(projects,{status:201});
    }catch(error){
        return NextResponse.json(error,{status:500});
    }
    
}