import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const data = await request.formData();
  const fileLocation = data.get('fileLocation') as string

  try {
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
      },
    });
    const bucket = storage.bucket(process.env.BUCKET_NAME!);
    const file = bucket.file(fileLocation);

    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    await file.delete();

    return NextResponse.json(
      { success: true, message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete file" },
      { status: 500 }
    );
  }
}
