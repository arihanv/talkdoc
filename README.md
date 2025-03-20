# TalkDoc - Document Reader with Voice Generation

TalkDoc is an interactive PDF reader that can read your documents aloud using advanced text-to-speech technology. Upload a PDF and listen to high-quality narration of your document content.

## Features

- 📄 PDF document viewer with smooth page navigation
- 🔍 Zoom in/out functionality for better reading experience 
- 🎧 Text-to-speech conversion with streaming audio playback for instant audio generation
- 🎛️ Customizable voice settings (voice model, speed, temperature)
- 🌐 Client-server architecture with Next.js frontend and FastAPI voice server

## Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) with App Router and React 19
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React PDF](https://react-pdf.org/) for PDF rendering
- [Jotai](https://jotai.org/) for state management
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Lucide React](https://lucide.dev/docs/lucide-react) for icons
- [Vercel](https://vercel.com/) for frontend deployment

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) for the voice server
- [Play.ht API](https://play.ht/) for text-to-speech generation
- [Modal](https://modal.com/) for deploying the voice server

## Getting Started

### Installation
1. Install frontend dependencies
   ```bash
   npm install
   ```

2. Install voice server dependencies
   ```bash
   cd voice_server
   pip install -r requirements.txt
   cd ..
   ```

3. Create a `.env` file in the root directory with your Play.ht API credentials
   ```
   NEXT_PUBLIC_VOICE_SERVER_URL=http://localhost:8000
   PLAY_HT_API_KEY=your_api_key_here
   PLAY_HT_USER_ID=your_user_id_here
   ```

### Running the Application

1. Start the Next.js frontend
   ```bash
   npm run dev
   ```
   
2. In a separate terminal, start the voice server
   ```bash
   cd voice_server
   python app.py
   ```

## Usage

1. Upload a PDF document using the file upload interface
2. Navigate between pages using the navigation controls
3. Use the zoom controls to adjust the document view
4. Click the generate audio and audio players buttons to listen to the current page content
5. Adjust voice settings by clicking the voice settings button

## Design Decisions

- **Client-Server Architecture**: Separated the voice generation logic into a Python FastAPI server to leverage Play.ht's audio streaming API effectively while keeping the frontend focused on rendering and UI interactions. Deployed the server on Modal for scalability and ease of deployment.

- **Streaming Audio Playback**: Implemented audio streaming to provide immediate audio chunks to users rather than waiting for the entire audio file to be generated. This is made possible by the MediaSource API.

- **Jotai for State Management**: Used Jotai for its simplicity and performance in handling application state without unnecessary complexity.

- **MediaSource API**: Leveraged the MediaSource API for efficient audio streaming and chunked playback where the audio is generated and played at the same time.

- **Accessible UI Components**: Prioritized accessibility by using Radix UI primitives as the foundation for UI components.