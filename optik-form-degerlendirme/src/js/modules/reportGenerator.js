/**
 * Report Generator Module
 * Handles generation and display of individual and class reports
 */

import { calculateVARKScores, calculateHabitsScores, calculateHollandScores, calculateClassStatistics } from '../utils/calculator.js';
import { inventories } from '../config/inventories.js';

export class ReportGenerator {
    constructor() {
        this.currentStudentData = null;
        this.allStudentData = [];
        
        this.initializeDOMElements();
    }

    /**
     * Initialize DOM element references
     */
    initializeDOMElements() {
        // Individual report elements
        this.studentIdDisplay = document.getElementById('student-id-display');
        this.varkResultText = document.getElementById('vark-result-text');
        this.varkChart = document.getElementById('vark-chart');
        this.varkDetails = document.getElementById('vark-details');
        this.habitsResultText = document.getElementById('habits-result-text');
        this.habitsDetails = document.getElementById('habits-details');
        this.hollandResultCode = document.getElementById('holland-result-code');
        this.hollandResultDescriptions = document.getElementById('holland-result-descriptions');
        
        // Class report elements
        this.classReportContainer = document.getElementById('class-report-container');
    }

    /**
     * Set student data
     * @param {Array} studentData - Array of student data
     */
    setStudentData(studentData) {
        this.allStudentData = studentData;
    }

    /**
     * Generate individual report for a student
     * @param {Object} studentData - Individual student data
     */
    generateIndividualReport(studentData) {
        this.currentStudentData = studentData;
        
        // Display student info
        this.displayStudentInfo(studentData);
        
        // Generate VARK report
        this.generateVARKReport(studentData.answers.vark);
        
        // Generate Habits report
        this.generateHabitsReport(studentData.answers.workHabits);
        
        // Generate Holland report
        this.generateHollandReport(studentData.answers.holland);
        
        // Reset Gemini feedback
        this.resetGeminiFeedback();
    }

    /**
     * Display student information
     * @param {Object} studentData - Student data
     */
    displayStudentInfo(studentData) {
        let studentInfoHTML = `<strong>Öğrenci:</strong> ${studentData.name}`;
        if (studentData.class) {
            studentInfoHTML += ` <span class="mx-2 text-gray-400">|</span> <strong>Sınıf:</strong> ${studentData.class}`;
        }
        this.studentIdDisplay.innerHTML = studentInfoHTML;
    }

    /**
     * Generate VARK report
     * @param {Object} varkAnswers - VARK answers
     */
    generateVARKReport(varkAnswers) {
        const result = calculateVARKScores(varkAnswers);
        const { scores, dominantStyles, totalQuestions } = result;
        
        // Display dominant styles
        const styleNames = inventories.vark.styles;
        this.varkResultText.textContent = `Baskın Stil(ler)iniz: ${dominantStyles.map(s => styleNames[s]).join(', ')}`;
        
        // Generate chart
        this.varkChart.innerHTML = Object.entries(scores).map(([style, score]) => `
            <div class="w-full">
                <div class="flex justify-between mb-1">
                    <span class="text-base font-medium text-gray-700">${styleNames[style]}</span>
                    <span class="text-sm font-medium text-gray-700">${score} / ${totalQuestions}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-4">
                    <div class="bg-blue-500 h-4 rounded-full" style="width: ${totalQuestions > 0 ? (score / totalQuestions) * 100 : 0}%"></div>
                </div>
            </div>
        `).join('');
        
        // Generate details
        const detailsDB = inventories.vark.details;
        this.varkDetails.innerHTML = dominantStyles.length > 0 
            ? dominantStyles.map(style => `
                <div>
                    <h3 class="report-subtitle">${detailsDB[style].title}</h3>
                    <p class="text-gray-700">${detailsDB[style].desc}</p>
                    <ul class="list-disc list-inside mt-2 space-y-1 text-gray-600">
                        ${detailsDB[style].oneriler.map(o => `<li>${o}</li>`).join('')}
                    </ul>
                </div>
            `).join('')
            : '<p class="text-gray-600">Öğrenme stilinizle ilgili bir baskınlık tespit edilemedi. Bu, birden fazla öğrenme stilini dengeli kullandığınız anlamına gelebilir (multimodal).</p>';
    }

    /**
     * Generate Habits report
     * @param {Object} habitsAnswers - Work habits answers
     */
    generateHabitsReport(habitsAnswers) {
        const result = calculateHabitsScores(habitsAnswers);
        const { totalScore, maxScore, categoryScores, feedback } = result;
        
        // Display total score and feedback
        this.habitsResultText.textContent = `Toplam Puanınız: ${totalScore} / ${maxScore}. ${feedback}`;
        
        // Generate category details
        const categoryDetails = inventories.workHabits.categoryDetails;
        
        this.habitsDetails.innerHTML = Object.entries(categoryScores).map(([category, data]) => {
            const { percentage, status } = data;
            const color = percentage > 66 ? 'bg-green-500' : percentage > 33 ? 'bg-yellow-500' : 'bg-red-500';
            const statusText = categoryDetails[category][status];
            
            return `
                <div class="mb-4">
                    <h3 class="report-subtitle !mt-0">${category}</h3>
                    <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div class="${color} h-4 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <p class="text-gray-600">${statusText}</p>
                </div>
            `;
        }).join('');
    }

    /**
     * Generate Holland report
     * @param {Object} hollandAnswers - Holland answers
     */
    generateHollandReport(hollandAnswers) {
        const result = calculateHollandScores(hollandAnswers);
        const { hollandCode, topThree } = result;
        
        // Display Holland code
        this.hollandResultCode.textContent = hollandCode;
        
        // Generate descriptions
        const descriptions = inventories.holland.types;
        
        this.hollandResultDescriptions.innerHTML = topThree.map(([code]) => {
            const data = descriptions[code];
            return `
                <div class="border-l-4 border-purple-500 pl-4">
                    <h3 class="text-xl font-bold text-gray-800">${data.title} (${code})</h3>
                    <p class="text-gray-600 my-1"><em>${data.keywords}</em></p>
                    <p class="text-gray-700 my-2">${data.desc}</p>
                    <p class="text-sm text-purple-800 font-medium">
                        <strong>Örnek Meslekler:</strong> ${data.jobs}
                    </p>
                    <p class="text-sm text-purple-800 font-medium mt-1">
                        <strong>İlgili Üniversite Alanları:</strong> ${data.majors}
                    </p>
                </div>
            `;
        }).join('');
    }

    /**
     * Generate class report
     */
    generateClassReport() {
        const stats = calculateClassStatistics(this.allStudentData);
        
        if (!stats) {
            this.classReportContainer.innerHTML = '<p>Rapor oluşturmak için veri bulunamadı.</p>';
            return;
        }
        
        const { studentCount, varkSummary, habitsAverages, hollandSummary } = stats;
        
        // Sort summaries
        const sortedVark = Object.entries(varkSummary).sort(([, a], [, b]) => b - a);
        const sortedHabits = [...habitsAverages].sort(([, a], [, b]) => b - a);
        const sortedHolland = Object.entries(hollandSummary).sort(([, a], [, b]) => b - a);
        
        // Generate HTML
        this.classReportContainer.innerHTML = this.generateClassReportHTML(
            studentCount,
            sortedVark,
            sortedHabits,
            habitsAverages,
            sortedHolland
        );
    }

    /**
     * Generate class report HTML
     */
    generateClassReportHTML(studentCount, sortedVark, sortedHabits, habitsAverages, sortedHolland) {
        const styleNames = inventories.vark.styles;
        const hollandTypes = inventories.holland.types;
        
        const dominantClassStyle = styleNames[sortedVark[0][0]];
        const strongestHabit = sortedHabits[0];
        const weakestHabit = sortedHabits[sortedHabits.length - 1];
        
        // VARK Chart
        const varkChartHTML = sortedVark.map(([style, count]) => `
            <div class="w-full">
                <div class="flex justify-between mb-1">
                    <span class="text-base font-medium text-gray-700">${styleNames[style]}</span>
                    <span class="text-sm font-medium text-gray-700">${count} öğrenci (%${((count/studentCount)*100).toFixed(0)})</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-4">
                    <div class="bg-blue-500 h-4 rounded-full" style="width: ${studentCount > 0 ? (count / studentCount) * 100 : 0}%"></div>
                </div>
            </div>
        `).join('');
        
        // Habits Average Chart
        const habitsAvgHTML = habitsAverages.map(([category, avgScore]) => {
            const percentage = (avgScore / 3) * 100;
            const color = percentage > 66 ? 'bg-green-500' : percentage > 33 ? 'bg-yellow-500' : 'bg-red-500';
            return `
                <div class="w-full">
                    <div class="flex justify-between mb-1">
                        <span class="text-base font-medium text-gray-700">${category}</span>
                        <span class="text-sm font-medium text-gray-700">Ortalama Puan: ${avgScore.toFixed(2)} / 3.00</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="${color} h-4 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Holland List
        const hollandListHTML = sortedHolland.map(([code, count], index) => `
            <li class="flex justify-between p-2 rounded-md ${index === 0 ? 'bg-purple-100' : ''}">
                <span class="font-semibold">${hollandTypes[code].title}</span>
                <span class="text-gray-600">${count} öğrenci</span>
            </li>
        `).join('');
        
        return `
            <div class="report-section">
                <h2 class="report-title text-blue-700">Sınıfın Öğrenme Stili Dağılımı</h2>
                <div class="space-y-3">${varkChartHTML}</div>
                <div class="mt-4 pt-4 border-t">
                    <h3 class="report-subtitle">Genel Değerlendirme ve Öneriler</h3>
                    <p class="text-gray-700">
                        Sınıfın genel öğrenme profili <strong>${dominantClassStyle}</strong> ağırlıklıdır.
                        Bu, öğrencilerin büyük bir kısmının bilgiyi 
                        ${this.getStyleDescription(dominantClassStyle)} 
                        daha iyi anladığını göstermektedir.
                    </p>
                </div>
            </div>
            
            <div class="report-section">
                <h2 class="report-title text-green-700">Sınıfın Çalışma Alışkanlıkları Özeti</h2>
                <div class="space-y-3">${habitsAvgHTML}</div>
                <div class="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
                    <div>
                        <h3 class="report-subtitle">Sınıfın Güçlü Yönü</h3>
                        <div class="p-3 bg-green-100 rounded-lg text-green-800">
                            <p class="font-semibold">${strongestHabit[0]}</p>
                            <p class="text-sm">
                                Sınıf genel olarak bu alanda başarılıdır. 
                                Bu olumlu alışkanlığı pekiştirmek için grup liderliği ve 
                                akran öğretimi gibi yöntemler kullanılabilir.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 class="report-subtitle">Geliştirilmesi Gereken Alan</h3>
                        <div class="p-3 bg-red-100 rounded-lg text-red-800">
                            <p class="font-semibold">${weakestHabit[0]}</p>
                            <p class="text-sm">
                                Sınıfın bu alandaki ortalaması diğerlerine göre daha düşüktür. 
                                Bu konuyla ilgili yapılacak grup rehberliği çalışmaları 
                                (örneğin, zaman yönetimi, etkili not tutma teknikleri) faydalı olacaktır.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h2 class="report-title text-purple-700">Sınıfın Mesleki İlgi Yönelimleri</h2>
                <ul class="space-y-1">${hollandListHTML}</ul>
                <div class="mt-4 pt-4 border-t">
                    <h3 class="report-subtitle">Genel Mesleki Profil</h3>
                    <p class="text-gray-700">
                        Sınıfın en baskın üç ilgi alanı 
                        <strong>${hollandTypes[sortedHolland[0][0]].title}</strong>, 
                        <strong>${hollandTypes[sortedHolland[1][0]].title}</strong> ve 
                        <strong>${hollandTypes[sortedHolland[2][0]].title}</strong> 
                        olarak öne çıkmaktadır.
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Get style description for class report
     */
    getStyleDescription(style) {
        const descriptions = {
            'Görsel': 'görsel materyallerle',
            'İşitsel': 'dinleyerek ve tartışarak',
            'Okuma/Yazma': 'yazılı metinlerle',
            'Kinestetik': 'uygulama yaparak'
        };
        return descriptions[style] || '';
    }

    /**
     * Reset Gemini feedback
     */
    resetGeminiFeedback() {
        const container = document.getElementById('gemini-feedback-container');
        if (container) {
            container.innerHTML = 'Öğrencinin kişiselleştirilmiş değerlendirmesini oluşturmak için butona tıklayın.';
        }
        
        const button = document.getElementById('gemini-feedback-button');
        if (button) {
            button.disabled = false;
            button.innerHTML = `
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
                Geri Bildirim Oluştur
            `;
        }
    }

    /**
     * Get current student data
     * @returns {Object} Current student data
     */
    getCurrentStudentData() {
        return this.currentStudentData;
    }
}