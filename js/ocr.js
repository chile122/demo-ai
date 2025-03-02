/**
 * Module for OCR (Optical Character Recognition) using Tesseract.js
 */
const OCR = (() => {
  // DOM Elements
  const ocrImageInput = document.getElementById('ocrImageInput');
  const ocrPreview = document.getElementById('ocrPreview');
  const ocrStatus = document.getElementById('ocrStatus');
  const ocrResult = document.getElementById('ocrResult');
  const progressBar = document.getElementById('progressBar');
  
  /**
   * Initialize the OCR module
   */
  function init() {
    // Set up image preview when file is chosen
    ocrImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          ocrPreview.src = event.target.result;
          Utils.setStatus('ocrStatus', 'Đã tải hình ảnh. Nhấn "Trích xuất văn bản" để phân tích.');
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Set up buttons
    document.getElementById('ocrButton').addEventListener('click', performOCR);
    document.getElementById('speakOcrButton').addEventListener('click', speakResults);
  }
  
  /**
   * Update progress bar for OCR
   * @param {number} progress - Progress percentage (0-100)
   */
  function updateProgress(progress) {
    progressBar.style.display = 'block';
    progressBar.style.width = `${progress}%`;
  }
  
  /**
   * Hide progress bar
   */
  function hideProgress() {
    setTimeout(() => {
      progressBar.style.display = 'none';
    }, 500);
  }
  
  /**
   * Display OCR results
   * @param {Object} data - OCR result data from Tesseract
   */
  function displayResult(data) {
    const { text, confidence } = data;
    
    if (!text || text.length < 3) {
      Utils.setResult('ocrResult', '<p>Không tìm thấy văn bản nào trong hình ảnh này.</p>');
    } else {
      Utils.setResult('ocrResult', `
        <h3>Văn bản được trích xuất:</h3>
        <pre>${text}</pre>
        <p><strong>Độ tin cậy:</strong> ${confidence.toFixed(2)}%</p>
        <p><strong>Số ký tự:</strong> ${text.length}</p>
        <p><strong>Số từ:</strong> ${text.split(/\s+/).filter(w => w.length > 0).length}</p>
      `);
    }
  }
  
  /**
   * Perform OCR on an image
   */
  async function performOCR() {
    if (!ocrPreview.src || ocrPreview.src === window.location.href) {
      Utils.setStatus('ocrStatus', 'Vui lòng tải lên một hình ảnh trước!');
      return;
    }
    
    Utils.setStatus('ocrStatus', 'Đang xử lý OCR...');
    progressBar.style.display = 'block';
    progressBar.style.width = '0%';
    
    let worker = null;
    
    try {
      // Create Tesseract worker
      worker = await Tesseract.createWorker({
        logger: progress => {
          if (progress.status === 'recognizing text') {
            updateProgress(progress.progress * 100);
          }
        }
      });
      
      // Configure language
      await worker.loadLanguage('eng+vie');
      await worker.initialize('eng+vie');
      
      // Process OCR
      const result = await worker.recognize(ocrPreview);
      displayResult(result.data);
      Utils.setStatus('ocrStatus', 'OCR hoàn tất thành công!');
    } catch (error) {
      console.error('Lỗi OCR:', error);
      
      // Display error message
      if (error.message === "no best words!!") {
        Utils.setResult('ocrResult', '<p>Không tìm thấy văn bản nào trong hình ảnh này.</p>');
        Utils.setStatus('ocrStatus', 'Phân tích hoàn tất: Không tìm thấy văn bản.');
      } else {
        Utils.setResult('ocrResult', `<p>Lỗi khi xử lý OCR: ${error.message}</p>`);
        Utils.setStatus('ocrStatus', 'Đã xảy ra lỗi khi phân tích.');
      }
    } finally {
      // Terminate worker if it exists
      if (worker) {
        await worker.terminate();
      }
      
      // Hide progress bar
      hideProgress();
    }
  }
  
  /**
   * Read OCR results aloud
   */
  function speakResults() {
    const preElement = ocrResult.querySelector('pre');
    const text = preElement ? preElement.textContent : '';
    
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN'; // Can be changed based on text language
      speechSynthesis.speak(utterance);
      Utils.setStatus('ocrStatus', 'Đang đọc văn bản...');
    } else {
      Utils.setStatus('ocrStatus', 'Không có văn bản để đọc!');
    }
  }
  
  // Public API
  return {
    init
  };
})();