/**
 * Gemini AI Integration Module
 * Handles AI-powered feedback generation
 */

import { calculateVARKScores, calculateHabitsScores, calculateHollandScores } from '../utils/calculator.js';
import { settingsStorage } from '../utils/storage.js';

export class GeminiIntegration {
    constructor() {
        this.apiKey = settingsStorage.getSetting('geminiApiKey') || '';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';
        
        this.button = document.getElementById('gemini-feedback-button');
        this.container = document.getElementById('gemini-feedback-container');
        
        this.initializeEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        if (this.button) {
            this.button.addEventListener('click', () => this.generateFeedback());
        }
    }

    /**
     * Set API key
     * @param {string} apiKey - Gemini API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        settingsStorage.setSetting('geminiApiKey', apiKey);
    }

    /**
     * Generate AI feedback for current student
     */
    async generateFeedback() {
        // Get current student data from the report generator
        const event = new CustomEvent('requestStudentData');
        document.dispatchEvent(event);
        
        // Wait for student data response
        const studentData = await this.waitForStudentData();
        
        if (!studentData) {
            this.showError('Lütfen önce listeden bir öğrenci seçin.');
            return;
        }

        if (!this.apiKey) {
            this.showError('Gemini API anahtarı tanımlı değil. Lütfen ayarlardan API anahtarınızı girin.');
            return;
        }

        await this.getFeedback(studentData);
    }

    /**
     * Wait for student data response
     * @returns {Promise<Object>} Student data
     */
    waitForStudentData() {
        return new Promise((resolve) => {
            const handler = (event) => {
                document.removeEventListener('studentDataResponse', handler);
                resolve(event.detail.studentData);
            };
            document.addEventListener('studentDataResponse', handler);
            
            // Timeout after 1 second
            setTimeout(() => {
                document.removeEventListener('studentDataResponse', handler);
                resolve(null);
            }, 1000);
        });
    }

    /**
     * Get AI feedback from Gemini API
     * @param {Object} studentData - Student data
     */
    async getFeedback(studentData) {
        this.setLoadingState(true);
        
        try {
            // Calculate scores
            const varkResult = calculateVARKScores(studentData.answers.vark);
            const habitsResult = calculateHabitsScores(studentData.answers.workHabits);
            const hollandResult = calculateHollandScores(studentData.answers.holland);
            
            // Prepare prompt
            const prompt = this.preparePrompt(studentData, varkResult, habitsResult, hollandResult);
            
            // Make API request
            const response = await this.makeApiRequest(prompt, studentData.name);
            
            // Display response
            this.displayFeedback(response);
            
        } catch (error) {
            console.error('Gemini API error:', error);
            this.showError(`Bir hata oluştu: ${error.message}\nLütfen daha sonra tekrar deneyin.`);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Prepare prompt for Gemini API
     */
    preparePrompt(studentData, varkResult, habitsResult, hollandResult) {
        const varkStyles = {
            V: "Görsel",
            A: "İşitsel",
            R: "Okuma/Yazma",
            K: "Kinestetik"
        };
        
        const varkText = varkResult.dominantStyles
            .map(s => varkStyles[s])
            .join(', ') || 'Belirlenmedi';
        
        return `
            ${studentData.name} adlı öğrenci için aşağıdaki profile göre bir değerlendirme metni oluştur:
            - Baskın Öğrenme Stili(leri): ${varkText}
            - Çalışma Alışkanlıkları Puanı: ${habitsResult.totalScore} / ${habitsResult.maxScore}
            - Holland Meslek Kodu: ${hollandResult.hollandCode}
            
            Bu üç alanı birleştirerek öğrencinin potansiyelini nasıl en üst düzeye çıkarabileceğine, 
            zayıf yönlerini nasıl geliştirebileceğine ve güçlü yönlerini nasıl kullanabileceğine dair 
            somut ve pozitif tavsiyeler ver.
        `;
    }

    /**
     * Make API request to Gemini
     */
    async makeApiRequest(userQuery, studentName) {
        const systemPrompt = `
            Sen uzman bir eğitim ve kariyer danışmanısın. 
            Bir öğrencinin envanter sonuçlarına dayanarak, bütünsel, cesaretlendirici ve uygulanabilir tavsiyeler sun. 
            Cevabını mutlaka Türkçe olarak, öğrenciye doğrudan hitap edecek şekilde (sen diliyle), 
            'Sevgili ${studentName},' diye başlayarak yaz. 
            Geri bildirimi başlıklar halinde (Öğrenme Tarzın, Çalışma Alışkanlıkların, Kariyer Eğilimlerin, Genel Tavsiyeler) 
            ve paragraflarla, anlaşılır bir dille sun.
        `;
        
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };
        
        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API Hatası: ${response.status} - ${errorBody.error?.message || 'Bilinmeyen Hata'}`);
        }
        
        const result = await response.json();
        const candidate = result.candidates?.[0];
        
        if (candidate && candidate.content?.parts?.[0]?.text) {
            return candidate.content.parts[0].text.replace(/\*/g, '');
        } else {
            throw new Error("API'den geçerli bir yanıt alınamadı.");
        }
    }

    /**
     * Display feedback in container
     */
    displayFeedback(feedback) {
        if (this.container) {
            this.container.innerHTML = feedback;
            this.container.classList.add('fade-in');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.container) {
            this.container.innerHTML = message;
            this.container.classList.add('text-red-600');
        }
    }

    /**
     * Set loading state
     */
    setLoadingState(loading) {
        if (!this.button) return;
        
        if (loading) {
            this.button.disabled = true;
            this.button.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Değerlendirme oluşturuluyor...
            `;
            
            if (this.container) {
                this.container.innerHTML = 'Yapay zeka, öğrencinin profilini analiz ediyor. Bu işlem biraz zaman alabilir...';
                this.container.classList.remove('text-red-600');
            }
        } else {
            this.button.disabled = false;
            this.button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18l-2 4 4-2 16.36-16.36a1.21 1.21 0 0 0 0-1.72Z"/>
                    <path d="m14 7 3 3"/>
                    <path d="M5 6v4"/>
                    <path d="M19 14v4"/>
                    <path d="M10 2v2"/>
                    <path d="M7 8H3"/>
                    <path d="M21 16h-4"/>
                    <path d="M11 3H9"/>
                </svg>
                Yeniden Geri Bildirim Oluştur
            `;
        }
    }
}