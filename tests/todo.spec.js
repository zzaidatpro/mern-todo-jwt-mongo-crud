import { test, expect } from '@playwright/test';

test.describe('--- Tests E2E : Authentification et Gestion des Todos ---', () => {

  // Générer un email unique pour éviter les conflits de doublons dans MongoDB
  const uniqueEmail = `user_${Date.now()}@test.com`;
  const password = 'Password123!';

  test('devrait inscrire un nouvel utilisateur, se connecter et accéder aux tâches', async ({ page }) => {
    
    // 1. Inscription (pour s'assurer que le compte existe en base)
    await page.goto('/register');
    await page.fill('input[type="email"], input[name="email"]', uniqueEmail);
    await page.fill('input[type="password"], input[name="password"]', password);
    
    await page.click('button[type="submit"]');

    // Attendre la redirection après inscription (soit vers /login, soit directement /todos)
    await page.waitForURL(/\/(login|todos)/);

    // 2. Connexion si redirigé vers /login
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"], input[name="email"]', uniqueEmail);
      await page.fill('input[type="password"], input[name="password"]', password);
      
      // Cliquer et attendre la réponse de l'API backend
      await Promise.all([
        page.waitForResponse(
          response => response.url().includes('/api/') && [200, 201].includes(response.status()),
          { timeout: 10000 } 
        ),
        page.click('button[type="submit"]')
      ]);
              }

    // 3. Vérifier l'accès final à la page /todos
    await expect(page).toHaveURL('http://localhost:5173/todos');
  });

});