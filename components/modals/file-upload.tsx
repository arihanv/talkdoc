import { useRef } from "react";
import { Button } from "../ui/button";
import { LucidePlus } from "lucide-react";
import { useSetAtom } from "jotai";
import { fileUrlAtom, fileNameAtom } from "@/lib/store";

export default function FileUploadModal() {
  const setFileUrl = useSetAtom(fileUrlAtom)
  const setFileName = useSetAtom(fileNameAtom)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileUrl(URL.createObjectURL(file))
      setFileName(file.name)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  }
  
	return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="application/pdf"
        onChange={handleFileInputChange}
      />
      <Button variant="outline" onClick={handleButtonClick}>
        New File <LucidePlus className="w-4 h-4" />
      </Button>
    </div>
	);
}