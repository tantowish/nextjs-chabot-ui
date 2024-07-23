import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

interface TextPart {
    type: 'text';
    text: string;
}

interface ImagePart {
    type: 'image';
    image: string;
}

export async function POST(req: NextRequest) {
    try {
        const { messages, data } = await req.json();
        console.log(data);

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse('Missing OpenAI API Key.', { status: 400 });
        }

        let response;
        console.log('Getting GPT response (default)');

        if (data != null && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) {
            console.log("Response gambar");
            console.log(data);
            
            const initialMessages = messages.slice(0, -1);
            const currentMessage = messages[messages.length - 1];

            const content: (TextPart | ImagePart)[] = [];
            content.push({ type: 'text', text: currentMessage.content });
            Object.keys(data).forEach(key => {
                const imageUrl = data[key];
                const imageURL = `https://storage.googleapis.com/digman-dev/${imageUrl}`;

                console.log(imageURL);

                content.push({ type: 'image', image: new URL(imageURL).toString() });
            });

            response = await streamText({
                model: openai('gpt-4o'),
                messages: [
                    ...convertToCoreMessages(initialMessages),
                    {
                        role: 'user',
                        content: content
                    }
                ]
            });
        } else {
            console.log("Response tanpa");
            response = await streamText({
                model: openai('gpt-4o'),
                messages,
            });
        }

        return response.toAIStreamResponse();

    } catch (error: any) {
        return new NextResponse(error.message || 'Something went wrong!', {
            status: 500
        });
    }
}
