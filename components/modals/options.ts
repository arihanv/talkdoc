interface VoiceOption {
	name: string;
	accent: string;
	language: string;
	languageCode: string;
	value: string;
	sample: string;
	gender: string;
	style: string;
}

interface TemperatureOption {
	max: number;
	min: number;
	step: number;
	default: number;
}

interface ModelOption {
	name: string;
	value: string;
}

interface SpeedOption {
	max: number;
	min: number;
	step: number;
	default: number;
}

interface LanguageOption {
	name: string;
}

interface AudioModelOptions {
	voices: {
		options: VoiceOption[];
		default: number;
	};
	temperature: TemperatureOption;
	models: {
		options: ModelOption[];
		default: string;
	};
	speed: SpeedOption;
	language: {
		options: LanguageOption[];
		default: string;
	};
}

export const audioModelOptions: AudioModelOptions = {
	voices: {
		options: [
			{
				name: "Angelo",
				accent: "american",
				language: "English (US)",
				languageCode: "EN-US",
				value:
					"s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json",
				sample:
					"https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Angelo_Sample.wav",
				gender: "male",
				style: "Conversational",
			},
			{
				name: "Deedee",
				accent: "american",
				language: "English (US)",
				languageCode: "EN-US",
				value:
					"s3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/original/manifest.json",
				sample:
					"https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Deedee_Sample.wav",
				gender: "female",
				style: "Conversational",
			},
			{
				name: "Jennifer",
				accent: "american",
				language: "English (US)",
				languageCode: "EN-US",
				value:
					"s3://voice-cloning-zero-shot/801a663f-efd0-4254-98d0-5c175514c3e8/jennifer/manifest.json",
				sample:
					"https://peregrine-samples.s3.amazonaws.com/parrot-samples/jennifer.wav",
				gender: "female",
				style: "Conversational",
			},
			{
				name: "Briggs",
				accent: "american",
				language: "English (US)",
				languageCode: "EN-US",
				value:
					"s3://voice-cloning-zero-shot/71cdb799-1e03-41c6-8a05-f7cd55134b0b/original/manifest.json",
				sample:
					"https://peregrine-samples.s3.us-east-1.amazonaws.com/parrot-samples/Briggs_Sample.wav",
				gender: "male",
				style: "Narrative",
			},
			{
				name: "Samara",
				accent: "american",
				language: "English (US)",
				languageCode: "EN-US",
				value:
					"s3://voice-cloning-zero-shot/90217770-a480-4a91-b1ea-df00f4d4c29d/original/manifest.json",
				sample: "https://parrot-samples.s3.amazonaws.com/gargamel/Samara.wav",
				gender: "female",
				style: "Conversational",
			},
		],
		default: 1,
	},
	temperature: {
		max: 2,
		min: 0,
		step: 0.1,
		default: 0.5,
	},
	models: {
		options: [
			{
				name: "Play3.0-mini",
				value: "Play3.0-mini",
			},
			{
				name: "Play Dialog",
				value: "PlayDialog",
			},
		],
		default: "Play3.0-mini",
	},
	speed: {
		max: 5,
		min: 0.1,
		step: 0.1,
		default: 1,
	},
	language: {
		options: [
			{ name: "afrikaans" },
			{ name: "arabic" },
			{ name: "bengali" },
			{ name: "bulgarian" },
			{ name: "croatian" },
			{ name: "czech" },
			{ name: "danish" },
			{ name: "dutch" },
			{ name: "english" },
			{ name: "french" },
			{ name: "galician" },
			{ name: "german" },
			{ name: "greek" },
			{ name: "hebrew" },
			{ name: "hindi" },
			{ name: "hungarian" },
			{ name: "indonesian" },
			{ name: "italian" },
			{ name: "japanese" },
			{ name: "korean" },
			{ name: "malay" },
			{ name: "mandarin" },
			{ name: "polish" },
			{ name: "portuguese" },
			{ name: "russian" },
			{ name: "serbian" },
			{ name: "spanish" },
			{ name: "swedish" },
			{ name: "tagalog" },
			{ name: "thai" },
			{ name: "turkish" },
			{ name: "ukrainian" },
			{ name: "urdu" },
			{ name: "xhosa" },
		],
		default: "english",
	},
};
