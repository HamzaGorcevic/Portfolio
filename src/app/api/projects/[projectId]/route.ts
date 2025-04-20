// src/app/api/projects/[projectId]/route.ts
import { PrismaClient } from "@/generated/prisma";
import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";

const prisma = new PrismaClient();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString || !containerName) {
    throw new Error("Connection strings not provided");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
let blocContainer = blobServiceClient.getContainerClient(containerName);

interface Params {
    projectId: string;
}

export async function PUT(
    req: NextRequest,
    { params }: { params:Promise<{projectId:string}> }
) {
    const projectId  = (await params).projectId

    if (!projectId) {
        return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get('description') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const imageFile = formData.get('image') as File;
    const technologies = formData.get('technologies') as string;

    // Fetch existing project to keep the current image if no new one is uploaded
    const project = await prisma.project.findFirst({
        where: { id: parseInt(projectId) },
    });

    // Ensure the project exists before trying to access its image
    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let image = project.image;  // Access the 'image' property of the project

    if (imageFile && typeof(imageFile) != 'string') {
        // If a new image is uploaded, generate a new image URL
        const fileName = `${v4()}.${imageFile.name.split(".").pop()}`;
        const blockBlobClient = blocContainer.getBlockBlobClient(fileName);
        const buffer = await imageFile.arrayBuffer();

        await blockBlobClient.uploadData(buffer);
        image = blockBlobClient.url;
    }

    try {
        const updatedProject = await prisma.project.update({
            where: {
                id: parseInt(projectId),
            },
            data: {
                title,
                description,
                githubUrl,
                liveUrl,
                image,
                technologies
            },
        });

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params:Promise<{projectId:string}> }
) {
    const projectId  = (await params).projectId;

    if (!projectId) {
        return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    try {
        // First, get the project to delete the image from Azure Blob Storage
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId) },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (project.image) {
            // Delete the image from Azure Storage
            const blockBlobClient = blocContainer.getBlockBlobClient(
                project.image.split('/').pop()!
            );
            try{
                await blockBlobClient.delete();
            }catch(error){
                console.log(error);
            }
        }

        // Now, delete the project from the database
        await prisma.project.delete({
            where: { id: parseInt(projectId) },
        });

        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}