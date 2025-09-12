/**
 * File Handler Module
 * Manages file upload and processing
 */

import { parseTxtContentDefault, parseTxtContentWithProfile } from '../utils/parser.js';
import { reportStorage } from '../utils/storage.js';

export class FileHandler {
    constructor(profileManager) {
        this.profileManager = profileManager;
        this.fileInput = document.getElementById('file-input');
        this.fileInputName = document.getElementById('file-input-name');
        this.uploadError = document.getElementById('upload-error');
        this.profileSelector = document.getElementById('profile-selector');
        
        this.initializeEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        this.fileInput.addEventListener('change', (event) => this.handleFileUpload(event));
    }

    /**
     * Handle file upload
     * @param {Event} event - File input change event
     */
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.fileInputName.textContent = file.name;
        this.uploadError.textContent = '';
        
        const selectedProfileName = this.profileSelector.value;
        const customProfile = this.profileManager.getProfile(selectedProfileName);

        try {
            const content = await file.text();
            let parsedData;
            
            if (selectedProfileName === 'default') {
                parsedData = parseTxtContentDefault(content);
            } else if (customProfile) {
                parsedData = parseTxtContentWithProfile(content, customProfile);
            } else {
                throw new Error("Lütfen geçerli bir optik form ayarı seçin.");
            }

            if (parsedData.length > 0) {
                // Save report data
                reportStorage.saveReport(file.name, parsedData);
                
                // Dispatch custom event with parsed data
                const event = new CustomEvent('fileProcessed', {
                    detail: {
                        fileName: file.name,
                        studentData: parsedData
                    }
                });
                document.dispatchEvent(event);
                
                this.showSuccess(`${file.name} başarıyla yüklendi (${parsedData.length} öğrenci bulundu)`);
            } else {
                throw new Error("Dosya okundu ancak geçerli öğrenci verisi bulunamadı.");
            }
        } catch (error) {
            this.showError(error.message);
            console.error(error);
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.uploadError.textContent = `Hata: ${message}`;
        this.uploadError.classList.add('fade-in');
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        // Dispatch success event
        const event = new CustomEvent('uploadSuccess', {
            detail: { message }
        });
        document.dispatchEvent(event);
    }

    /**
     * Reset file input
     */
    reset() {
        this.fileInput.value = '';
        this.fileInputName.textContent = "Yeni Veri (.txt) Dosyası Seçin";
        this.uploadError.textContent = '';
    }

    /**
     * Update profile selector
     */
    updateProfileSelector() {
        const profileNames = this.profileManager.getProfileNames();
        
        this.profileSelector.innerHTML = '<option value="default">Varsayılan Sekonic Profili</option>';
        profileNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            this.profileSelector.appendChild(option);
        });
    }
}