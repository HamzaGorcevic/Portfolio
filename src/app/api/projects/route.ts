import { PrismaClient } from "@/generated/prisma";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { error } from "console";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { v4 } from "uuid";
const prisma = new PrismaClient();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString || !containerName){
    throw new Error("Connection strings not provided");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
let blocContainer = blobServiceClient.getContainerClient(containerName);
if(!blocContainer){
    await blobServiceClient.createContainer(containerName)
    blocContainer = blobServiceClient.getContainerClient(containerName);
}

export async function POST(req:NextRequest) {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get('description') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const imageFile = formData.get('image') as File

    let image = '';
    if (imageFile){
        const fileName = `${v4()}.${imageFile.name.split(".").pop()}`;
        const blockBlobClient = blocContainer.getBlockBlobClient(fileName)
        const buffer = await imageFile.arrayBuffer();

        await blockBlobClient.uploadData(buffer);
        image = blockBlobClient.url;
    }

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