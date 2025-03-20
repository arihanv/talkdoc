"use client";

import React from "react";
import { useAtom } from "jotai";
import { fileNameAtom } from "@/lib/store";
import FileUploadModal from "../modals/file-upload";
import SettingsModal from "../modals/settings";

export default function DocumentHeader() {
	const [fileName] = useAtom(fileNameAtom);

	return (
		<div className="flex items-center justify-between p-4 max-w-screen-lg mx-auto w-full h-16 gap-5">
			<h1 className="text-xl font-bold font-mono max-w-2xl truncate">{fileName}</h1>

			<div className="flex items-center gap-2">
				<FileUploadModal />
				<SettingsModal />
			</div>
		</div>
	);
}
