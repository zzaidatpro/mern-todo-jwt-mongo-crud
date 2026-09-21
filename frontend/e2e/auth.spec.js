import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Indiquez l'URL complète avec le protocole http://
  await page.goto('http://localhost:5173/login');
});

test.describe('Tests de la page de Connexion (/Login)', () => {

  test.beforeEach(async ({ page }) => {
    // Navigue vers la page d'accueil (Login) avant chaque test
    await page.goto('/login');
  });

  test('charge la page de connexion et le titre', async ({ page }) => {
    // Vérifie que le titre de la page contient React, Todo ou Login
    await expect(page).toHaveTitle(/React|Todo|Login/i);
    
    // Vérifie qu'un titre de formulaire (ex: Connexion ou Login) est visible
    const heading = page.getByRole('heading', { name: /connexion|login/i });
    await expect(heading).toBeVisible();
  });

  test('affiche les champs email, mot de passe et le bouton de connexion', async ({ page }) => {
  // Vérification du champ Email
  const emailInput = page.getByLabel('Email :');
  await expect(emailInput).toBeVisible();

  // Vérification du champ Mot de passe
  const passwordInput = page.getByLabel('Mot de passe :');
  await expect(passwordInput).toBeVisible();

  // Sélection du bouton via son id unique
  const submitButton = page.locator('#bouton_principal');
  await expect(submitButton).toBeVisible();
});

  test('permet de saisir les identifiants dans le formulaire', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');

    // Saisie des valeurs d'exemples
    await emailInput.fill('user@example.com');
    await passwordInput.fill('password123');

    // Vérification des valeurs saisies
    await expect(emailInput).toHaveValue('user@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

});