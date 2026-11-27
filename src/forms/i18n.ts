/**
 * Russian and English display text for the main-site form (/ru, /en). The stored values stay the
 * Uzbek option labels from defs.ts, so the sheet has one vocabulary whatever the page language.
 * Translations are by question id and option position.
 */
import { NAME_ERROR, PHONE_ERRORS, TELEGRAM_ERROR } from './contact';

export type FormLang = 'uz' | 'ru' | 'en';

export type QuestionText = { label: string; hint?: string; placeholder?: string; options?: string[] };

const BUDGET = {
  ru: ['До $500', '$500–1 500', '$1 500–5 000', 'Более $5 000', 'Пока не определил(а)'],
  en: ['Up to $500', '$500–1,500', '$1,500–5,000', 'Over $5,000', 'Not decided yet'],
};

export const QUESTION_TEXT: Record<'ru' | 'en', Record<string, QuestionText>> = {
  ru: {
    service: { label: 'С каким направлением нужна помощь?', options: ['От рекламы до продаж — комплексно', 'Маркетинговая стратегия и анализ', 'SMM, контент и Reels', 'Таргетированная реклама', 'Лендинг', 'CRM и процесс продаж', 'Пока точно не знаю'] },
    industry: { label: 'В какой сфере ваш бизнес?', options: ['Строительство и недвижимость', 'Автосалон', 'Образование', 'Производство', 'Торговля или услуги', 'Другое'] },
    industryOther: { label: 'Кратко опишите сферу' },
    instagram: { label: 'Есть ли у бизнеса страница в Instagram?', options: ['Да', 'Нет'] },
    instagramLink: { label: 'Ваша страница в Instagram', placeholder: '@страница или ссылка' },
    adBudget: { label: 'Каким может быть ежемесячный рекламный бюджет?', hint: 'Эта сумма оплачивается рекламной платформе и не входит в стоимость услуг.', options: BUDGET.ru },
    leadsWhere: { label: 'Где сейчас ведутся заявки?', options: ['В CRM-системе', 'В Excel или Google Sheets', 'В Telegram или в тетради', 'Нигде не записываются'] },
  },
  en: {
    service: { label: 'What do you need help with?', options: ['From ads to sales — the full system', 'Marketing strategy and analysis', 'SMM, content and Reels', 'Paid social advertising', 'Landing page', 'CRM and sales process', 'Not sure yet'] },
    industry: { label: 'What industry is your business in?', options: ['Construction and real estate', 'Car dealership', 'Education', 'Manufacturing', 'Retail or services', 'Other'] },
    industryOther: { label: 'Describe your industry briefly' },
    instagram: { label: 'Does your business have an Instagram page?', options: ['Yes', 'No'] },
    instagramLink: { label: 'Your Instagram page', placeholder: '@page or link' },
    adBudget: { label: 'What could your monthly ad budget be?', hint: 'This amount is paid to the ad platform and is not part of our fee.', options: BUDGET.en },
    leadsWhere: { label: 'Where are enquiries kept today?', options: ['In a CRM', 'In Excel or Google Sheets', 'In Telegram or a notebook', 'They are not recorded'] },
  },
};

export type UiText = {
  stepOf: (i: number, n: number) => string;
  next: string; back: string; skip: string; optional: string; choose: string; fill: string; tooLong: (max: number) => string;
  contactTitle: string; name: string; phone: string; phoneHint: string; telegram: string; telegramHint: string;
  submit: string; sending: string; consent: string; privacy: string;
  errors: Record<string, string>;
  retry: string; telegramAlt: string; successTitle: string; successNext: string; successId: string;
  /** Contact validation messages (contact.ts returns Uzbek) → this language. */
  contactErrors: Record<string, string>;
};

export const UI_TEXT: Record<'ru' | 'en', UiText> = {
  ru: {
    stepOf: (i, n) => `${i} / ${n}`,
    next: 'Далее', back: 'Назад', skip: 'Пропустить', optional: 'необязательно',
    choose: 'Выберите один из вариантов', fill: 'Заполните это поле', tooLong: (max) => `Не более ${max} символов`,
    contactTitle: 'Как с вами связаться?', name: 'Ваше имя', phone: 'Номер телефона',
    phoneHint: 'Номер Узбекистана: +998 90 123 45 67. Зарубежный номер пишите с +.',
    telegram: 'Telegram username', telegramHint: 'Если вам удобнее переписка в Telegram',
    submit: 'Отправить заявку', sending: 'Отправка…',
    consent: 'Ваши данные используются только для связи по этой заявке.', privacy: 'Политика конфиденциальности',
    errors: {
      network: 'Заявка не отправлена: пропало соединение или сервер не ответил. Ваши ответы сохранены — отправьте ещё раз.',
      timeout: 'Сервер не ответил вовремя. Ваши ответы сохранены — отправьте ещё раз.',
      unavailable: 'Сейчас не удалось сохранить заявку. Ответы сохранены — попробуйте чуть позже или напишите в Telegram.',
      rate_limited: 'С этого номера недавно отправлено несколько заявок. Попробуйте позже или напишите в Telegram.',
      too_fast: 'Заявка отправлена слишком быстро. Нажмите кнопку ещё раз.',
      invalid: 'Некоторые ответы не приняты. Проверьте отмеченное поле и отправьте снова.',
      unknown: 'Заявка не отправлена. Ответы сохранены — попробуйте ещё раз.',
    },
    retry: 'Отправить ещё раз', telegramAlt: 'Или напишите в Telegram',
    successTitle: 'Заявка принята',
    successNext: 'Следующий шаг: наш специалист свяжется с вами по телефону или в Telegram, уточнит задачу и назначит встречу-знакомство.',
    successId: 'Номер заявки',
    contactErrors: {
      [PHONE_ERRORS.empty]: 'Введите номер телефона',
      [PHONE_ERRORS.short]: 'Номер неполный: после +998 должно быть 9 цифр',
      [PHONE_ERRORS.long]: 'В номере лишние цифры: после +998 должно быть 9 цифр',
      [PHONE_ERRORS.zero]: 'Код оператора не начинается с 0 — проверьте номер',
      [PHONE_ERRORS.letters]: 'В номере могут быть только цифры, пробелы, +, - и скобки',
      [PHONE_ERRORS.foreign]: 'Зарубежный номер пишите с + и кодом страны (например, +7…, +1…)',
      [TELEGRAM_ERROR]: 'Telegram username — 5–32 латинских букв, цифр или _ (например, @fazo_digital)',
      [NAME_ERROR]: 'Введите имя (2–60 символов)',
    },
  },
  en: {
    stepOf: (i, n) => `${i} / ${n}`,
    next: 'Next', back: 'Back', skip: 'Skip', optional: 'optional',
    choose: 'Choose one of the options', fill: 'Please fill in this field', tooLong: (max) => `${max} characters at most`,
    contactTitle: 'How can we reach you?', name: 'Your name', phone: 'Phone number',
    phoneHint: 'Uzbek number: +998 90 123 45 67. Write a foreign number with +.',
    telegram: 'Telegram username', telegramHint: 'If Telegram is more convenient for you',
    submit: 'Send enquiry', sending: 'Sending…',
    consent: 'Your data is used only to contact you about this enquiry.', privacy: 'Privacy policy',
    errors: {
      network: 'Not sent: the connection dropped or the server did not respond. Your answers are kept — please send again.',
      timeout: 'The server took too long to answer. Your answers are kept — please send again.',
      unavailable: 'We could not save the enquiry right now. Your answers are kept — try again shortly or message us on Telegram.',
      rate_limited: 'Several enquiries were sent from this number recently. Please try later or message us on Telegram.',
      too_fast: 'The enquiry was sent too quickly. Please press the button once more.',
      invalid: 'Some answers were not accepted. Check the marked field and send again.',
      unknown: 'Not sent. Your answers are kept — please try again.',
    },
    retry: 'Send again', telegramAlt: 'Or message us on Telegram',
    successTitle: 'Enquiry received',
    successNext: 'Next step: our specialist will contact you by phone or Telegram, clarify the task and schedule an intro meeting.',
    successId: 'Enquiry number',
    contactErrors: {
      [PHONE_ERRORS.empty]: 'Enter your phone number',
      [PHONE_ERRORS.short]: 'The number is incomplete: 9 digits are needed after +998',
      [PHONE_ERRORS.long]: 'The number has extra digits: 9 digits are needed after +998',
      [PHONE_ERRORS.zero]: 'Operator codes do not start with 0 — check the number',
      [PHONE_ERRORS.letters]: 'Use digits, spaces, +, - and brackets only',
      [PHONE_ERRORS.foreign]: 'Write a foreign number with + and the country code (e.g. +7…, +1…)',
      [TELEGRAM_ERROR]: 'A Telegram username is 5–32 Latin letters, digits or _ (e.g. @fazo_digital)',
      [NAME_ERROR]: 'Enter your name (2–60 characters)',
    },
  },
};
