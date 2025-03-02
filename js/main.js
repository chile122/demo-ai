/**
 * Main application module
 * Initializes and coordinates all other modules
 */

// Utility functions used across modules
const Utils = {
  /**
   * Set status message
   * @param {string} elementId - ID of the status element
   * @param {string} message - Message to display
   */
  setStatus(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
    }
  },
  
  /**
   * Set HTML content of a result container
   * @param {string} elementId - ID of the result element
   * @param {string} content - HTML content to set
   */
  setResult(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = content;
    }
  }
};

/**
 * Tab manager for switching between features
 */
const TabManager = (() => {
  // Tab elements
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  /**
   * Initialize the tab manager
   */
  function init() {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        openTab(tabName);
      });
    });
  }
  
  /**
   * Open a specific tab
   * @param {string} tabName - Name of the tab to open
   */
  function openTab(tabName) {
    // Hide all tab content
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`tab${tabName}`).classList.add('active');
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
  }
  
  // Public API
  return {
    init,
    openTab
  };
})();

/**
 * Initialize the application when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize tab manager
  TabManager.init();
  
  // Initialize feature modules
  ObjectDetection.init();
  OCR.init();
  SpeechToText.init();
  TextToSpeech.init();
  
  console.log('Application initialized successfully!');
});