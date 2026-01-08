
/**
 * Browser Speech Service
 * Gemini API bağımlılığını ortadan kaldırır ve yerel Web Speech API kullanır.
 */

let voices: SpeechSynthesisVoice[] = [];
const voiceCache: Record<string, SpeechSynthesisVoice | null> = {
  'tr-TR': null,
  'en-US': null,
  'fr-FR': null
};

/**
 * Tarayıcıdaki ses listesini yükler ve diller için en uygun sesleri önbelleğe alır.
 */
function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const langMap: Record<string, string> = {
      'tr': 'tr-TR',
      'en': 'en-US',
      'fr': 'fr-FR'
    };

    Object.entries(langMap).forEach(([key, langCode]) => {
      // Tam eşleşme ara
      let voice = voices.find(v => v.lang === langCode);
      // Bulunamazsa dile göre ara (örn: 'en-GB' en için kabul edilebilir)
      if (!voice) {
        voice = voices.find(v => v.lang.startsWith(key));
      }
      voiceCache[langCode] = voice || null;
    });
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  loadVoices();
}

function createUtterance(text: string, langCode: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  
  // Önbellekten sesi al
  if (voiceCache[langCode]) {
    utterance.voice = voiceCache[langCode]!;
  }
  
  utterance.rate = 0.9; // Daha anlaşılır olması için hafif yavaş
  utterance.pitch = 1.0;
  return utterance;
}

/**
 * Yerel tarayıcı seslendirmesini başlatır.
 */
export function speakWithBrowser(text: string, langCode: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // Önceki seslendirmeleri durdur
  const utterance = createUtterance(text, langCode);
  
  if (onEnd) {
    utterance.onend = onEnd;
    // Bazı tarayıcılarda onend tetiklenmeme hatası için fallback
    utterance.onerror = onEnd;
  }
  
  window.speechSynthesis.speak(utterance);
}

// Geriye dönük uyumluluk için boş fonksiyonlar (Hata vermemesi için)
export async function prepareAudioBuffer(text: string, langCode: string): Promise<any> {
  return null;
}

export async function speakBuffer(buffer: any, fallbackText: string, fallbackLangCode: string, onEnd?: () => void): Promise<void> {
  speakWithBrowser(fallbackText, fallbackLangCode, onEnd);
}
