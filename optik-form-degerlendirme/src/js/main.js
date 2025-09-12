/**
 * Main Application Entry Point
 * Initializes and coordinates all modules
 */

import { ProfileManager } from './config/profiles.js';
import { FileHandler } from './modules/fileHandler.js';
import { ReportGenerator } from './modules/reportGenerator.js';
import { PDFExporter } from './modules/pdfExporter.js';
import { GeminiIntegration } from './modules/geminiIntegration.js';
import { reportStorage } from './utils/storage.js';

class OptikFormApp {
    constructor() {
        this.profileManager = new ProfileManager();
        this.fileHandler = new FileHandler(this.profileManager);
        this.reportGenerator = new ReportGenerator();
        this.pdfExporter = new PDFExporter();
        this.geminiIntegration = new GeminiIntegration();
        
        this.allStudentData = [];
        this.currentStudentIndex = 0;
        
        this.initializeDOMElements();
        this.initializeEventListeners();
        this.initializeUI();
    }

    /**
     * Initialize DOM element references
     */
    initializeDOMElements() {
        // Screens
        this.uploadScreen = document.getElementById('upload-screen');
        this.resultsScreen = document.getElementById('results-screen');
        
        // Navigation
        this.individualReportTab = document.getElementById('individual-report-tab');
        this.classReportTab = document.getElementById('class-report-tab');
        this.individualReportView = document.getElementById('individual-report-view');
        this.classReportView = document.getElementById('class-report-view');
        
        // Controls
        this.studentSelector = document.getElementById('student-selector');
        this.restartButton = document.getElementById('restart-button');
        this.pdfButton = document.getElementById('pdf-button');
        this.classInfo = document.getElementById('class-info');
        
        // Settings Modal
        this.settingsButton = document.getElementById('settings-button');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeModalButton = document.getElementById('close-modal-button');
        this.saveProfileButton = document.getElementById('save-profile-button');
        this.newProfileButton = document.getElementById('new-profile-button');
        this.deleteProfileButton = document.getElementById('delete-profile-button');
        this.modalProfileSelector = document.getElementById('modal-profile-selector');
        this.profileNameInput = document.getElementById('profile-name-input');
        this.modalMessage = document.getElementById('modal-message');
        this.modalInputs = document.querySelectorAll('#settings-modal input[data-key]');
        
        // Saved Reports
        this.savedReportsSelector = document.getElementById('saved-reports-selector');
        this.loadSavedReportButton = document.getElementById('load-saved-report-button');
        this.deleteSavedReportButton = document.getElementById('delete-saved-report-button');
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // File processing events
        document.addEventListener('fileProcessed', (event) => this.handleFileProcessed(event));
        document.addEventListener('uploadSuccess', (event) => this.handleUploadSuccess(event));
        
        // Student data request for Gemini
        document.addEventListener('requestStudentData', () => this.handleStudentDataRequest());
        
        // Navigation
        this.individualReportTab.addEventListener('click', () => this.showIndividualReport());
        this.classReportTab.addEventListener('click', () => this.showClassReport());
        
        // Student selector
        this.studentSelector.addEventListener('change', (event) => {
            this.currentStudentIndex = parseInt(event.target.value);
            this.displayResultsForStudent(this.currentStudentIndex);
        });
        
        // Control buttons
        this.restartButton.addEventListener('click', () => this.restart());
        this.pdfButton.addEventListener('click', () => this.exportPDF());
        
        // Settings modal
        this.settingsButton.addEventListener('click', () => this.openSettingsModal());
        this.closeModalButton.addEventListener('click', () => this.closeSettingsModal());
        this.saveProfileButton.addEventListener('click', () => this.saveCurrentProfile());
        this.newProfileButton.addEventListener('click', () => this.clearModalForm());
        this.deleteProfileButton.addEventListener('click', () => this.deleteCurrentProfile());
        this.modalProfileSelector.addEventListener('change', () => this.populateModalForm());
        
        // Saved reports
        this.loadSavedReportButton.addEventListener('click', () => this.loadSavedReport());
        this.deleteSavedReportButton.addEventListener('click', () => this.deleteSavedReport());
    }

    /**
     * Initialize UI
     */
    initializeUI() {
        this.updateProfileSelectors();
        this.updateSavedReportsSelector();
        this.populateModalForm();
    }

    /**
     * Handle file processed event
     */
    handleFileProcessed(event) {
        const { fileName, studentData } = event.detail;
        this.allStudentData = studentData;
        this.reportGenerator.setStudentData(studentData);
        this.switchToResultsScreen(`Yüklenen Dosya: ${fileName} (${studentData.length} öğrenci bulundu)`);
    }

    /**
     * Handle upload success event
     */
    handleUploadSuccess(event) {
        const { message } = event.detail;
        console.log('Upload success:', message);
    }

    /**
     * Handle student data request from Gemini
     */
    handleStudentDataRequest() {
        const currentStudent = this.allStudentData[this.currentStudentIndex];
        const event = new CustomEvent('studentDataResponse', {
            detail: { studentData: currentStudent }
        });
        document.dispatchEvent(event);
    }

    /**
     * Switch to results screen
     */
    switchToResultsScreen(infoText) {
        this.uploadScreen.classList.add('hidden');
        this.resultsScreen.classList.remove('hidden');
        this.classInfo.textContent = infoText;
        this.populateStudentSelector();
        this.displayResultsForStudent(0);
        this.showIndividualReport();
    }

    /**
     * Populate student selector
     */
    populateStudentSelector() {
        this.studentSelector.innerHTML = '';
        this.allStudentData.forEach((student, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = student.name;
            this.studentSelector.appendChild(option);
        });
    }

    /**
     * Display results for a specific student
     */
    displayResultsForStudent(studentIndex) {
        const studentData = this.allStudentData[studentIndex];
        if (!studentData) return;
        
        this.currentStudentIndex = studentIndex;
        this.reportGenerator.generateIndividualReport(studentData);
    }

    /**
     * Show individual report view
     */
    showIndividualReport() {
        this.individualReportView.classList.remove('hidden');
        this.classReportView.classList.add('hidden');
        this.individualReportTab.classList.add('active');
        this.classReportTab.classList.remove('active');
        this.pdfButton.style.display = 'flex';
    }

    /**
     * Show class report view
     */
    showClassReport() {
        this.individualReportView.classList.add('hidden');
        this.classReportView.classList.remove('hidden');
        this.individualReportTab.classList.remove('active');
        this.classReportTab.classList.add('active');
        this.pdfButton.style.display = 'none';
        this.reportGenerator.generateClassReport();
    }

    /**
     * Restart application
     */
    restart() {
        this.uploadScreen.classList.remove('hidden');
        this.resultsScreen.classList.add('hidden');
        this.fileHandler.reset();
        this.allStudentData = [];
        this.currentStudentIndex = 0;
    }

    /**
     * Export current report to PDF
     */
    async exportPDF() {
        const currentStudent = this.allStudentData[this.currentStudentIndex];
        if (!currentStudent) {
            alert("Lütfen bir öğrenci seçin.");
            return;
        }
        
        await this.pdfExporter.exportIndividualReport(currentStudent);
    }

    /**
     * Settings Modal Functions
     */
    openSettingsModal() {
        this.settingsModal.classList.remove('hidden');
    }

    closeSettingsModal() {
        this.settingsModal.classList.add('hidden');
    }

    updateProfileSelectors() {
        this.fileHandler.updateProfileSelector();
        
        const profileNames = this.profileManager.getProfileNames();
        this.modalProfileSelector.innerHTML = '';
        
        if (profileNames.length === 0) {
            this.modalProfileSelector.innerHTML = '<option value="">Özel profil bulunmuyor</option>';
        } else {
            profileNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                this.modalProfileSelector.appendChild(option);
            });
        }
    }

    populateModalForm() {
        const selectedProfileName = this.modalProfileSelector.value;
        if (!selectedProfileName) {
            this.clearModalForm();
            return;
        }
        
        const profileData = this.profileManager.getProfile(selectedProfileName);
        if (!profileData) {
            this.clearModalForm();
            return;
        }
        
        this.profileNameInput.value = selectedProfileName;
        this.modalInputs.forEach(input => {
            input.value = profileData[input.dataset.key] || '';
        });
    }

    clearModalForm() {
        this.profileNameInput.value = '';
        this.modalInputs.forEach(input => input.value = '');
        this.profileNameInput.focus();
    }

    saveCurrentProfile() {
        const profileName = this.profileNameInput.value.trim();
        if (!profileName) {
            this.showModalMessage('Profil adı boş olamaz.', 'red');
            return;
        }
        
        const newProfileData = {};
        this.modalInputs.forEach(input => {
            newProfileData[input.dataset.key] = parseInt(input.value, 10) || 0;
        });
        
        const oldProfileName = this.modalProfileSelector.value;
        if (oldProfileName && oldProfileName !== profileName) {
            this.profileManager.deleteProfile(oldProfileName);
        }
        
        this.profileManager.saveProfile(profileName, newProfileData);
        this.showModalMessage(`'${profileName}' profili başarıyla kaydedildi.`, 'green');
        this.updateProfileSelectors();
        this.modalProfileSelector.value = profileName;
    }

    deleteCurrentProfile() {
        const profileName = this.modalProfileSelector.value;
        if (!profileName) return;
        
        if (confirm(`'${profileName}' profilini silmek istediğinizden emin misiniz?`)) {
            this.profileManager.deleteProfile(profileName);
            this.showModalMessage(`'${profileName}' profili silindi.`, 'green');
            this.updateProfileSelectors();
            this.populateModalForm();
        }
    }

    showModalMessage(message, color) {
        this.modalMessage.textContent = message;
        this.modalMessage.className = `text-center text-sm mt-4 text-${color}-600`;
        setTimeout(() => {
            this.modalMessage.textContent = '';
        }, 3000);
    }

    /**
     * Saved Reports Functions
     */
    updateSavedReportsSelector() {
        const reportNames = reportStorage.getReportNames();
        
        this.savedReportsSelector.innerHTML = '';
        
        if (reportNames.length === 0) {
            this.savedReportsSelector.innerHTML = '<option value="">Kaydedilmiş rapor yok</option>';
            this.loadSavedReportButton.disabled = true;
            this.deleteSavedReportButton.disabled = true;
        } else {
            reportNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                this.savedReportsSelector.appendChild(option);
            });
            this.loadSavedReportButton.disabled = false;
            this.deleteSavedReportButton.disabled = false;
        }
    }

    loadSavedReport() {
        const selectedReportName = this.savedReportsSelector.value;
        const reportData = reportStorage.getReport(selectedReportName);
        
        if (reportData) {
            this.allStudentData = reportData;
            this.reportGenerator.setStudentData(reportData);
            this.switchToResultsScreen(`Yüklenen Rapor: ${selectedReportName} (${reportData.length} öğrenci)`);
        } else {
            alert('Lütfen geçerli bir rapor seçin.');
        }
    }

    deleteSavedReport() {
        const selectedReportName = this.savedReportsSelector.value;
        
        if (selectedReportName && reportStorage.getReport(selectedReportName)) {
            if (confirm(`'${selectedReportName}' raporunu kalıcı olarak silmek istediğinizden emin misiniz?`)) {
                reportStorage.deleteReport(selectedReportName);
                this.updateSavedReportsSelector();
                alert('Rapor silindi.');
            }
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OptikFormApp();
});