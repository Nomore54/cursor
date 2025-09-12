/**
 * PDF Exporter Module
 * Handles PDF generation and export functionality
 */

export class PDFExporter {
    constructor() {
        this.jsPDF = window.jspdf?.jsPDF;
        this.html2canvas = window.html2canvas;
        
        if (!this.jsPDF || !this.html2canvas) {
            console.error('PDF libraries not loaded');
        }
    }

    /**
     * Export individual report to PDF
     * @param {Object} studentData - Student data
     * @returns {Promise} Export promise
     */
    async exportIndividualReport(studentData) {
        if (!this.jsPDF || !this.html2canvas) {
            alert('PDF kütüphaneleri yüklenemedi.');
            return;
        }

        const studentName = studentData.name;
        const safeFileName = this.sanitizeFileName(studentName);
        
        // Update button state
        const pdfButton = document.getElementById('pdf-button');
        const originalContent = pdfButton.innerHTML;
        pdfButton.innerHTML = 'Oluşturuluyor...';
        pdfButton.disabled = true;
        
        try {
            const pdf = new this.jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });
            
            const margin = 15;
            
            // Get report elements
            const header = document.getElementById('report-header');
            const varkHabits = document.getElementById('vark-habits-wrapper');
            const holland = document.getElementById('holland-section');
            const gemini = document.getElementById('gemini-section');
            const geminiContainer = document.getElementById('gemini-feedback-container');
            
            const hasGeminiContent = geminiContainer && 
                geminiContainer.innerHTML && 
                !geminiContainer.innerHTML.includes('butona tıklayın');
            
            // Create temporary container
            const tempContainer = this.createTempContainer();
            
            // Page 1: Header + VARK/Habits
            tempContainer.appendChild(header.cloneNode(true));
            tempContainer.appendChild(varkHabits.cloneNode(true));
            await this.addElementToPdf(pdf, tempContainer, margin, true);
            
            // Page 2: Header + Holland
            tempContainer.innerHTML = '';
            tempContainer.appendChild(header.cloneNode(true));
            tempContainer.appendChild(holland.cloneNode(true));
            await this.addElementToPdf(pdf, tempContainer, margin, false);
            
            // Page 3: Header + Gemini (if available)
            if (hasGeminiContent) {
                tempContainer.innerHTML = '';
                tempContainer.appendChild(header.cloneNode(true));
                tempContainer.appendChild(gemini.cloneNode(true));
                await this.addElementToPdf(pdf, tempContainer, margin, false);
            }
            
            // Clean up
            document.body.removeChild(tempContainer);
            
            // Save PDF
            pdf.save(`rapor-${safeFileName}.pdf`);
            
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('PDF oluşturulurken bir hata oluştu.');
        } finally {
            // Restore button state
            pdfButton.innerHTML = originalContent;
            pdfButton.disabled = false;
        }
    }

    /**
     * Create temporary container for PDF generation
     * @returns {HTMLElement} Temporary container element
     */
    createTempContainer() {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.width = document.getElementById('individual-report-container').offsetWidth + 'px';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Add element to PDF
     * @param {Object} pdf - jsPDF instance
     * @param {HTMLElement} element - Element to add
     * @param {number} margin - Page margin
     * @param {boolean} isFirstPage - Whether this is the first page
     */
    async addElementToPdf(pdf, element, margin, isFirstPage) {
        if (!element) return;
        
        if (!isFirstPage) {
            pdf.addPage();
        }
        
        const canvas = await this.html2canvas(element, {
            scale: 2,
            useCORS: true,
            width: element.scrollWidth,
            height: element.scrollHeight
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pageWidth - (margin * 2);
        const contentHeightPerPage = pageHeight - (margin * 2);
        
        const imgProps = pdf.getImageProperties(imgData);
        const totalImageHeight = (imgProps.height * contentWidth) / imgProps.width;
        
        let renderedHeight = 0;
        while (renderedHeight < totalImageHeight) {
            if (renderedHeight > 0) {
                pdf.addPage();
            }
            
            const yPosition = margin - renderedHeight;
            pdf.addImage(imgData, 'PNG', margin, yPosition, contentWidth, totalImageHeight);
            renderedHeight += contentHeightPerPage;
        }
    }

    /**
     * Sanitize filename
     * @param {string} name - Original name
     * @returns {string} Sanitized filename
     */
    sanitizeFileName(name) {
        return name
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase();
    }

    /**
     * Export class report to PDF
     * @param {Array} studentData - All student data
     */
    async exportClassReport(studentData) {
        // Implementation for class report PDF export
        // Similar to individual report but with class report elements
        alert('Sınıf raporu PDF dışa aktarma özelliği yakında eklenecek.');
    }
}