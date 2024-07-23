import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { FaFile } from 'react-icons/fa';
import { Input } from '../ui/input';
import TextareaAutosize from 'react-textarea-autosize';
import { IoIosSend } from "react-icons/io";
import { deleteBucket } from '@/lib/deleteBucket';
import { FilesId } from '../chat';
import { Message } from 'ai';
import Spinner from '../spinner';
import { uploadBucket } from '@/lib/uploadBucket';
import { saveChat } from '@/lib/saveChat';
import { Context } from '@/context/context';
import { Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

type props = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
    isLoading: boolean
    input: string,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
    filesId: FilesId[],
    setFilesId: Dispatch<SetStateAction<FilesId[]>>,
    files: File[],
    setFiles: Dispatch<SetStateAction<File[]>>,
    fileUploaded: Record<string, string>,
    setFileUploaded: Dispatch<SetStateAction<Record<string, string>>>,
    chatId: string | null,
    setChatId: Dispatch<SetStateAction<string | null>>
    messages: Message[]
}

export default function ChatForm({handleSubmit, isLoading, input, handleInputChange, filesId, setFilesId, files, setFiles, fileUploaded, setFileUploaded, chatId, setChatId, messages}: props) {
    const [uploading, setUploading] = useState<Record<string, boolean>>({})
    const fileInputRef = useRef<HTMLInputElement>(null)
    const {chats, setChats} = useContext(Context)
    const router = useRouter()

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const items = event.target.files;
        if (items) {
            const newFiles = Array.from(items)
                .filter((file): file is File => file !== null)
                .map(file => {
                    const fileExtension = file.name.split('.').pop();
                    const timestamp = Date.now();
                    const randomNum = Math.floor(Math.random() * 10) + 1;
                    const newFileName = `${timestamp}-${randomNum}.${fileExtension}`;
                    return new File([file], newFileName, { type: file.type });
                });
            const newFileCount = files.length + newFiles.length;
    
            if (newFileCount > 3) {
                toast({
                    title: "Failed",
                    description: "Maximum 3 file",
                    variant: "destructive",
                })
                return;
            }
    
            for (let file of newFiles) {
                if (file.size > 2 * 1024 * 1024) {
                    toast({
                        title: "Failed",
                        description: "Maximum file 2MB",
                        variant: "destructive",
                    })
                    return;
                }
            }
    
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
            console.log(fileUploaded)
    
            const newLoadingState = newFiles.reduce((acc, file) => {
                acc[file.name] = true;
                return acc;
            }, {} as Record<string, boolean>);
            setUploading(prevUploading => ({ ...prevUploading, ...newLoadingState }));
    
            await Promise.all(
                newFiles.map(async (file) => {
                    try {
                        const uploadedRoute = await uploadBucket(file);
    
                        setFileUploaded(prevFileUploaded => ({
                            ...prevFileUploaded,
                            [file.name]: uploadedRoute
                        }));
    
                        setUploading(prevUploading => {
                            const { [file.name]: _, ...rest } = prevUploading;
                            return rest;
                        });

                    } catch (error) {
                        console.error(`Error uploading file ${file.name}:`, error);
                    }
                })
            );
        }
    };
    
    const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = event.clipboardData?.items;
        if (items) {
            const newFiles = Array.from(items)
                .map(item => item.kind === 'file' && item.type.startsWith('image/') ? item.getAsFile() : null)
                .filter((file): file is File => file !== null)
                .map(file => {
                    const fileExtension = file.name.split('.').pop();
                    const timestamp = Date.now();
                    const randomNum = Math.floor(Math.random() * 10) + 1;
                    const newFileName = `${timestamp}-${randomNum}.${fileExtension}`;
                    return new File([file], newFileName, { type: file.type });
                });
    
            const newFileCount = files.length + newFiles.length;
            if (newFileCount > 3) {
                toast({
                    title: "Failed",
                    description: "Maximum 3 files allowed",
                    variant: "destructive",
                });
                return;
            }
    
            for (let file of newFiles) {
                if (file.size > 2 * 1024 * 1024) {
                    toast({
                        title: "Failed",
                        description: "Maximum file size is 2MB",
                        variant: "destructive",
                    });
                    return;
                }
            }
    
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
            console.log(files)
    
            const newLoadingState = newFiles.reduce((acc, file) => {
                acc[file.name] = true;
                return acc;
            }, {} as Record<string, boolean>);
    
            setUploading(prevUploading => ({ ...prevUploading, ...newLoadingState }));
    
            await Promise.all(
                newFiles.map(async (file) => {
                    try {
                        const uploadedRoute = await uploadBucket(file);
    
                        setFileUploaded(prevFileUploaded => ({
                            ...prevFileUploaded,
                            [file.name]: uploadedRoute
                        }));
    
                        setUploading(prevUploading => {
                            const { [file.name]: _, ...rest } = prevUploading;
                            return rest;
                        });
                    } catch (error) {
                        console.error(`Error uploading file ${file.name}:`, error);
                    }
                })
            );
        }
    };
    

    const removeFile = async (index: number) => {
        const fileNameToRemove = files[index].name
        setFiles(files.filter((_, i) => i !== index));
        const fileNames = Object.keys(fileUploaded);

        if (index >= 0 && index < fileNames.length) {
            const fileRouteToRemove = fileUploaded[fileNameToRemove];
            const updatedFileUploaded = { ...fileUploaded };
            delete updatedFileUploaded[fileNameToRemove];
            setFileUploaded(updatedFileUploaded);
            await deleteBucket(fileRouteToRemove);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && event.shiftKey && !isLoading) {
            event.preventDefault();
            handleSubmit(event as any);
        }
    };

    useEffect(() => {
        const saveData = async () => {
            let saved = null;
            if (isLoading) {
                const newFilesId = [
                    ...filesId,
                    ...Object.entries(fileUploaded).map(([key, value]) => ({
                        id: messages[messages.length - 1].id,
                        imageUrl: value,
                    })),
                ];
                saved = await saveChat(chatId, messages, newFilesId);
                if(!chatId){
                    setChats([{
                        id: saved,
                        messages: messages as unknown as Prisma.JsonValue,
                        updated_at: new Date()
                    },...chats])
                    console.log({
                        id: saved,
                        messages: messages as unknown as Prisma.JsonValue,
                        updated_at: new Date()
                    })
                }
                setFilesId(newFilesId);
                setFileUploaded({});
            } else {
                if(messages.length !== 0){
                    saved = await saveChat(chatId, messages, filesId);
                    router.push(`/chat/${saved}`)
                }
            }
            if (!chatId) {
                setChatId(saved);
            }
        };
        saveData();
    }, [isLoading]);    
    
    const isAnyFileUploading = Object.values(uploading).some((status) => status);

    const isImage = (file: File) => {
        return file.type.startsWith('image/');
    };
  return (
    <form onSubmit={handleSubmit}>
        <div className="absolute bottom-7 left-5 sm:bottom-12 sm:left-6 p-1 border rounded-full cursor-pointer" onClick={handleFileInputClick}>
            <PlusIcon className="w-4 h-4 font-bold"/>
        </div>
        <div className="flex flex-wrap">
            {files.map((file, index) => (
                    <div key={index}>
                        {isImage(file) ? (
                            <div className="w-28 h-28 lg:w-20 lg:h-20 p-2 relative group">
                                {!uploading[file.name] && <div className="absolute right-0 top-0 p-1 bg-[#323232] rounded-full hidden group-hover:block cursor-pointer shadow-lg" onClick={() => removeFile(index)}><Cross1Icon className="p-[0.5px] text-zinc-200" /></div>}
                                <Image
                                    className="object-cover object-center w-full h-full rounded-lg"
                                    src={URL.createObjectURL(file)}
                                    width={256}
                                    height={256}
                                    alt="image"
                                />
                                {uploading[file.name] && <div className="absolute inset-0 m-2 rounded-lg bg-gray-900 bg-opacity-50 flex items-center justify-center text-white"><Spinner/></div>}
                            </div>
                        ) : (
                            <div className="p-2 relative h-full group">
                                <div
                                    className="absolute right-0 top-0 p-1 bg-[#323232] rounded-full hidden group-hover:block cursor-pointer shadow-lg"
                                    onClick={() => removeFile(index)}
                                >
                                    <Cross1Icon className="p-[0.5px] text-zinc-200" />
                                </div>
                                <div className="flex items-center justify-center w-64 h-full bg-[#323232] rounded-lg text-sm text-zinc-200">
                                    <div className="w-1/4 flex flex-wrap items-center justify-center">
                                        <FaFile className="text-3xl"/>
                                    </div>
                                    <div className="w-3/4 break-words">
                                        {file.name.length > 50 ? `${file.name.slice(0, 50)}...` : file.name}
                                    </div>
                                    {uploading[file.name] && <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center text-white"><Spinner/></div>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </div>
        <Input 
            ref={fileInputRef} 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            multiple
            accept="image/*"
            />
        <div className='border-2 border-zinc-800 rounded-[28px] py-2 bg-[#323232] shadow-xl'> 
            <TextareaAutosize 
                value={input}
                placeholder="Send message..."
                onChange={handleInputChange}
                maxRows={12}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                style={{ 'height': 40 }}
                className="text-md text-zinc-200 flex w-full resize-none rounded-xl border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"/>
        </div>
        <div className='absolute bottom-[22px] right-5 sm:right-6 sm:bottom-10 cursor-pointer'>
            <button type="submit" 
            disabled={isLoading || isAnyFileUploading} 
            className={`m-0 p-0 ${isLoading || isAnyFileUploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-50'}`}>
                <IoIosSend className='text-zinc-200 text-2xl sm:text-3xl'/>
            </button>
        </div>
    </form>
  )
}
