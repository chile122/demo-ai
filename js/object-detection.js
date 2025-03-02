/**
 * Module for object detection using TensorFlow.js and COCO-SSD
 */
const ObjectDetection = (() => {
  // Private variables
  let cocoModel = null;
  
  // DOM Elements
  const imageInput = document.getElementById('imageInput');
  const preview = document.getElementById('preview');
  const aiStatus = document.getElementById('aiStatus');
  const aiResult = document.getElementById('aiResult');
  const imageContainer = document.getElementById('imageContainer');
  
  /**
   * Initialize the object detection module
   * @returns {Promise<void>}
   */
  async function init() {
    Utils.setStatus('aiStatus', 'Đang tải mô hình AI...');
    try {
      cocoModel = await cocoSsd.load();
      Utils.setStatus('aiStatus', 'Mô hình AI đã sẵn sàng!');
    } catch (error) {
      console.error('Lỗi tải mô hình:', error);
      Utils.setStatus('aiStatus', 'Không thể tải mô hình AI.');
    }
    
    // Set up image preview when file is chosen
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          preview.src = event.target.result;
          Utils.setStatus('aiStatus', 'Đã tải hình ảnh. Nhấn "Phát hiện đối tượng" để phân tích.');
          clearBoxes();
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Set up buttons
    document.getElementById('detectButton').addEventListener('click', detectObjects);
    document.getElementById('speakDetectionButton').addEventListener('click', speakResults);
  }
  
  /**
   * Clear bounding boxes from previous detections
   */
  function clearBoxes() {
    const boxes = imageContainer.querySelectorAll('.object-box, .object-label');
    boxes.forEach(box => box.remove());
  }
  
  /**
   * Draw a bounding box for a detected object
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Width of the bounding box
   * @param {number} height - Height of the bounding box
   * @param {string} label - Label for the detected object
   * @param {number} score - Confidence score (0-1)
   */
  function drawBox(x, y, width, height, label, score) {
    // Create bounding box
    const box = document.createElement('div');
    box.className = 'object-box';
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.style.width = `${width}px`;
    box.style.height = `${height}px`;
    
    // Create label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'object-label';
    labelDiv.style.left = `${x}px`;
    labelDiv.style.top = `${y - 20}px`;
    labelDiv.textContent = `${label} (${Math.round(score * 100)}%)`;
    
    // Add to container
    imageContainer.appendChild(box);
    imageContainer.appendChild(labelDiv);
  }
  
  /**
   * Display results of object detection
   * @param {Array} predictions - Array of detection results
   */
  function displayResults(predictions) {
    // Count objects by type
    const detectedObjects = {};
    predictions.forEach(p => {
      const { bbox, class: className, score } = p;
      drawBox(bbox[0], bbox[1], bbox[2], bbox[3], className, score);
      
      // Count each type of object
      if (detectedObjects[className]) {
        detectedObjects[className]++;
      } else {
        detectedObjects[className] = 1;
      }
    });
    
    // Create text description
    const objectDescriptions = Object.entries(detectedObjects).map(([name, count]) => 
      `${count} ${name}${count > 1 ? 's' : ''}`
    );
    
    // Display results
    if (predictions.length === 0) {
      Utils.setResult('aiResult', '<p>Không phát hiện đối tượng nào trong hình ảnh.</p>');
    } else {
      Utils.setResult('aiResult', `
        <h3>Kết quả phát hiện:</h3>
        <p>Phát hiện ${predictions.length} đối tượng: ${objectDescriptions.join(', ')}</p>
        <ul>
          ${predictions.map(p => `<li>${p.class}: ${(p.score * 100).toFixed(2)}%</li>`).join('')}
        </ul>
      `);
    }
  }
  
  /**
   * Detect objects in an image using TensorFlow.js
   */
  async function detectObjects() {
    if (!preview.src || preview.src === window.location.href) {
      Utils.setStatus('aiStatus', 'Vui lòng tải lên một hình ảnh trước!');
      return;
    }
    
    Utils.setStatus('aiStatus', 'Đang phân tích hình ảnh...');
    clearBoxes();
    
    try {
      // Check if model is loaded
      if (!cocoModel) {
        Utils.setStatus('aiStatus', 'Đang tải lại mô hình AI...');
        cocoModel = await cocoSsd.load();
      }
      
      // Perform object detection
      const predictions = await cocoModel.detect(preview);
      displayResults(predictions);
      Utils.setStatus('aiStatus', 'Phân tích hình ảnh hoàn tất!');
    } catch (error) {
      console.error('Lỗi khi phân tích hình ảnh:', error);
      Utils.setResult('aiResult', `<p>Lỗi khi phân tích hình ảnh: ${error.message}</p>`);
      Utils.setStatus('aiStatus', 'Đã xảy ra lỗi khi phân tích.');
    }
  }
  
  /**
   * Read detection results aloud
   */
  function speakResults() {
    const text = aiResult.textContent;
    
    if (text && !text.includes('Kết quả phát hiện đối tượng sẽ xuất hiện ở đây')) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      speechSynthesis.speak(utterance);
      Utils.setStatus('aiStatus', 'Đang đọc kết quả...');
    } else {
      Utils.setStatus('aiStatus', 'Không có kết quả để đọc!');
    }
  }
  
  // Public API
  return {
    init
  };
})();