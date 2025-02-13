import { expect, Locator, Page } from '@playwright/test';
import { KafkaInstanceListPage } from '@lib/pom/streams/kafkaInstanceList';
import { AbstractPage } from '@lib/pom/abstractPage';
import { config } from '@lib/config';

export class KafkaInstancePage extends KafkaInstanceListPage {
  readonly instanceName: string;
  readonly connectionButton: Locator;
  readonly detailsButton: Locator;
  readonly actionsDeleteButton: Locator;
  readonly instanceLink: Locator;
  readonly kafkaInstanceHeading: Locator;
  readonly kafkaTabNavDashboard: Locator;
  readonly kafkaTabNavTopics: Locator;
  readonly kafkaTabNavConsumerGroups: Locator;
  readonly kafkaTabNavAccess: Locator;
  readonly kafkaTabNavSettings: Locator;

  constructor(page: Page, instanceName: string) {
    super(page);
    this.instanceName = instanceName;
    this.connectionButton = page.locator('a', { hasText: 'Connection' });
    this.detailsButton = page.locator('a', { hasText: 'Details' });
    this.actionsDeleteButton = page.locator('a', { hasText: 'Delete' });
    this.instanceLink = page.locator('a', { hasText: this.instanceName });
    this.kafkaInstanceHeading = page.locator('h1', { hasText: this.instanceName });

    // Tab navigation menu
    this.kafkaTabNavDashboard = page.locator('button[aria-label="Dashboard"]');
    this.kafkaTabNavTopics = page.locator('button[aria-label="Topics"]');
    this.kafkaTabNavConsumerGroups = page.locator('button[aria-label="Consumer groups"]');
    this.kafkaTabNavAccess = page.locator('button[aria-label="Access"]');
    this.kafkaTabNavSettings = page.locator('button[aria-label="Settings"]');

    if (config.newUIcodebase) {
      // Alternatively getByRole('link', { name: 'Consumer groups' });
      this.kafkaTabNavDashboard = page.locator('li[data-ouia-component-id="tab-Dashboard"]');
      this.kafkaTabNavTopics = page.locator('li[data-ouia-component-id="tab-Topics"]');
      this.kafkaTabNavConsumerGroups = page.locator('li[data-ouia-component-id="tab-Consumers"]');
      this.kafkaTabNavAccess = page.locator('li[data-ouia-component-id="tab-Permissions"]');
      this.kafkaTabNavSettings = page.locator('li[data-ouia-component-id="tab-Settings"]');
    }
  }

  async gotoThroughMenu() {
    await expect(this.page.getByText(this.instanceName)).toHaveCount(1);
    await this.instanceLink.click();
  }

  async showInstanceActions() {
    await this.page.locator(AbstractPage.actionsLocatorString).click();
  }

  async showConnection() {
    await this.showInstanceActions();
    await this.connectionButton.click();
  }

  async showDetails() {
    await this.showInstanceActions();
    await this.detailsButton.click();
  }

  async deleteInstance(name: string) {
    await this.showInstanceActions();
    await this.actionsDeleteButton.click();

    // Duplicity from parent class, how to solve that because previous part is different
    try {
      await expect(this.deleteNameInput).toHaveCount(1, { timeout: 5000 });

      // FIXME: workaround for https://github.com/redhat-developer/app-services-ui-components/issues/590
      // https://github.com/microsoft/playwright/issues/15734#issuecomment-1188245775
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.deleteNameInput.click();

      await this.deleteNameInput.fill(name);
    } catch (err) {
      // Removal without confirmation
      // ignore
    }
    // data-testid=modalDeleteKafka-buttonDelete
    await this.actionsDeleteButton.click();
  }

  async closeModalWithInfo() {
    await this.closeDrawerButton.click();
  }
}
