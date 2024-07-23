import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const dir: string = data.get("dir") as string;

  console.log(data)
  if (!file) {
    return NextResponse.json(
      { success: false, message: "File or Image not found"}, 
      { status: 404 });
  }

  const re = /(?:\.([^.]+))?$/;
  const fileExt = re.exec(file.name)?.[0];
  const fileLocation = `${dir}/${randomUUID()}${fileExt}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
      },
    });
    const bucket = storage.bucket(process.env.BUCKET_NAME!);
    const blob = bucket.file(fileLocation);

    await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        reject(err);
      });

      blobStream.on("finish", async () => {
        try {
          await bucket.file(fileLocation).makePublic();
          resolve(null);
        } catch (error) {
          reject(error);
        }
      });

      blobStream.end(buffer);
    });

    return NextResponse.json(
      { success: true, message: "upload file success!", data: fileLocation },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "failed to upload file",
    },
    { status: 500 });
  }
}
