import { expect, test } from '@playwright/test';

const API_URL = process.env.API_URL || 'https://kerrokantasi.api.dev.hel.ninja';

const fetchHearing = async () => {
  const res = await fetch(`${API_URL}/v1/hearing/`);
  const json = await res.json();
  const hearingId = json.results[0].id;
  const hearing = await fetch(`${API_URL}/v1/hearing/${hearingId}/`);
  return hearing.json();
};

test.describe('Hearing', () => {
  let page;
  let hearing;

  test.beforeAll(async ({ browser }) => {
    hearing = await fetchHearing();
    page = await browser.newPage();
    await page.goto(hearing.slug);
    await page.getByTestId('cookie-consent-approve-required-button').click();
  });

  test.beforeEach(async () => {
    await page.goto(hearing.slug);
  });

  test('should display Finnish title', async () => {
    await expect(page.locator('main')).toContainText(hearing.title.fi);
  });

  test('should display organization', async () => {
    await expect(page.locator('main')).toContainText(hearing.organization);
  });

  test('should have comment link', async () => {
    const link = page.locator('.internal-link:has-text("Kirjoita kommentti")');
    await expect(link).toBeVisible();
  });

  test('should display comment count', async () => {
    await expect(page.getByTestId('comment-summary')).toContainText(`Yhteensä ${hearing.n_comments} kommenttia`);
  });

  test('should have Swedish link if available', async () => {
    const noSwedishTitle = !hearing.title.sv;
    test.skip(noSwedishTitle, 'No Swedish title available');

    await expect(page.getByTestId('language-select')).toContainText('Hörandet tillgängligt på svenska');
  });

  test('should have English link if available', async () => {
    const noEnglishTitle = !hearing.title.en;
    test.skip(noEnglishTitle, 'No English title available');

    await expect(page.getByTestId('language-select')).toContainText('Hearing available in English');
  });

  test('should display label', async () => {
    const firstFinnishLabel = hearing.labels[0].label.fi;

    if (firstFinnishLabel) {
      await expect(page.locator('[aria-label="Asiasanat"]')).toContainText(firstFinnishLabel);
    }
  });

  test('should display contact person name', async () => {
    const contactPerson = hearing.contact_persons[0];
    await expect(page.locator('.hearing-contacts')).toContainText(contactPerson.name);
  });

  test('should have image with caption', async () => {
    const img = page.locator('.section-image img');
    await expect(img).toHaveAttribute('alt', hearing.main_image.caption.fi);
  });

  test('should have Excel link for comment summary', async () => {
    const link = page.locator('a:has-text("Lataa yhteenveto kommenteista Excel-muodossa")');
    await expect(link).toBeVisible();
  });

  test('should have vote and comment button', async () => {
    const button = page.locator('button:has-text("Äänestä ja kommentoi")').first();
    await expect(button).toBeVisible();
  });

  test('verify visibility of questions and their options', async () => {
    await page.getByRole('button', { name: 'Äänestä ja kommentoi' }).last().click();

    const mainSection = hearing.sections.find((s) => s.type === 'main');
    test.skip(!mainSection, 'No main section found');
    const firstQuestion = mainSection.questions[0];
    const questionText = firstQuestion.text.fi;
    const options = firstQuestion.options.map((o) => o.text.fi);
    await expect(page.locator('.comment-form')).toContainText(questionText);
    await expect(page.getByTestId('question-form-group').locator('.radio')).toContainText(options);
  });

  test('user can successfully submit a comment', async () => {
    await page.getByRole('button', { name: 'Äänestä ja kommentoi' }).last().click();
    await page.getByLabel('Kommentti').fill('testikommentti');
    await page.getByPlaceholder('Anonyymi').fill('Testi Testinen');
    await page.getByRole('button', { name: 'Lähetä' }).click();
    await expect(page.getByText('Kommenttisi on vastaanotettu')).toBeVisible();
  });

  test('check Finnish title in first subsection if subsections exist', async () => {
    const hasSectionCard = hearing.sections.filter((s) => s.type === 'part').length > 0;
    test.skip(!hasSectionCard, 'Hearing does not contain subsections');

    if (hasSectionCard) {
      const button = await page.locator('.section-card button').first();
      await button.click();

      const partSection = hearing.sections.find((s) => s.type === 'part');
      await expect(page.locator('main')).toContainText(partSection.title.fi);
    }
  });
});
