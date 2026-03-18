import { Page, Locator } from '@playwright/test'

export class LoginPage {

  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Senha');
    this.loginButton = page.getByRole('button', { name: 'Acessar' });
  }

  async realizarLogin(email: string, senha: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(senha);
    await this.loginButton.click();
    await this.page.waitForTimeout(1000);
  }
}
