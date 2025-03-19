"use client"

import React, { useCallback } from 'react'
import DocumentPage from './document'
import FileUpload from '@/components/upload/file-upload'
import { useAtom, useSetAtom } from 'jotai'
import { fileUrlAtom, fileNameAtom } from '@/lib/store'
import DocumentHeader from './header'
export default function Reader() {
  const [fileUrl, setFileUrl] = useAtom(fileUrlAtom)
  const setFileName = useSetAtom(fileNameAtom)

  const handleFileSelected = useCallback((file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setFileUrl(url)
      setFileName(file.name)
    } else {
      setFileUrl(null)
      setFileName(null)
    }
  }, [setFileUrl, setFileName])

  return (
    <div>
      {!fileUrl ? (
        <div className="w-full max-w-2xl px-4 flex flex-col mx-auto items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-center mb-6 font-mono">Upload your PDF document</h1>
          <FileUpload onFileSelected={handleFileSelected} />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-0">
          <DocumentHeader />
          <DocumentPage />
        </div>
      )}
    </div>
  )
}