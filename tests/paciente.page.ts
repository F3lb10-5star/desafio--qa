import { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'

export class Paciente {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly documentInput: Locator;
  readonly newPatientButton: Locator;
  readonly saveButton: Locator;
  readonly exitButton: Locator;
  readonly cancelButton: Locator;
  readonly modalInput: Locator;
  readonly confirmButton: Locator;
  readonly successAlertPatient: Locator;
  readonly successAlertExam: Locator;
  // readonly successDeletePatient: Locator;
  readonly errorMessage: Locator;
  readonly errorAlert: Locator;
  readonly addExamButton: Locator;
  readonly editPatientButton: Locator;
  // readonly patientName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nome');
    this.documentInput = page.getByLabel('Documento');
    this.newPatientButton = page.getByRole('button', { name: 'Novo Paciente' });
    this.saveButton = page.getByRole('button', { name: 'Salvar' });
    this.exitButton = page.getByRole('button', { name: 'x' });
    this.cancelButton = page.getByRole('button', { name: 'Cancelar' });
    this.modalInput = page.getByLabel('Modalidades');
    this.confirmButton = page.getByRole('button', { name: 'Confirmar' });
    this.successAlertPatient = page.getByText('Paciente registrado com sucesso');
    this.successAlertExam = page.getByText('Exame criado com sucesso');
    // this.successDeletePatient = page.getByText('/removido com sucesso/i'); //  getByText(/removido com sucesso/);
    this.errorMessage = page.locator('text=Campo obrigatório');
    this.errorAlert = page.locator('text=Preencha todos os campos obrigatórios');
    this.addExamButton = page.locator('button:has(mat-icon:text("add_box"))');
    this.editPatientButton = page.locator('button:has(mat-icon:text("edit"))')
    //  this.patientName = page.getByRole('row', {name: '' });
  }

  async createPatient(name: string, document: string) {
    await this.newPatientButton.click();
    await this.nameInput.fill(name);
    await this.documentInput.fill(document);
    await this.saveButton.click();
    await this.answerPatient(name, document)
  }

  async addExam(patientName: string, chosenExam: string) {
    const row = this.page.getByRole('row', { name: patientName });
    const button = row.getByRole('button').filter({ has: this.page.locator('mat-icon:text("add_box")') })
    await button.waitFor({ state: 'visible' });
    await button.click();
    await this.modalInput.click();
    await this.page.getByRole('option', { name: chosenExam }).click()
    await this.saveButton.click();
    await this.answerExam(chosenExam)
  }

  async searchRandomPatient() {
    const allRows = this.page.locator('table#table tbody tr');
    await expect(allRows.first()).toBeVisible({ timeout: 10000 });

    const quantityPatients = await allRows.count();
    const randomIndex = Math.floor(Math.random() * quantityPatients);

    const nameDrawnPatient = await allRows.nth(randomIndex).locator('.mat-column-name').textContent();
    const cleanName = nameDrawnPatient?.trim() ?? '';

    const searchInput = this.page.getByPlaceholder('Buscar por nome, email ou telefone...');
    await searchInput.fill(cleanName);
    await searchInput.press('Enter');
    await expect(allRows.first()).toContainText(cleanName, { timeout: 10000 });
    console.log(`Sucesso! Buscou por ${cleanName} e a tabela atualizou.`);
  }

  async editPatient(name: string, document: string) {
    await this.randomPatient('edit')
    await this.nameInput.fill(name);
    await this.documentInput.fill(document);
    await this.saveButton.click();

  }

  async deletePatient() {
    const nameDeleted = await this.randomPatient('delete');
    await this.confirmButton.click();
    // const messageExpect = new RegExp(`Paciente ${nameDeleted} removido com sucesso`, 'i');
    // await expect(this.page.getByText(messageExpect)).toBeVisible();
  }

  async randomPatient(functionality: string) {
    const allRows = this.page.locator('tbody[role="rowgroup"] tr');
    await expect(allRows.first()).toBeVisible({ timeout: 5000 });
    const quantityPatients = await allRows.count();
    console.log(`total de pacientes: ${quantityPatients}`);

    if (quantityPatients === 0) {
      throw new Error('Nenhum paciente foi encontrado')
    }

    const randomIndex = Math.floor(Math.random() * quantityPatients)
    console.log(`Indice sorteado ${randomIndex} vai clicar em indice nº ${randomIndex + 1}`);
    const drawnLine = allRows.nth(randomIndex);
    const nameDrawnPatient = await drawnLine.locator('.mat-column-name').textContent();
    console.log(`Paciente selecionado: ${nameDrawnPatient?.trim()}`);

    const addButton = drawnLine.locator('button').filter({ has: this.page.locator(`mat-icon:text('${functionality}')`) });
    await addButton.click();
    return nameDrawnPatient;
  }

  async answerPatient(name: string, document: string) {
    if (name === '' || document === '') {
      await expect(this.errorMessage.first()).toBeVisible();
      await expect(this.errorAlert).toBeVisible();
    } else {
      await expect(this.successAlertPatient).toBeVisible();
    }
  }

  async answerExam(modality: string) {
    if (modality === '--') {
      await expect(this.errorMessage.first()).toBeVisible();
      await expect(this.errorAlert).toBeVisible();
    } else {
      await expect(this.successAlertExam).toBeVisible();
    }
  }
}