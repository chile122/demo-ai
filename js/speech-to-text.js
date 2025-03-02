/**
 * Module for Speech-to-Text functionality using Web Speech API
 */
const SpeechToText = (() => {
  // Private variables
  let recognition = null;
  let isRecording = false;
  
  // DOM Elements
  const startSpeechBtn = document.getElementById('startSpeechBtn');
  const speechLanguage = document.getElementById('speechLanguage');
  const speechStatus = document.getElementById('speechStatus');
  const transcript = document.getElementById('transcript');
  
  /**
   * Initialize the Speech-to-Text module
   */
  function init() {
    console.log('Initializing Speech-to-Text module');
    
    // Check if browser supports Speech Recognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      Utils.setStatus('speechStatus', 'Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói!');
      startSpeechBtn.disabled = true;
      return;
    }
    
    // Set up buttons
    startSpeechBtn.addEventListener('click', function() {
      console.log('Speech button clicked, toggling recognition');
      toggleRecognition();
    });
    
    document.getElementById('copyTranscriptBtn').addEventListener('click', copyText);
    document.getElementById('clearTranscriptBtn').addEventListener('click', clearText);
    document.getElementById('speakTranscriptBtn').addEventListener('click', speakText);
  }
  
  /**
   * Toggle speech recognition on/off
   */
  function toggleRecognition() {
    console.log('Toggle recognition, current state:', isRecording);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }
  
  /**
   * Stop speech recognition
   */
  function stopRecording() {
    console.log('Stopping recording');
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
    startSpeechBtn.innerHTML = '<span class="mic-icon">🎤</span> Bắt đầu ghi âm <div class="waves"><span class="wave"></span><span class="wave"></span><span class="wave"></span><span class="wave"></span><span class="wave"></span></div>';
    startSpeechBtn.classList.remove('recording');
    Utils.setStatus('speechStatus', 'Nhận dạng giọng nói đã dừng.');
    isRecording = false;
  }
  
  /**
   * Start speech recognition
   */
  function startRecording() {
    console.log('Starting recording');
    
    // Create new recognition instance each time to avoid issues
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = speechLanguage.value;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // Handle recognition results
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // Display results
      if (finalTranscript) {
        const currentText = transcript.textContent;
        const newText = currentText.includes('Văn bản được nhận dạng sẽ xuất hiện ở đây') 
          ? finalTranscript 
          : `${currentText} ${finalTranscript}`;
        
        transcript.textContent = newText;
      }
      
      Utils.setStatus('speechStatus', interimTranscript || 'Đang nghe...');
    };
    
    // Handle errors
    recognition.onerror = (event) => {
      console.error('Lỗi ngôn ngữ đang nói: ', event.error);
      Utils.setStatus(speechStatus, 'Lỗi: ${event.error}');
      stopRecording();
    };

    // Handle end of recognition
    recognition.onend = () => {
      console.log('Recognition ended');
      stopRecording();
    };
    
    // Start recognition
    try {
      recognition.start();
      startSpeechBtn.innerHTML = '<span class="mic-icon">🎤</span> Đang ghi âm <div class="waves"><span class="wave"></span><span class="wave"></span><span class="wave"></span><span class="wave"></span><span class="wave"></span></div>';
      startSpeechBtn.classList.add('recording');
      Utils.setStatus('speechStatus', 'Đang nghe...');
      isRecording = true;
    } catch (error) {
      console.error('Lỗi khi bắt đầu nhận dạng:', error);
      Utils.setStatus('speechStatus', `Không thể bắt đầu nhận dạng: ${error.message}`);
    }
  }
  
  /**
   * Copy recognized text to clipboard
   */
  function copyText() {
    const text = transcript.textContent;
    if (text && !text.includes('Văn bản được nhận dạng sẽ xuất hiện ở đây')) {
      navigator.clipboard.writeText(text).then(() => {
        Utils.setStatus('speechStatus', 'Đã sao chép văn bản vào clipboard!');
      }).catch(err => {
        Utils.setStatus('speechStatus', `Lỗi khi sao chép: ${err}`);
      });
    } else {
      Utils.setStatus('speechStatus', 'Không có văn bản để sao chép!');
    }
  }

  /**
   * Clear recognized text
   */
  function clearText() {
    transcript.textContent = 'Văn bản được nhận dạng sẽ xuất hiện ở đây';
    Utils.setStatus('speechStatus', 'Đã xóa văn bản.');
  }

  /**
   * Read recognized text aloud
   */
  function speakText() {
    const text = transcript.textContent;
    if (text && !text.includes('Văn bản được nhận dạng sẽ xuất hiện ở đây')) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLanguage.value;
      speechSynthesis.speak(utterance);
      Utils.setStatus('speechStatus', 'Đang đọc văn bản...');
    } else {
      Utils.setStatus('speechStatus', 'Không có văn bản để đọc!');
    }
  }

  // Public API
  return {
    init,
    toggleRecognition,
    copyText,
    clearText,
    speakText
  };
})();