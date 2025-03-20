import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { audioModelOptions } from "@/components/modals/options";
import { CheckIcon, LucideSettings, Mic, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { AudioModelSettings } from "@/lib/store";
import { audioModelSettingsAtom } from "@/lib/store";
import { useAtom } from "jotai";

export default function SettingsModal() {
	const [audioModelSettings, setAudioModelSettings] = useAtom(audioModelSettingsAtom);
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	
	// Get default voice
	const defaultVoice = audioModelOptions.voices.options[audioModelOptions.voices.default];
	
	// Local state for the form
	const [voice, setVoice] = useState(defaultVoice);
	const [temperature, setTemperature] = useState(audioModelOptions.temperature.default);
	const [model, setModel] = useState(audioModelOptions.models.options[0].value);
	const [speed, setSpeed] = useState(audioModelOptions.speed.default);

	// Initialize from existing settings if available
	useEffect(() => {
		if (audioModelSettings) {
			// Find the voice object that matches the stored value
			const foundVoice = audioModelOptions.voices.options.find(
				(v) => v.value === audioModelSettings.voice.value
			);
			if (foundVoice) setVoice(foundVoice);
			
			setTemperature(audioModelSettings.temperature);
			setModel(audioModelSettings.model);
			setSpeed(audioModelSettings.speed);
		}
	}, [audioModelSettings]);

	// Save settings to the store
	const handleSaveSettings = () => {
		setSaving(true);
		
		// Save settings to store
		const settings: AudioModelSettings = {
			voice,
			temperature,
			model,
			speed
		};
		setAudioModelSettings(settings);
		
		setTimeout(() => {
            setSaving(false);
            setOpen(false);
		}, 300);
	};

	// Helper function to get badge variant based on style
	const getVoiceStyleVariant = (style: string) => {
		if (style === "Conversational") return "secondary";
		if (style === "Narrative") return "outline";
		return "default";
	};
	
	// Helper to get model badge variant
	const getModelVariant = (modelName: string) => {
		if (modelName === "Play3.0-mini") return "secondary";
		return "default";
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<LucideSettings className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Voice Settings</DialogTitle>
					<DialogDescription>
						Customize the PlayAI voice model used to read the document.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="voice" className="text-right">
							Voice
						</Label>
						<div className="col-span-3">
							<Select value={voice.value} onValueChange={(value) => {
								const selectedVoice = audioModelOptions.voices.options.find(v => v.value === value);
								if (selectedVoice) setVoice(selectedVoice);
							}}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a voice">
										<div className="flex items-center gap-2">
											<Mic className="h-3.5 w-3.5 text-muted-foreground" />
											<span>{voice.name}</span>
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{audioModelOptions.voices.options.map((voiceOption) => (
										<SelectItem 
											key={voiceOption.value} 
											value={voiceOption.value}
											className="py-2"
										>
											<div className="flex w-full justify-between items-center">
												<span className="font-medium">{voiceOption.name}</span>
												<div className="flex gap-2 ml-4">
													<Badge variant="outline" className="capitalize">
														{voiceOption.gender}
													</Badge>
													{voiceOption.style && (
														<Badge variant={getVoiceStyleVariant(voiceOption.style)}>
															{voiceOption.style}
														</Badge>
													)}
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="model" className="text-right">
							Model
						</Label>
						<div className="col-span-3">
							<Select value={model} onValueChange={setModel}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a model">
										<div className="flex items-center gap-2">
											<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
											<span>{model}</span>
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{audioModelOptions.models.options.map((modelOption) => (
										<SelectItem key={modelOption.value} value={modelOption.value}>
											<div className="flex w-full justify-between items-center">
												<span>{modelOption.name}</span>
												<Badge variant={getModelVariant(modelOption.name)} className="ml-4">
													{modelOption.name === "Play3.0-mini" ? "Optimized" : "Advanced"}
												</Badge>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="temperature" className="text-right">
							Temperature
						</Label>
						<div className="col-span-3 space-y-2">
							<Slider 
								value={[temperature]} 
								min={audioModelOptions.temperature.min} 
								max={audioModelOptions.temperature.max} 
								step={audioModelOptions.temperature.step}
								onValueChange={(values) => setTemperature(values[0])}
							/>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>{temperature.toFixed(1)}</span>
								<div className="flex justify-between w-full px-2">
									<span>Less Random</span>
									<span>More Random</span>
								</div>
								<span>{audioModelOptions.temperature.max}</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="speed" className="text-right">
							Speed
						</Label>
						<div className="col-span-3 space-y-2">
							<Slider 
								value={[speed]} 
								min={audioModelOptions.speed.min} 
								max={audioModelOptions.speed.max} 
								step={audioModelOptions.speed.step}
								onValueChange={(values) => setSpeed(values[0])}
							/>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>{speed.toFixed(1)}</span>
								<div className="flex justify-between w-full px-2">
									<span>Slower</span>
									<span>Faster</span>
								</div>
								<span>{audioModelOptions.speed.max}</span>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button 
						type="submit" 
						onClick={handleSaveSettings}
						disabled={saving}
						className="min-w-[120px]"
					>
						{saving ? (
							<>
								<CheckIcon className="mr-2 h-4 w-4" />
								Saved
							</>
						) : (
							"Save changes"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
