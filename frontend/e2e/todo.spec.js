import { test, expect } from '@playwright/test';

test.describe('--- Suite de Tests E2E : Gestion des Tâches (Todos) ---', () => {

  // Utilitaire pour inscrire et connecter un utilisateur avant chaque test
  test.beforeEach(async ({ page }) => {
    const uniqueEmail = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
    const password = 'Password123!';

    // 1. Inscription
    await page.goto('/register');
    await page.fill('input[type="email"], input[name="email"]', uniqueEmail);
    await page.fill('input[type="password"], input[name="password"]', password);

    const nameInput = page.locator('input[name="name"], input[name="username"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('Utilisateur Test');
    }

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/') && [200, 201].includes(res.status())),
      page.click('button[type="submit"]')
    ]);

    // 2. Connexion
    await page.waitForURL('**/login');
    await page.fill('input[type="email"], input[name="email"]', uniqueEmail);
    await page.fill('input[type="password"], input[name="password"]', password);

    const submitBtn = page.locator('#bouton_principal, button[type="submit"]');
    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/') && [200, 201].includes(res.status())),
      submitBtn.click()
    ]);

    // 3. Arrivée sur la page /todos
    await page.waitForURL('**/todos');
  });

  // =========================================================
  // TEST 1 : Créer une nouvelle tâche
  // =========================================================
  test('1. Devrait ajouter une nouvelle tâche à la liste', async ({ page }) => {
    const todoTitle = 'Acheter du pain';

    // Remplir le champ de texte via son ID exact
    const todoInput = page.locator('#nouvelleTache0');
    await todoInput.fill(todoTitle);

    // Soumettre le formulaire via le bouton ou avec page.locator('#bouttonAdd') si vous avez mis un ID
    const addButton = page.locator('#bouttonAdd').or(page.getByRole('button', { name: /ajouter/i }));
    
    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/') && [200, 201].includes(res.status())),
      addButton.click()
    ]);

    // Vérifier que la tâche est bien affichée dans la liste
    await expect(page.getByText(todoTitle)).toBeVisible();
  });

  // =========================================================
  // TEST 2 : Marquer une tâche comme terminée
  // =========================================================
  test('2. Devrait pouvoir cocher/terminer une tâche', async ({ page }) => {
    const todoTitle = 'Réviser les tests Playwright';

    // Création initiale de la tâche
    await page.locator('#nouvelleTache0').fill(todoTitle);
    const addButton = page.getByRole('button', { name: /ajouter/i });
    
    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/')),
      addButton.click()
    ]);

    // Basculer l'état de la tâche au clic sur son texte
    const todoTextElement = page.getByText(todoTitle);

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/')),
      todoTextElement.click()
    ]);

    // Vérifier l'application du style ou du bouton coché
    await expect(todoTextElement).toHaveClass(/line-through/);
  });

  // =========================================================
  // TEST 3 : Supprimer une tâche
  // =========================================================
  test('3. Devrait supprimer une tâche de la liste', async ({ page }) => {
    const todoTitle = 'Tâche temporaire à supprimer';

    // Création de la tâche
    await page.locator('#nouvelleTache0').fill(todoTitle);
    const addButton = page.getByRole('button', { name: /ajouter/i });
    
    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/')),
      addButton.click()
    ]);

    // Localiser l'élément de liste contenant le titre
    const todoItem = page.locator('li').filter({ hasText: todoTitle });
    const deleteButton = todoItem.getByRole('button', { name: /supprimer/i }).or(todoItem.locator('#boutonSup'));

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/')),
      deleteButton.click()
    ]);

    // Vérifier la disparition de l'élément
    await expect(page.getByText(todoTitle)).not.toBeVisible();
  });

  // =========================================================
  // TEST 4 : Empêcher la création d'une tâche vide
  // =========================================================
  test('4. Ne devrait pas ajouter une tâche avec un titre vide', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /ajouter/i });

    // Tenter d'ajouter à vide
    await addButton.click();

    // Vérifier qu'aucun élément n'est présent
    const todoItems = page.locator('ul li');
    await expect(todoItems).toHaveCount(0);
  });

  // =========================================================
  // TEST 5 : Filtrer une tâche avec la barre de recherche
  // =========================================================
  test('5. Devrait filtrer la liste en utilisant la barre de recherche', async ({ page }) => {
    // Ajouter deux tâches
    await page.locator('#nouvelleTache0').fill('Acheter du pain');
    await page.getByRole('button', { name: /ajouter/i }).click();

    await page.locator('#nouvelleTache0').fill('Nettoyer le bureau');
    await page.getByRole('button', { name: /ajouter/i }).click();

    // Filtrer
    await page.locator('#rechercherUneTache').fill('pain');

    // Assertions
    await expect(page.getByText('Acheter du pain')).toBeVisible();
    await expect(page.getByText('Nettoyer le bureau')).not.toBeVisible();
  });

});