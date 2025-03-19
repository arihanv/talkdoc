"use client";

import { Page, Document } from "react-pdf";
import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/lib/voice";
import {
	ChevronLeft,
	ChevronRight,
	LucideCheck,
	LucideLoader,
	LucidePause,
	LucidePlay,
	ZoomIn,
	ZoomOut,
	Maximize,
} from "lucide-react";
import { useAtom } from "jotai";
import { fileUrlAtom } from "@/lib/store";

interface PDFTextItem {
	str: string;
	transform: number[];
	width: number;
	height: number;
	fontName: string;
	[key: string]: string | number | number[] | boolean | undefined;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();

export default function DocumentPage() {
	const [fileUrl] = useAtom(fileUrlAtom);
	const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [pageContent, setPageContent] = useState<string>("");
	const [scale, setScale] = useState<number>(1.0);
	const {
		isPlaying,
		isPaused,
		isGenerated,
		currentTime,
		duration,
		progress,
		isStreaming,
		chunksReceived,
		formatTime,
		play,
		pause,
		reset,
	} = useAudioPlayer(pageContent);

	// Reset audio state when reset function changes or file changes
	useEffect(() => {
		if (reset) {
			reset();
		}
	}, [reset]);

	// Reset page number when file changes
	useEffect(() => {
		if (fileUrl) {
			setPageNumber(1);
		}
	}, [fileUrl]);

	// Reset zoom when file changes
	useEffect(() => {
		setScale(1.0);
	}, [fileUrl]);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
		loadPageText(1);
		reset?.();
	}

	const loadPageText = async (pageNumber: number) => {
		if (!fileUrl) return;

		reset?.();

		try {
			const pdf = await pdfjs.getDocument(fileUrl).promise;
			const page = await pdf.getPage(pageNumber);
			const textContent = await page.getTextContent();

			const items = textContent.items as PDFTextItem[];
			setPageContent(items.map((item) => item.str).join(" "));
		} catch (error) {
			console.error("Error extracting text:", error);
		}
	};

	const handleZoomIn = () => {
		setScale((prev) => Math.min(prev + 0.2, 2.5));
	};

	const handleZoomOut = () => {
		setScale((prev) => Math.max(prev - 0.2, 0.5));
	};

	const handleResetZoom = () => {
		setScale(1.0);
	};

	if (!fileUrl) return null;

	return (
		<div className="flex flex-col items-center justify-between bg-white p-3 gap-2 overflow-hidden h-[calc(100vh-64px)]">
			<div className="relative w-full max-w-2xl flex-1 shadow-lg rounded-sm border border-gray-200 overflow-hidden">
				<div className="flex items-center justify-between px-2 py-1 border-b bg-gray-50">
					<div className="text-xs font-medium">
						Page {pageNumber} of {numPages}
					</div>
					<div className="flex items-center gap-1">
						<Button
							onClick={handleZoomOut}
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={scale <= 0.5}
						>
							<ZoomOut className="h-4 w-4" />
						</Button>
						<span className="text-xs w-10 text-center">
							{Math.round(scale * 100)}%
						</span>
						<Button
							onClick={handleZoomIn}
							variant="ghost"
							size="icon"
							className="h-7 w-7"
							disabled={scale >= 2.5}
						>
							<ZoomIn className="h-4 w-4" />
						</Button>
						<Button
							onClick={handleResetZoom}
							variant="ghost"
							size="icon"
							className="h-7 w-7"
						>
							<Maximize className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div className="relative p-2 flex items-center justify-center overflow-y-auto h-full">
					<Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
						<Page pageNumber={pageNumber} scale={scale} />
					</Document>
				</div>
			</div>
			
			<div className="flex justify-between w-full max-w-2xl mt-2 items-center">
				<Button
					className="cursor-pointer"
					variant="outline"
					onClick={() => {
						reset?.();
						if (pageNumber > 1) {
							setPageNumber(pageNumber - 1);
							loadPageText(pageNumber - 1);
						}
					}}
					disabled={pageNumber <= 1}
				>
					<ChevronLeft className="mr-2 h-4 w-4" /> Previous
				</Button>

				<div className="flex gap-2 h-14 items-center">
					{!isGenerated ? (
						<Button
							onClick={play}
							disabled={isPlaying || pageContent.length === 0}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
						>
							Generate Audio
						</Button>
					) : (
						<div className="flex flex-col gap-2 items-center bg-gray-50 p-2 rounded-md border border-gray-200 min-w-[220px] relative">
							{isStreaming && (
								<div className="w-fit absolute mx-auto -top-7 left-0 py-0.5 right-0 text-xs text-blue-600 flex items-center justify-center gap-2 bg-blue-50 px-2 rounded-lg border border-blue-200">
									<LucideLoader className="h-3 w-3 animate-spin rounded-full" />
									<span className="tabular-nums">
										Streaming {chunksReceived} chunks
									</span>
								</div>
							)}

							{!isStreaming && chunksReceived > 0 && (
								<div className="w-fit absolute mx-auto -top-7 left-0 py-0.5 right-0 text-xs text-white flex items-center justify-center gap-2 bg-blue-600 px-2 rounded-lg border border-blue-200">
									<LucideCheck className="h-3 w-3 rounded-full" />
									<span className="tabular-nums">
										{chunksReceived} chunks processed
									</span>
								</div>
							)}
							<div className="flex items-center justify-between w-full">
								<Button
									onClick={() => {
										if (isPaused) {
											play();
										} else {
											pause();
										}
									}}
									disabled={!isGenerated}
									className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0 rounded-full"
								>
									{isPaused || !isPlaying ? (
										<LucidePlay className="h-4 w-4" />
									) : (
										<LucidePause className="h-4 w-4" />
									)}
								</Button>

								<div className="text-xs text-gray-500 font-mono">
									{formatTime(currentTime)} / {formatTime(duration || 0)}
								</div>
							</div>

							<div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
								<div
									className="bg-blue-600 h-1.5 rounded-full"
									style={{
										width: `${Number.isNaN(progress) || !Number.isFinite(progress) ? 0 : progress}%`,
									}}
								/>
							</div>
						</div>
					)}
				</div>

				<Button
					className="cursor-pointer"
					variant="outline"
					onClick={() => {
						reset?.();
						if (pageNumber < (numPages || 1)) {
							setPageNumber(pageNumber + 1);
							loadPageText(pageNumber + 1);
						}
					}}
					disabled={pageNumber >= (numPages || 1)}
				>
					Next <ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
