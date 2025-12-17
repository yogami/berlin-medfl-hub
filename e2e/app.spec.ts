import { test, expect } from '@playwright/test';

test.describe('Berlin MedFL Hub E2E Tests', () => {
    test('Landing page loads with correct branding', async ({ page }) => {
        await page.goto('/');

        // Check for main headline
        await expect(page.locator('h1')).toContainText('Federated Learning');

        // Check for CTA button
        await expect(page.locator('a.btn-primary')).toBeVisible();

        // Check for trusted partners section using exact match
        await expect(page.getByText('CHARITÉ', { exact: true })).toBeVisible();
    });

    test('Dashboard page loads and shows training status', async ({ page }) => {
        await page.goto('/dashboard');

        // Check for dashboard header
        await expect(page.locator('text=MedFL')).toBeVisible();

        // Check for round information using specific span
        await expect(page.getByText('Round #42')).toBeVisible();

        // Check for at least one hospital card
        await expect(page.getByText('Charité Berlin')).toBeVisible();
    });

    test('API returns hospital list', async ({ request }) => {
        const response = await request.get('/api/hospitals');
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data.length).toBeGreaterThan(0);
        expect(data.data[0]).toHaveProperty('name');
        expect(data.data[0]).toHaveProperty('tier');
    });

    test('API returns round aggregation data', async ({ request }) => {
        const response = await request.get('/api/rounds/42');
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data.roundId).toBe(42);
        expect(data.data.globalAccuracy).toBeGreaterThan(0);
        expect(data.data.participatingNodes).toBeGreaterThan(0);
    });

    test('Navigation from landing to dashboard works', async ({ page }) => {
        await page.goto('/');

        // Click on login/dashboard button
        await page.click('a:has-text("Hospital Login")');

        // Verify we're on the dashboard
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });
});
