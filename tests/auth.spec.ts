import { test, expect } from '@playwright/test';
import { LoginPage } from './login.page';
import { Paciente } from './paciente.page';
import { faker } from '@faker-js/faker'
import { generate } from 'gerador-validador-cpf'



test.describe('Patient management', () => {
  const cpf = generate();
  const randomName = faker.person.fullName();
  const randomDocument = cpf;
  let paciente: Paciente;


  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    paciente = new Paciente(page)
    await page.goto('localhost:4200');
    await loginPage.realizarLogin('adm@gmail.com', 'muka123');
  })

  test('to create a new paciente - happy path', async ({ page }) => {    
    await paciente.createPatient(randomName ,randomDocument)      
  })

  test('to create a new paciente - sad path - without name', async ({ page }) => {
    await paciente.createPatient('',randomDocument)

  })

  test('to create a new paciente - sad path - without document', async ({ page }) => { 
    await paciente.createPatient(randomName, '')
  })

  test('to create a new paciente - sad path - without name and document', async ({ page }) => {   
    await paciente.createPatient('', '')
  })

  test('to add a new exam - happy path', async ({ page }) => {   
    await paciente.addExam('Velma Quigley', 'CR');
    // await test.skip();
  })

  test('to add a new exam - sad path', async ({ page }) => {    
    await paciente.addExam('Velma Quigley', '--');   
  })

  test('to edit a patient - happy path', async ({ page }) => {
    await paciente.editPatient(randomName, randomDocument)   
  })

  test('to edit a patient - sad path without name', async ({ page }) => {
    await paciente.editPatient('', randomDocument)
  })

  test('to edit a patient - happy path without document', async ({ page }) => {
    await paciente.editPatient(randomName, '');
  })

  test('to edit a patient - happy path without name and document', async ({ page }) => {
    await paciente.editPatient('', '')
  })

  test('to delete a patient - happy path', async ({ page }) => {
    await paciente.deletePatient()
  })

  test('to search a patient - happy path', async ({ page }) => {
    await paciente.searchRandomPatient();
  })
})
