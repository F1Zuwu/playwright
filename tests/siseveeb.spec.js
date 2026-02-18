import { test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

test('tee enda tunniplaanist pilt', async ({ page }) => {
  await page.goto('https://siseveeb.voco.ee/veebivormid/tunniplaan/tunniplaan');

  //find a tag with "ita23" text and click it
  await page.getByRole('link', { name: 'ita23' }).click();

  // Take a screenshot of the timetable page.
  await page.screenshot({ path: 'tests/screenshots/tunniplaan.png' });
});

const opetajad_keda_otsida = [
    'Frolov, Max',
    'Valvas, Aly',
    'Vaabel, Maret'
]

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

test('Tee õpetajate tunniplaanist pilt', async ({ page }) => {
  mkdirSync('tests/screenshots', { recursive: true })

  for (const opetaja of opetajad_keda_otsida) {
    await page.goto('https://siseveeb.voco.ee/veebivormid/tunniplaan/tunniplaan');

    await page.getByRole('link', { name: 'Õpetajad' }).click();

    // Get input by selector and filter teachers list
    const filter = page.locator('#data_table_js_filter_teacher')
    await filter.fill('')
    await filter.fill(opetaja)

    await page.getByRole('link', { name: opetaja }).click();

    // Take a screenshot of the timetable page.
    await page.screenshot({ path: `tests/screenshots/opetaja_tunniplaan_${slugify(opetaja)}.png` });
  }

});

test('Mõõda lehe laadimisaega', async ({ page }) => {
  const url = 'https://siseveeb.voco.ee/veebivormid/tunniplaan/tunniplaan';

  const start = performance.now();
  await page.goto(url, { waitUntil: 'load' });
  const end = performance.now();

  const loadMs = Math.round(end - start);
  const metrics = await performance.now();

  console.log(`Load time (waitUntil: load): ${loadMs} ms`);
  console.log('page.metrics():', metrics);
});