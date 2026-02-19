import { Page, expect, Locator, test } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ClinicalImagingSubmissionFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  get imageAccessionFilterAltIcon(): Locator {
    return this.page.locator('th:nth-child(21) > .d-flex.align-items-center.justify-content-start > .filter-icon > .mat-icon');
  }
  get filterTextbox(): Locator {
    return this.page.getByRole('textbox', { name: 'Filter...' });
  }

  get applyFilterButton(): Locator {
    return this.page.getByRole('button', { name: 'Apply' });
  }

  private get moreHorizIcon(): Locator {
    return this.page.getByText('more_horiz');
  }

  async applyFilterAndOpenDetails(accessionNumber: string): Promise<void> {
    await test.step(`Apply filter with Accession Number: ${accessionNumber} and open details`, async () => {
      // Click on the filter icon next to "Image Accession #"
      await this.imageAccessionFilterAltIcon.scrollIntoViewIfNeeded();
      await this.imageAccessionFilterAltIcon.waitFor({ state: 'visible', timeout: 5000 });
      await this.imageAccessionFilterAltIcon.click();

      // Enter the accession number in the filter textbox
      await this.filterTextbox.fill(accessionNumber);

      // Click the "Apply" button to apply the filter
      await this.applyFilterButton.click();

      // Wait for the results to load and display the filtered entry
      const filteredEntry = this.page.getByText(accessionNumber);
      await expect(filteredEntry).toBeVisible({ timeout: 5000 });

      await this.page.getByRole('button', { name: '1' }).isVisible();
    });
  }


}
