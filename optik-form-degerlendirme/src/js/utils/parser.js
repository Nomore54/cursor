/**
 * File Parser Utilities
 * Handles parsing of optical form text files
 */

import { inventories, answerMappings } from '../config/inventories.js';
import { defaultProfile } from '../config/profiles.js';

/**
 * Parse text file content using default profile
 * @param {string} fileContent - Raw text content from file
 * @returns {Array} Array of parsed student data
 */
export function parseTxtContentDefault(fileContent) {
    const studentDataList = [];
    const lines = fileContent.split('\n').filter(line => line.trim().length > 10);
    
    lines.forEach(line => {
        const studentData = {
            name: line.substring(defaultProfile.nameStart - 1, defaultProfile.nameEnd).trim(),
            class: null,
            answers: { vark: {}, workHabits: {}, holland: {} }
        };
        
        if (!studentData.name) return;
        
        // Parse Holland answers
        const hollandAnswersStr = line.substring(defaultProfile.hollandStart - 1, defaultProfile.hollandEnd);
        for (let i = 0; i < inventories.holland.questions.length; i++) {
            const answerChar = hollandAnswersStr[i];
            if (answerChar && answerChar.trim() !== '') {
                studentData.answers.holland[i] = answerMappings.holland[answerChar];
            }
        }
        
        // Parse VARK and Habits answers
        const varkAndHabitsStr = line.substring(defaultProfile.varkStart - 1, defaultProfile.habitsEnd);
        const varkAnswersStr = varkAndHabitsStr.substring(0, 8);
        const habitsAnswersStr = varkAndHabitsStr.substring(8, 28);
        
        // Parse VARK answers
        for (let i = 0; i < inventories.vark.questions.length; i++) {
            const answerChar = varkAnswersStr[i];
            if (answerChar && answerChar.trim() !== '') {
                studentData.answers.vark[i] = answerMappings.vark[answerChar];
            }
        }
        
        // Parse Habits answers
        for (let i = 0; i < inventories.workHabits.questions.length; i++) {
            const answerChar = habitsAnswersStr[i];
            if (answerChar && answerChar.trim() !== '') {
                if (inventories.workHabits.reverseQuestions.includes(i + 1)) {
                    studentData.answers.workHabits[i] = 4 - answerMappings.habits[answerChar];
                } else {
                    studentData.answers.workHabits[i] = answerMappings.habits[answerChar];
                }
            }
        }
        
        studentDataList.push(studentData);
    });
    
    return studentDataList;
}

/**
 * Parse text file content using custom profile
 * @param {string} fileContent - Raw text content from file
 * @param {Object} profile - Custom profile configuration
 * @returns {Array} Array of parsed student data
 */
export function parseTxtContentWithProfile(fileContent, profile) {
    const studentDataList = [];
    const lines = fileContent.split('\n').filter(line => line.trim().length > 10);
    
    lines.forEach(line => {
        const studentName = line.substring((profile.nameStart || 1) - 1, profile.nameEnd || 0).trim();
        if (!studentName) return;
        
        const studentClass = (profile.classStart && profile.classEnd)
            ? line.substring(profile.classStart - 1, profile.classEnd).trim()
            : null;
        
        const studentData = {
            name: studentName,
            class: studentClass,
            answers: { vark: {}, workHabits: {}, holland: {} }
        };
        
        // Parse VARK answers
        const varkAnswersStr = line.substring((profile.varkStart || 1) - 1, profile.varkEnd || 0);
        for (let i = 0; i < varkAnswersStr.length && i < inventories.vark.questions.length; i++) {
            if (varkAnswersStr[i] && varkAnswersStr[i].trim() !== '') {
                studentData.answers.vark[i] = answerMappings.vark[varkAnswersStr[i]];
            }
        }
        
        // Parse Habits answers
        const habitsAnswersStr = line.substring((profile.habitsStart || 1) - 1, profile.habitsEnd || 0);
        for (let i = 0; i < habitsAnswersStr.length && i < inventories.workHabits.questions.length; i++) {
            const answerChar = habitsAnswersStr[i];
            if (answerChar && answerChar.trim() !== '') {
                if (inventories.workHabits.reverseQuestions.includes(i + 1)) {
                    studentData.answers.workHabits[i] = 4 - answerMappings.habits[answerChar];
                } else {
                    studentData.answers.workHabits[i] = answerMappings.habits[answerChar];
                }
            }
        }
        
        // Parse Holland answers
        const hollandAnswersStr = line.substring((profile.hollandStart || 1) - 1, profile.hollandEnd || 0);
        for (let i = 0; i < hollandAnswersStr.length && i < inventories.holland.questions.length; i++) {
            if (hollandAnswersStr[i] && hollandAnswersStr[i].trim() !== '') {
                studentData.answers.holland[i] = answerMappings.holland[hollandAnswersStr[i]];
            }
        }
        
        studentDataList.push(studentData);
    });
    
    return studentDataList;
}