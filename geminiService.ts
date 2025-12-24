
import { GoogleGenAI, Modality } from "@google/genai";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return sharedAudioCtx;
}

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Fallback to the browser's native Speech Synthesis API.
 * This is used when the Gemini TTS API is unavailable or quota-limited.
 */
function speakWithBrowser(text: string, languageName: string) {
  // Cancel any ongoing speech to avoid overlapping
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap: Record<string, string> = {
    'English': 'en-US',
    'Français': 'fr-FR',
    'Türkçe': 'tr-TR'
  };
  
  utterance.lang = langMap[languageName] || 'en-US';
  utterance.rate = 0.9; // Slightly slower for better educational clarity
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
}

export async function speakWord(text: string, languageName: string): Promise<void> {
  try {
    const audioCtx = getAudioContext();
    
    // Resume context if it was suspended (browser policy)
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this ${languageName} word clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Using 'Kore' as the primary voice for high-quality Gemini TTS
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.warn("No audio data in Gemini response, falling back to browser TTS.");
      speakWithBrowser(text, languageName);
      return;
    }

    const audioBuffer = await decodeAudioData(
      decodeBase64(base64Audio),
      audioCtx,
      24000,
      1
    );

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0);
  } catch (error: any) {
    // If we hit RESOURCE_EXHAUSTED (429) or any other API error, 
    // we use the browser's built-in synthesis as a seamless fallback.
    console.warn("Gemini TTS API error (likely quota), using browser fallback:", error.message || error);
    speakWithBrowser(text, languageName);
  }
}

export async function getMoreWords(category: string, count: number = 20): Promise<any[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a JSON array of ${count} most common ${category}s. Each object must have fields 'en' (English), 'fr' (French), and 'tr' (Turkish).`,
      config: {
          responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to fetch words from Gemini:", e);
    return [];
  }
}
