import { expect, Locator, Page } from '@playwright/test';
import blockAnalyticsDomains from '@lib/utils/blocker';
import { config } from '@lib/config';
import { AbstractPage } from '@lib/pom/abstractPage';

export class ConsoleDotAuthPage extends AbstractPage {
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;
  readonly welcomePage: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('#username-verification');
    this.passwordField = page.locator('#password');
    this.submitButton = page.locator('#rh-password-verification-submit-button');
    this.welcomePage = page.getByText('Gain increased visibility into your hybrid cloud');
    this.userMenu = page.locator('#UserMenu');
    this.logoutButton = page.locator('button', { hasText: 'Log out' });
  }

  // Got to starting page
  async goto() {
    await this.page.goto(config.startingPage);
    // Expect a title "to contain" a substring.
    await expect(this.page).toHaveTitle(/Log In | Red Hat IDP/);
  }

  async login(username: string = config.adminUsername, password: string = config.adminPassword) {
    await blockAnalyticsDomains(this.page);

    // Go to starting Page
    await this.goto();

    // do login
    await this.usernameField.fill(username);
    await this.nextButton.click();
    await this.passwordField.fill(password);
    await this.submitButton.click();

    // check we landed on the right page
    await expect(this.page).toHaveTitle(/Home/, { timeout: 10000 });
    await expect(this.welcomePage).toBeTruthy();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
}
