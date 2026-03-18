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
   readonly confitmButton: Locator;
   readonly successAlertPatient: Locator;
   readonly successAlertExam: Locator;
   readonly errorMessage: Locator;
   readonly errorAlert: Locator;
   readonly addExamButton: Locator;
   readonly editPatientButton: Locator;
   // readonly patientName: Locator;

   constructor (page :Page){
    this.page = page;
    this.nameInput = page.getByLabel('Nome');
    this.documentInput = page.getByLabel('Documento');
    this.newPatientButton = page.getByRole('button', { name: 'Novo Paciente' });
    this.saveButton = page.getByRole('button', { name: 'Salvar' });
    this.exitButton = page.getByRole('button', { name: 'x' });
    this.cancelButton = page.getByRole('button', { name: 'Cancelar' });
    this.modalInput = page.getByLabel('Modalidades');
    this.confitmButton = page.getByRole('button', { name: 'Confirmar' });
    this.successAlertPatient = page.getByText('Paciente registrado com sucesso');
    this.successAlertExam = page.getByText('Exame criado com sucesso');
    this.errorMessage = page.locator('text=Campo obrigatório');
    this.errorAlert = page.locator('text=Preencha todos os campos obrigatórios');
    this.addExamButton = page.locator('button:has(mat-icon:text("add_box"))');
    this.editPatientButton = page.locator('button:has(mat-icon:text("edit"))')
   //  this.patientName = page.getByRole('row', {name: '' });
   }

   async createPatient(name: string, document: string){
    await this.newPatientButton.click();
    await this.nameInput.fill(name);
    await this.documentInput.fill(document);
    await this.saveButton.click();

    await this.answerPatient(name, document)
   //  if(name === '' || document === ''){
   //    await expect(this.errorMessage.first()).toBeVisible();
   //    await expect(this.errorAlert).toBeVisible();
   //  }else{
   //    await expect(this.successAlertPatient).toBeVisible();
   //  }
   }

   async addExam(patientName: string, chosenExam: string){
      const row = this.page.getByRole('row', { name: patientName });
      const button =  row.getByRole('button').filter({ has:this.page.locator('mat-icon:text("add_box")') })
      await button.waitFor({ state: 'visible' });
      await button.click();
      await this.modalInput.click();
      await this.page.getByRole('option', { name: chosenExam }).click()
      await this.saveButton.click();
      await this.answerExam(chosenExam)
   }

   async editPatient(name: string, document: string){
      // const row = this.page.getByRole('row', { name: name })
      // const button = row.getByRole('button').filter({ has: this.page.locator('mat-icon:text("edit")') })
      // await button.waitFor({ state: 'visible' });
      // await button.click();
      // await this.nameInput.waitFor();
      await this.randomPatient()
      await this.nameInput.fill(name);
      await this.documentInput.fill(document);
      await this.saveButton.click();

   }

   async randomPatient(){
      const allRows = this.page.locator('tbody[role="rowgroup"] tr');
      await expect(allRows.first()).toBeVisible({ timeout: 5000 });
      const quantityPatients = await allRows.count();
      console.log(`total de pacientes: ${quantityPatients}`);

      if (quantityPatients === 0){
         throw new Error('Nenhum paciente foi encontrado')
      }

      const randomIndex = Math.floor(Math.random() * quantityPatients)
      console.log(`Indice sorteado ${randomIndex} vai clicar em indice nº ${randomIndex + 1}`);
      const drawnLine = allRows.nth(randomIndex);
      const nameDrawnPatient = await drawnLine.locator('.mat-column-name').textContent();
      console.log(`Paciente selecionado: ${nameDrawnPatient?.trim()}`);

      const addButton = drawnLine.locator('button').filter({ has: this.page.locator( 'mat-icon:text("edit")') });
      await addButton.click();      
   }







   async answerPatient(name: string, document:string){
     if(name === '' || document === ''){
       await expect(this.errorMessage.first()).toBeVisible();
       await expect(this.errorAlert).toBeVisible();
     }else{
       await expect(this.successAlertPatient).toBeVisible();
     }
   }

   async answerExam(modality: string){
     if(modality === '--'){
       await expect(this.errorMessage.first()).toBeVisible();
       await expect(this.errorAlert).toBeVisible();
     }else{
       await expect(this.successAlertExam).toBeVisible();
     }
   }
}