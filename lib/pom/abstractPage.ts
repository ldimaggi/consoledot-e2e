import { config } from '@lib/config';
import { closePopUp } from '@lib/utils/popup';
import { Locator, Page, expect } from '@playwright/test';

export abstract class AbstractPage {
  readonly page: Page;
  readonly nameForm: Locator;
  readonly detailsButton: Locator;
  readonly deleteNameInput: Locator;
  readonly actionsDeleteButton: Locator;
  readonly closeButton: Locator;
  readonly nextButton: Locator;
  readonly finishButton: Locator;
  readonly deleteButton: Locator;
  readonly appDataServicesLink: Locator;
  static readonly menuLocator: string = '[data-testid=router-link]';
  static readonly actionsLocatorString: string = '[aria-label="Actions"]';
  static readonly progressBarLocatorString: string = '[role=progressbar]';
  readonly confirmDeleteField: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameForm = page.getByLabel('Name *');
    this.detailsButton = page.locator('button', { hasText: 'Details' });
    this.deleteNameInput = page.locator('input[name="mas-name-input"]');
    this.actionsDeleteButton = page.locator('button', { hasText: 'Delete' });
    this.closeButton = page.locator('button', { hasText: 'Close' });
    this.appDataServicesLink = page.locator('a', { hasText: 'Application and Data Services' });
    this.nextButton = page.locator('button', { hasText: 'Next' });
    this.finishButton = page.locator('button', { hasText: 'Finish' });
    this.deleteButton = page.locator('button', { hasText: 'Delete' });
    this.confirmDeleteField = page.getByLabel('Type DELETE to confirm:');
    this.saveButton = page.getByRole('button').filter({ hasText: 'Save' });

    if (config.newUIcodebase) {
      this.deleteNameInput = page.locator('input[data-ouia-component-id="delete-confirmation"]');
    }
  }

  async showElementActions(selectorName: string) {
    const selectorLink = this.page.getByText(selectorName);
    const row = this.page.locator('tr', { has: selectorLink });

    await row.locator(AbstractPage.actionsLocatorString).click();
  }

  // Navigates to Application and Data Services overview page when category of tested product is not present in navigation
  async navigateToApplicationAndDataServices() {
    // If category of tested product is not present in navigation
    if (await this.appDataServicesLink.isVisible()) {
      // Open link to Application and Data Services overview page
      await this.appDataServicesLink.click();
    }
  }

  // Opens category of tested product in navigation when link to list of tested product instances is not present there
  async navigateToProduct(product: string, productList: string) {
    // Navigate to prerequisite page first
    await this.navigateToApplicationAndDataServices();
    // If link to list of tested product instances is not present in navigation
    if (!(await this.page.locator(AbstractPage.menuLocator, { hasText: productList }).isVisible())) {
      await this.page.locator('button', { hasText: product }).click();
    }
  }

  // Navigates to list of tested product instances
  async navigateToProductList(product: string, productList: string) {
    // Navigate to prerequisite page first
    await this.navigateToProduct(product, productList);
    // Close pop-up notifications if present
    await closePopUp(this.page);
    // Open link to list of tested product instances
    await this.page.locator(AbstractPage.menuLocator, { hasText: productList }).click();
    // Check that page with list of tested product instances is opened
    await expect(this.page.locator('h1', { hasText: productList })).toHaveCount(1);
  }
}
