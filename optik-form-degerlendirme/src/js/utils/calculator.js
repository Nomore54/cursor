/**
 * Score Calculator Utilities
 * Handles calculation of scores for different inventories
 */

import { inventories } from '../config/inventories.js';

/**
 * Calculate VARK scores from answers
 * @param {Object} varkAnswers - VARK answer object
 * @returns {Object} Calculated scores and dominant styles
 */
export function calculateVARKScores(varkAnswers) {
    const scores = { V: 0, A: 0, R: 0, K: 0 };
    
    Object.values(varkAnswers).forEach(answer => {
        if (scores.hasOwnProperty(answer)) {
            scores[answer]++;
        }
    });
    
    const maxScore = Math.max(...Object.values(scores));
    const dominantStyles = Object.keys(scores).filter(
        style => scores[style] === maxScore && maxScore > 0
    );
    
    return {
        scores,
        maxScore,
        dominantStyles,
        totalQuestions: inventories.vark.questions.length
    };
}

/**
 * Calculate Work Habits scores from answers
 * @param {Object} habitsAnswers - Work habits answer object
 * @returns {Object} Calculated scores and category breakdowns
 */
export function calculateHabitsScores(habitsAnswers) {
    let totalScore = Object.values(habitsAnswers).reduce((sum, score) => sum + score, 0);
    const maxScore = 60;
    
    // Calculate category scores
    const categoryScores = {};
    
    for (const category in inventories.workHabits.categories) {
        const questionNumbers = inventories.workHabits.categories[category];
        let categoryScore = 0;
        
        questionNumbers.forEach(qNum => {
            if (habitsAnswers[qNum - 1]) {
                categoryScore += habitsAnswers[qNum - 1];
            }
        });
        
        const categoryMaxScore = questionNumbers.length * 3;
        const percentage = categoryMaxScore > 0 ? (categoryScore / categoryMaxScore) * 100 : 0;
        
        categoryScores[category] = {
            score: categoryScore,
            maxScore: categoryMaxScore,
            percentage,
            status: getHabitsStatus(percentage)
        };
    }
    
    return {
        totalScore,
        maxScore,
        categoryScores,
        feedback: getHabitsFeedback(totalScore)
    };
}

/**
 * Get habits status based on percentage
 * @param {number} percentage - Score percentage
 * @returns {string} Status level
 */
function getHabitsStatus(percentage) {
    if (percentage > 66) return 'iyi';
    if (percentage > 33) return 'orta';
    return 'zayif';
}

/**
 * Get habits feedback based on total score
 * @param {number} totalScore - Total habits score
 * @returns {string} Feedback message
 */
function getHabitsFeedback(totalScore) {
    if (totalScore >= 50) return "Mükemmel! Çok verimli çalışma alışkanlıklarına sahipsiniz.";
    if (totalScore >= 40) return "İyi! Alışkanlıklarınız genel olarak verimli.";
    if (totalScore >= 30) return "Orta. Geliştirilecek alanlar mevcut.";
    return "Geliştirilmeli. Yeni stratejiler denemeniz faydalı olacaktır.";
}

/**
 * Calculate Holland scores from answers
 * @param {Object} hollandAnswers - Holland answer object
 * @returns {Object} Calculated scores and Holland code
 */
export function calculateHollandScores(hollandAnswers) {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    inventories.holland.questions.forEach((question, index) => {
        if (hollandAnswers[index] === 1) {
            scores[question.type]++;
        }
    });
    
    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const hollandCode = sortedScores.slice(0, 3).map(entry => entry[0]).join('');
    const topThree = sortedScores.slice(0, 3);
    
    return {
        scores,
        sortedScores,
        hollandCode,
        topThree
    };
}

/**
 * Calculate class-wide statistics
 * @param {Array} allStudentData - Array of all student data
 * @returns {Object} Class statistics
 */
export function calculateClassStatistics(allStudentData) {
    const studentCount = allStudentData.length;
    
    if (studentCount === 0) {
        return null;
    }
    
    // VARK Summary
    const varkSummary = { V: 0, A: 0, R: 0, K: 0 };
    
    allStudentData.forEach(student => {
        const varkResult = calculateVARKScores(student.answers.vark);
        varkResult.dominantStyles.forEach(style => varkSummary[style]++);
    });
    
    // Habits Summary
    const habitsSummary = {
        "Planlama ve Organizasyon": 0,
        "Dikkat ve Çalışma Ortamı": 0,
        "Aktif Öğrenme Yöntemleri": 0,
        "İstikrar ve Motivasyon": 0
    };
    
    allStudentData.forEach(student => {
        const habitsResult = calculateHabitsScores(student.answers.workHabits);
        for (const category in habitsResult.categoryScores) {
            habitsSummary[category] += habitsResult.categoryScores[category].score / 
                inventories.workHabits.categories[category].length;
        }
    });
    
    const habitsAverages = Object.entries(habitsSummary).map(
        ([category, totalAvg]) => ([category, totalAvg / studentCount])
    );
    
    // Holland Summary
    const hollandSummary = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    allStudentData.forEach(student => {
        const hollandResult = calculateHollandScores(student.answers.holland);
        hollandResult.topThree.forEach(([code]) => {
            hollandSummary[code]++;
        });
    });
    
    return {
        studentCount,
        varkSummary,
        habitsAverages,
        hollandSummary
    };
}