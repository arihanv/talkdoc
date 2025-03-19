"use client"

import { useState, useRef, useEffect, type DragEvent, type ChangeEvent, useCallback } from "react"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelected?: (file: File | null) => void
  className?: string
}

export default function FileUpload({ onFileSelected, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [pageCount, setPageCount] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const validateFile = (fileList: FileList): { valid: File | null; errors: string[] } => {
    const newErrors: string[] = []

    if (fileList.length === 0) {
      return { valid: null, errors: newErrors }
    }

    const file = fileList[0]

    // Check file type
    if (file.type !== "application/pdf") {
      newErrors.push(`${file.name} is not a PDF file`)
      return { valid: null, errors: newErrors }
    }

    return { valid: file, errors: newErrors }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const { valid, errors } = validateFile(e.dataTransfer.files)

      if (errors.length > 0) {
        setErrors(errors)
        return
      }

      setFile(valid)
      onFileSelected?.(valid)
      setErrors([])
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const { valid, errors } = validateFile(e.target.files)

      if (errors.length > 0) {
        setErrors(errors)
        return
      }

      setFile(valid)
      onFileSelected?.(valid)
      setErrors([])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPageCount(null)
    onFileSelected?.(null)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Fix linter error by making countPdfPages part of component state
  const countPdfPages = useCallback(async (pdfFile: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)

        // Simple PDF page counting approach
        // Look for "/Type /Page" patterns in the PDF
        const pdfString = new TextDecoder("utf-8").decode(uint8Array)
        const pageMatches = pdfString.match(/\/Type\s*\/Page\b/g)

        if (pageMatches) {
          resolve(pageMatches.length)
        } else {
          // Alternative approach: look for "/Count n" in the PDF
          const countMatch = pdfString.match(/\/Count\s+(\d+)/)
          if (countMatch?.[1]) {
            resolve(Number.parseInt(countMatch[1], 10))
          } else {
            // If we can't determine the page count
            resolve(0)
          }
        }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(pdfFile)
    })
  }, [])

  // Effect to count pages when a file is selected - now with correct dependency
  useEffect(() => {
    if (file) {
      countPdfPages(file)
        .then((count) => setPageCount(count))
        .catch((error) => console.error("Error counting PDF pages:", error))
    } else {
      setPageCount(null)
    }
  }, [file, countPdfPages])

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openFileDialog()
    }
  }

  return (
    <div className={cn("w-full max-w-sm mx-auto", className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="application/pdf"
        onChange={handleFileInputChange}
      />

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-destructive/10 rounded-md">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-4 w-4" />
            <p className="font-medium">Error uploading file</p>
          </div>
          <ul className="text-sm space-y-1 list-disc pl-5">
            {errors.map((error, i) => (
              <li key={`error-${i}-${error.substring(0, 10)}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {!file ? (
        // Drag and drop area - only shown when no file is selected
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors",
            "flex flex-col items-center justify-center gap-4",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "cursor-pointer",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          onKeyDown={handleKeyDown}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>

          <div className="text-center font-mono">
            <p className="text-sm font-medium">Drag & drop a PDF file here, or click to select</p>
          </div>
        </div>
      ) : (
        // Selected file display - only shown when a file is selected
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-md">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • {pageCount !== null ? `${pageCount} pages` : "Analyzing..."}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={openFileDialog}>
                Change
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRemoveFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

