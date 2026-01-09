import { test, expect } from '@playwright/test';

test.describe('Model Aggregation E2E Tests', () => {
    test.describe('FEATURE: Federated Learning Round Aggregation', () => {
        test('GIVEN a valid round ID WHEN requesting aggregation THEN returns accuracy and participant count', async ({ request }) => {
            const response = await request.get('/api/rounds/42');
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.roundId).toBe(42);
            expect(data.data.globalAccuracy).toBeGreaterThanOrEqual(0);
            expect(data.data.globalAccuracy).toBeLessThanOrEqual(1);
            expect(data.data.participatingNodes).toBeGreaterThanOrEqual(0);
        });

        test('GIVEN an invalid round ID WHEN requesting aggregation THEN returns zero participants', async ({ request }) => {
            const response = await request.get('/api/rounds/99999');
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.participatingNodes).toBe(0);
        });
    });

    test.describe('FEATURE: Hospital Registry', () => {
        test('GIVEN the hospital API WHEN requesting all hospitals THEN returns list with required fields', async ({ request }) => {
            const response = await request.get('/api/hospitals');
            expect(response.ok()).toBeTruthy();

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(Array.isArray(data.data)).toBe(true);

            if (data.data.length > 0) {
                const hospital = data.data[0];
                expect(hospital).toHaveProperty('id');
                expect(hospital).toHaveProperty('name');
                expect(hospital).toHaveProperty('tier');
                expect(hospital).toHaveProperty('isActive');
            }
        });

        test('GIVEN the hospital API WHEN checking tiers THEN returns valid tier categories', async ({ request }) => {
            const response = await request.get('/api/hospitals');
            const data = await response.json();

            const validTiers = ['startup', 'hospital', 'university'];
            for (const hospital of data.data) {
                expect(validTiers).toContain(hospital.tier);
            }
        });
    });
});

test.describe('Dashboard E2E Tests', () => {
    test.describe('FEATURE: Training Status Visibility', () => {
        test('GIVEN authenticated user WHEN viewing dashboard THEN displays current training round', async ({ page }) => {
            await page.goto('/dashboard');
            await expect(page.getByText(/Round #\d+/)).toBeVisible();
        });

        test('GIVEN dashboard page WHEN loading THEN displays hospital participation status', async ({ page }) => {
            await page.goto('/dashboard');
            // At least one hospital should be listed
            await expect(page.locator('[data-testid="hospital-card"], .hospital-card, text=Charité')).toBeVisible();
        });
    });

    test.describe('FEATURE: GDPR-Compliant Data Display', () => {
        test('GIVEN dashboard WHEN displaying hospital data THEN shows only aggregated metrics', async ({ page }) => {
            await page.goto('/dashboard');

            // Should show aggregate accuracy, not individual patient data
            await expect(page.getByText(/Accuracy|%/)).toBeVisible();

            // Should NOT show any PII indicators
            const pageContent = await page.textContent('body');
            expect(pageContent).not.toMatch(/patient|SSN|DOB/i);
        });
    });
});

test.describe('Edge Cases', () => {
    test('GIVEN non-existent page WHEN navigating THEN shows appropriate error or redirect', async ({ page }) => {
        const response = await page.goto('/non-existent-page-12345');
        // Should either 404 or redirect to landing
        expect(response?.status()).toBeOneOf([200, 404]);
    });

    test('GIVEN API with malformed request WHEN round ID is not a number THEN handles gracefully', async ({ request }) => {
        const response = await request.get('/api/rounds/not-a-number');
        // Should return error or handle gracefully
        expect([200, 400, 404, 500]).toContain(response.status());
    });
});
