/**
 * Storage Management Utilities
 * Handles localStorage operations for reports and profiles
 */

/**
 * Report Storage Manager
 */
export class ReportStorage {
    constructor() {
        this.storageKey = 'savedReports';
        this.reports = {};
        this.loadReports();
    }

    /**
     * Load reports from localStorage
     */
    loadReports() {
        const data = localStorage.getItem(this.storageKey);
        this.reports = data ? JSON.parse(data) : {};
    }

    /**
     * Save reports to localStorage
     */
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.reports));
    }

    /**
     * Save a report
     * @param {string} name - Report name
     * @param {Array} data - Student data array
     */
    saveReport(name, data) {
        this.reports[name] = data;
        this.saveToStorage();
    }

    /**
     * Get a report
     * @param {string} name - Report name
     * @returns {Array} Student data array
     */
    getReport(name) {
        return this.reports[name];
    }

    /**
     * Delete a report
     * @param {string} name - Report name
     * @returns {boolean} Success status
     */
    deleteReport(name) {
        if (this.reports[name]) {
            delete this.reports[name];
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Get all report names
     * @returns {Array} Array of report names
     */
    getReportNames() {
        return Object.keys(this.reports);
    }

    /**
     * Check if reports exist
     * @returns {boolean} True if reports exist
     */
    hasReports() {
        return this.getReportNames().length > 0;
    }
}

/**
 * Settings Storage Manager
 */
export class SettingsStorage {
    constructor() {
        this.storageKey = 'appSettings';
        this.settings = this.loadSettings();
    }

    /**
     * Load settings from localStorage
     * @returns {Object} Settings object
     */
    loadSettings() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : this.getDefaultSettings();
    }

    /**
     * Get default settings
     * @returns {Object} Default settings
     */
    getDefaultSettings() {
        return {
            theme: 'light',
            autoSave: true,
            language: 'tr',
            geminiApiKey: '',
            lastUsedProfile: 'default'
        };
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    }

    /**
     * Get a setting value
     * @param {string} key - Setting key
     * @returns {*} Setting value
     */
    getSetting(key) {
        return this.settings[key];
    }

    /**
     * Set a setting value
     * @param {string} key - Setting key
     * @param {*} value - Setting value
     */
    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    /**
     * Reset settings to default
     */
    resetSettings() {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
    }
}

/**
 * Export singleton instances
 */
export const reportStorage = new ReportStorage();
export const settingsStorage = new SettingsStorage();