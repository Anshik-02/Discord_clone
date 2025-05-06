"use client";
import { FileIcon, X } from "lucide-react";
import Image from "next/image"
import { UploadDropzone } from "@/lib/uploadThing";
import "@uploadthing/react/styles.css";

interface FileUpload {
  endpoint: "ServerImage" | "MessageImage";
  value: string;
  onChange: (url?: string) => void;
}

  export default function FileUpload({ endpoint, value, onChange }: FileUpload) {
const FileType=value.split(".").pop()

if(value&&FileType!="pdf"){
  return <div className="relative">
<Image 
src={value} 
width={90}  
height={90}
className="rounded-full"
alt="server image"/>
<button className=" text-white cursor-pointer bg-rose-700 absolute top-0 right-0 rounded-full" onClick={()=>{onChange("")}}><X className="w-7 h-7 p-1 "/></button>
  </div>
}


  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url ?? "");
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
}
