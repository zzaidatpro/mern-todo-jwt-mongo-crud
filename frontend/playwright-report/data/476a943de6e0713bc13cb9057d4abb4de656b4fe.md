# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todo.spec.js >> --- Suite de Tests E2E : Gestion des Tâches (Todos) --- >> 1. Devrait ajouter une nouvelle tâche à la liste
- Location: e2e\todo.spec.js:43:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#nouvelleTache0')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "MERN Todo" [ref=e7] [cursor=pointer]:
        - /url: /
      - generic [ref=e8]:
        - generic [ref=e9]:
          - link "Mes Tâches" [ref=e10] [cursor=pointer]:
            - /url: /
          - link "À propos" [ref=e11] [cursor=pointer]:
            - /url: /about
        - generic [ref=e12]: user_1790012151064_875@test.com
        - button "Changer de thème" [ref=e16] [cursor=pointer]: 🌙
        - button "Déconnexion" [ref=e17] [cursor=pointer]
  - main [ref=e20]:
    - generic [ref=e23]:
      - heading "Gestion des Tâches" [level=2] [ref=e24]
      - generic [ref=e25]:
        - textbox "Nouvelle tâche..." [ref=e26]
        - combobox [ref=e27]:
          - option "Personnel" [selected]
          - option "Travail"
          - option "Urgent"
          - option "Divers"
        - button "Ajouter" [ref=e28] [cursor=pointer]
      - generic [ref=e29]:
        - textbox "🔍 Rechercher une tâche..." [ref=e30]
        - generic [ref=e31]:
          - combobox [ref=e32]:
            - option "Toutes les catégories" [selected]
            - option "Personnel"
            - option "Travail"
            - option "Urgent"
            - option "Divers"
          - combobox [ref=e33]:
            - option "Tous les statuts" [selected]
            - option "En cours"
            - option "Terminées"
      - list
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('--- Suite de Tests E2E : Gestion des Tâches (Todos) ---', () => {
  4   | 
  5   |   // Utilitaire pour inscrire et connecter un utilisateur avant chaque test
  6   |   test.beforeEach(async ({ page }) => {
  7   |     const uniqueEmail = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
  8   |     const password = 'Password123!';
  9   | 
  10  |     // 1. Inscription
  11  |     await page.goto('/register');
  12  |     await page.fill('input[type="email"], input[name="email"]', uniqueEmail);
  13  |     await page.fill('input[type="password"], input[name="password"]', password);
  14  | 
  15  |     const nameInput = page.locator('input[name="name"], input[name="username"]');
  16  |     if (await nameInput.count() > 0) {
  17  |       await nameInput.fill('Utilisateur Test');
  18  |     }
  19  | 
  20  |     await Promise.all([
  21  |       page.waitForResponse(res => res.url().includes('/api/') && [200, 201].includes(res.status())),
  22  |       page.click('button[type="submit"]')
  23  |     ]);
  24  | 
  25  |     // 2. Connexion
  26  |     await page.waitForURL('**/login');
  27  |     await page.fill('input[type="email"], input[name="email"]', uniqueEmail);
  28  |     await page.fill('input[type="password"], input[name="password"]', password);
  29  | 
  30  |     const submitBtn = page.locator('#bouton_principal, button[type="submit"]');
  31  |     await Promise.all([
  32  |       page.waitForResponse(res => res.url().includes('/api/') && [200, 201].includes(res.status())),
  33  |       submitBtn.click()
  34  |     ]);
  35  | 
  36  |     // 3. Arrivée sur la page /todos
  37  |     await page.waitForURL('**/todos');
  38  |   });
  39  | 
  40  |   // =========================================================
  41  |   // TEST 1 : Créer une nouvelle tâche
  42  |   // =========================================================
  43  |   test('1. Devrait ajouter une nouvelle tâche à la liste', async ({ page }) => {
  44  |     const todoTitle = 'Acheter du pain';
  45  | 
  46  |     // Remplir le champ de texte via son ID exact
  47  |     const todoInput = page.locator('#nouvelleTache0');
> 48  |     await todoInput.fill(todoTitle);
      |                     ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  49  | 
  50  |     // Soumettre le formulaire via le bouton ou avec page.locator('#bouttonAdd') si vous avez mis un ID
  51  |     const addButton = page.locator('#bouttonAdd').or(page.getByRole('button', { name: /ajouter/i }));
  52  |     
  53  |     await Promise.all([
  54  |       page.waitForResponse(res => res.url().includes('/api/') && [200, 201].includes(res.status())),
  55  |       addButton.click()
  56  |     ]);
  57  | 
  58  |     // Vérifier que la tâche est bien affichée dans la liste
  59  |     await expect(page.getByText(todoTitle)).toBeVisible();
  60  |   });
  61  | 
  62  |   // =========================================================
  63  |   // TEST 2 : Marquer une tâche comme terminée
  64  |   // =========================================================
  65  |   test('2. Devrait pouvoir cocher/terminer une tâche', async ({ page }) => {
  66  |     const todoTitle = 'Réviser les tests Playwright';
  67  | 
  68  |     // Création initiale de la tâche
  69  |     await page.locator('#nouvelleTache0').fill(todoTitle);
  70  |     const addButton = page.getByRole('button', { name: /ajouter/i });
  71  |     
  72  |     await Promise.all([
  73  |       page.waitForResponse(res => res.url().includes('/api/')),
  74  |       addButton.click()
  75  |     ]);
  76  | 
  77  |     // Basculer l'état de la tâche au clic sur son texte
  78  |     const todoTextElement = page.getByText(todoTitle);
  79  | 
  80  |     await Promise.all([
  81  |       page.waitForResponse(res => res.url().includes('/api/')),
  82  |       todoTextElement.click()
  83  |     ]);
  84  | 
  85  |     // Vérifier l'application du style ou du bouton coché
  86  |     await expect(todoTextElement).toHaveClass(/line-through/);
  87  |   });
  88  | 
  89  |   // =========================================================
  90  |   // TEST 3 : Supprimer une tâche
  91  |   // =========================================================
  92  |   test('3. Devrait supprimer une tâche de la liste', async ({ page }) => {
  93  |     const todoTitle = 'Tâche temporaire à supprimer';
  94  | 
  95  |     // Création de la tâche
  96  |     await page.locator('#nouvelleTache0').fill(todoTitle);
  97  |     const addButton = page.getByRole('button', { name: /ajouter/i });
  98  |     
  99  |     await Promise.all([
  100 |       page.waitForResponse(res => res.url().includes('/api/')),
  101 |       addButton.click()
  102 |     ]);
  103 | 
  104 |     // Localiser l'élément de liste contenant le titre
  105 |     const todoItem = page.locator('li').filter({ hasText: todoTitle });
  106 |     const deleteButton = todoItem.getByRole('button', { name: /supprimer/i }).or(todoItem.locator('#boutonSup'));
  107 | 
  108 |     await Promise.all([
  109 |       page.waitForResponse(res => res.url().includes('/api/')),
  110 |       deleteButton.click()
  111 |     ]);
  112 | 
  113 |     // Vérifier la disparition de l'élément
  114 |     await expect(page.getByText(todoTitle)).not.toBeVisible();
  115 |   });
  116 | 
  117 |   // =========================================================
  118 |   // TEST 4 : Empêcher la création d'une tâche vide
  119 |   // =========================================================
  120 |   test('4. Ne devrait pas ajouter une tâche avec un titre vide', async ({ page }) => {
  121 |     const addButton = page.getByRole('button', { name: /ajouter/i });
  122 | 
  123 |     // Tenter d'ajouter à vide
  124 |     await addButton.click();
  125 | 
  126 |     // Vérifier qu'aucun élément n'est présent
  127 |     const todoItems = page.locator('ul li');
  128 |     await expect(todoItems).toHaveCount(0);
  129 |   });
  130 | 
  131 |   // =========================================================
  132 |   // TEST 5 : Filtrer une tâche avec la barre de recherche
  133 |   // =========================================================
  134 |   test('5. Devrait filtrer la liste en utilisant la barre de recherche', async ({ page }) => {
  135 |     // Ajouter deux tâches
  136 |     await page.locator('#nouvelleTache0').fill('Acheter du pain');
  137 |     await page.getByRole('button', { name: /ajouter/i }).click();
  138 | 
  139 |     await page.locator('#nouvelleTache0').fill('Nettoyer le bureau');
  140 |     await page.getByRole('button', { name: /ajouter/i }).click();
  141 | 
  142 |     // Filtrer
  143 |     await page.locator('#rechercherUneTache').fill('pain');
  144 | 
  145 |     // Assertions
  146 |     await expect(page.getByText('Acheter du pain')).toBeVisible();
  147 |     await expect(page.getByText('Nettoyer le bureau')).not.toBeVisible();
  148 |   });
```