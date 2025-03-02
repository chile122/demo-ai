/**
 * Module for Text-to-Speech functionality using Web Speech API
 */
const TextToSpeech = (() => {
  // Private variables
  let voices = [];
  
  // DOM Elements
  const ttsLanguage = document.getElementById('ttsLanguage');
  const ttsVoice = document.getElementById('ttsVoice');
  const ttsRate = document.getElementById('ttsRate');
  const ttsText = document.getElementById('ttsText');
  const rateValue = document.getElementById('rateValue');
  const ttsStatus = document.getElementById('ttsStatus');
  
  /**
   * Initialize the Text-to-Speech module
   */
  function init() {
    // Load available voices
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    
    // Set up rate slider
    ttsRate.addEventListener('input', updateRateValue);
    
    // Set up buttons
    document.getElementById('speakButton').addEventListener('click', speak);
    document.getElementById('pauseButton').addEventListener('click', pause);
    document.getElementById('resumeButton').addEventListener('click', resume);
    document.getElementById('stopButton').addEventListener('click', stop);
  }
  
  /**
   * Load available voices for speech synthesis
   */
  function loadVoices() {
    voices = speechSynthesis.getVoices();
    ttsVoice.innerHTML = '<option value="">-- Giọng mặc định --</option>';
    
    voices.forEach((voice, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${voice.name} (${voice.lang})`;
      ttsVoice.appendChild(option);
    });
  }
  
  /**
   * Update displayed rate value
   */
  function updateRateValue() {
    rateValue.textContent = ttsRate.value;
  }
  
  /**
   * Speak text using speech synthesis
   */
  function speak() {
    const text = ttsText.value;
    if (!text) {
      Utils.setStatus('ttsStatus', 'Vui lòng nhập văn bản trước!');
      return;
    }
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = ttsLanguage.value;
    utterance.rate = parseFloat(ttsRate.value);
    
    // Set voice if selected
    const voiceIndex = ttsVoice.value;
    if (voiceIndex) {
      utterance.voice = voices[parseInt(voiceIndex)];
    }
    
    // Handle speech events
    utterance.onstart = () => {
      Utils.setStatus('ttsStatus', 'Đang đọc văn bản...');
    };
    
    utterance.onend = () => {
      Utils.setStatus('ttsStatus', 'Đã đọc xong!');
    };
    
    utterance.onerror = (event) => {
      Utils.setStatus('ttsStatus', `Lỗi khi đọc: ${event.error}`);
    };
    
    // Start speaking
    speechSynthesis.speak(utterance);
  }
  
  /**
   * Pause speech synthesis
   */
  function pause() {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      Utils.setStatus('ttsStatus', 'Đã tạm dừng!');
    } else {
      Utils.setStatus('ttsStatus', 'Không có nội dung đang được đọc!');
    }
  }
  
  /**
   * Resume speech synthesis
   */
  function resume() {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      Utils.setStatus('ttsStatus', 'Đang tiếp tục đọc...');
    } else {
      Utils.setStatus('ttsStatus', 'Không có nội dung đang tạm dừng!');
    }
  }
  
  /**
   * Stop speech synthesis
   */
  function stop() {
    speechSynthesis.cancel();
    Utils.setStatus('ttsStatus', 'Đã dừng đọc!');
  }
  
  // Public API
  return {
    init,
    speak,
    pause,
    resume,
    stop,
    loadVoices
  };
})();