/**
 * Optical Form Profiles Configuration
 * Manages different optical form reading profiles
 */

export const defaultProfile = {
    name: 'Varsayılan Sekonic Profili',
    nameStart: 16,
    nameEnd: 35,
    classStart: null,
    classEnd: null,
    varkStart: 189,
    varkEnd: 196,
    habitsStart: 197,
    habitsEnd: 216,
    hollandStart: 62,
    hollandEnd: 151
};

export const exampleProfile = {
    name: 'Örnek Özel Profil',
    nameStart: 16,
    nameEnd: 35,
    classStart: 0,
    classEnd: 0,
    varkStart: 189,
    varkEnd: 196,
    habitsStart: 197,
    habitsEnd: 216,
    hollandStart: 62,
    hollandEnd: 151
};

/**
 * Profile Manager Class
 * Handles loading, saving, and managing optical form profiles
 */
export class ProfileManager {
    constructor() {
        this.profiles = {};
        this.loadProfiles();
    }

    /**
     * Load profiles from localStorage
     */
    loadProfiles() {
        const savedProfiles = localStorage.getItem('opticalProfiles');
        
        if (savedProfiles && Object.keys(JSON.parse(savedProfiles)).length > 0) {
            this.profiles = JSON.parse(savedProfiles);
        } else {
            // Initialize with example profile if no profiles exist
            this.profiles[exampleProfile.name] = { ...exampleProfile };
            delete this.profiles[exampleProfile.name].name;
            this.saveProfiles();
        }
    }

    /**
     * Save profiles to localStorage
     */
    saveProfiles() {
        localStorage.setItem('opticalProfiles', JSON.stringify(this.profiles));
    }

    /**
     * Get all profile names
     * @returns {Array} Array of profile names
     */
    getProfileNames() {
        return Object.keys(this.profiles);
    }

    /**
     * Get a specific profile
     * @param {string} name - Profile name
     * @returns {Object} Profile data
     */
    getProfile(name) {
        return this.profiles[name];
    }

    /**
     * Add or update a profile
     * @param {string} name - Profile name
     * @param {Object} profileData - Profile configuration data
     */
    saveProfile(name, profileData) {
        this.profiles[name] = profileData;
        this.saveProfiles();
    }

    /**
     * Delete a profile
     * @param {string} name - Profile name
     * @returns {boolean} Success status
     */
    deleteProfile(name) {
        if (this.profiles[name]) {
            delete this.profiles[name];
            this.saveProfiles();
            return true;
        }
        return false;
    }

    /**
     * Rename a profile
     * @param {string} oldName - Current profile name
     * @param {string} newName - New profile name
     */
    renameProfile(oldName, newName) {
        if (this.profiles[oldName] && oldName !== newName) {
            this.profiles[newName] = this.profiles[oldName];
            delete this.profiles[oldName];
            this.saveProfiles();
        }
    }
}