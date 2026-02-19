import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ClinicalImagingSubmissionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  get imagingLogForm() {
    return this.page.locator('app-imaging-log-form');
  }
  get addClinicalImagingButton() {
    return this.page.getByRole('button', { name: '+ Add Clinical Imaging' });
  }
  get visitTypeDropdown() {
    return this.page.getByRole('button', { name: '-Select-' }).first();
  }
  get visitTypeOption() {
    return this.page.getByRole('button', { name: 'Follow up - 6 months' });
  }
  get monthInput() {
    return this.page.getByRole('textbox', { name: 'MM' });
  }
  get dayInput() {
    return this.page.getByRole('textbox', { name: 'DD' });
  }
  get yearInput() {
    return this.page.getByRole('textbox', { name: 'YYYY' });
  }
  get scanTypeDropdown() {
    return this.page.getByRole('button', { name: '-Select-' }).nth(0);
  }
  get scanTypeOption() {
    return this.page.getByRole('button', { name: 'Tau PET' });
  }
  get tracerDropdown() {
    return this.page.getByText('expand_more').nth(4);
  }
  get tracerOption() {
    return this.page.getByRole('button', { name: 'PET only' });
  }
  get imagingFacilitySearch() {
    return this.page.getByRole('textbox', { name: 'Search Facility ID/Name...' });
  }
  get imagingFacilityOption() {
    return this.page.getByText('star_border Test Imaging Facility 2 (8091)');
  }
  get subjectIdInput() {
    return this.page.locator('input[type="undefined"]');
  }
  get radiologyReportUpload() {
    return this.page.getByRole('button', { name: 'Drop files or browse to upload' });
  }
  get submitButton() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  async fillImagingLogAndSubmit(imagingData: any, imageAccessionNumber: string): Promise<void> {
    await test.step('Fill Imaging Log Form and Submit', async () => {
      // Click the + Add Clinical Imaging Submission Log button to open the form
      await this.addClinicalImagingButton.click();
      await this.page.waitForTimeout(1000); // Wait for form to render

      // Visit Type
      await this.visitTypeDropdown.scrollIntoViewIfNeeded();
      await this.visitTypeDropdown.click();
      await this.page.waitForTimeout(500);
      const visitTypeButton = this.page.getByRole('button', { name: imagingData.visitType });
      await visitTypeButton.waitFor({ state: 'visible', timeout: 5000 });
      await visitTypeButton.click();
      await this.page.waitForTimeout(500);

      // Scan Date
      await this.monthInput.click();
      await this.monthInput.type(imagingData.scanMonth);
      await this.monthInput.press('Tab');
      await this.dayInput.type(imagingData.scanDay);
      await this.dayInput.press('Tab');
      await this.yearInput.click();
      await this.yearInput.type(imagingData.scanYear);
      await this.page.waitForTimeout(500);

      //Imaging Modality Type
      await this.scanTypeDropdown.scrollIntoViewIfNeeded();
      await this.scanTypeDropdown.click();
      await this.page.waitForTimeout(500);
      const scanTypeButton = this.page.getByRole('button', { name: imagingData.scanType });
      await scanTypeButton.waitFor({ state: 'visible', timeout: 5000 });
      await scanTypeButton.click();
      await this.page.waitForTimeout(500);

      // Tracer
      await this.tracerDropdown.scrollIntoViewIfNeeded();
      await this.tracerDropdown.click();
      await this.page.waitForTimeout(500);
      const tracerButton = this.page.getByRole('button', { name: imagingData.tracer });
      await tracerButton.waitFor({ state: 'visible', timeout: 5000 });
      await tracerButton.click();
      await this.page.waitForTimeout(500);

      // Imaging Facility
      await this.imagingFacilitySearch.scrollIntoViewIfNeeded();
      await this.imagingFacilitySearch.click();
      await this.page.waitForTimeout(500);
      const facilityButton = this.page.getByRole('button', { name: imagingData.imagingFacility });
      await facilityButton.waitFor({ state: 'visible', timeout: 5000 });
      await facilityButton.click();
      await this.page.waitForTimeout(500);

      // Subject ID
      await this.subjectIdInput.click();
      await this.subjectIdInput.type(imageAccessionNumber);
      await this.page.waitForTimeout(500);
      // Radiology Report Upload
      await this.uploadFile();

      // Submit
      await this.submitButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.getByText('Your imaging log entry is').waitFor({ state: 'visible', timeout: 30000 });

    });
  }
  get caseForm() {
    return this.page.locator('form');
  }

  async verifyImagingLogAndOpenAddClinicalImaging(caseId: string): Promise<void> {
    await test.step(`Verify Imaging Log and open Add Clinical Imaging for Case #${caseId}`, async () => {
      // Verify Imaging Log page contains Case ID
      await expect(this.imagingLogForm).toContainText(`Case ID #${caseId}`);

      // Click + Add Clinical Imaging
      await this.addClinicalImagingButton.click();
      // Verify Case ID inside the form
      await expect(this.caseForm).toContainText(`Case # : ${caseId}`);
    });
  }
  async uploadFile() {
    await test.step('Upload Human Protection Certification', async () => {
      const uploadButton = this.page.getByRole('button', { name: 'Drop files or browse to upload' });
      await uploadButton.setInputFiles('test-data/documentstoUpload/Blank PDF.pdf');
    });
  }
}
