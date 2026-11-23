import { useEffect, useRef, useState } from 'react';
import IntroSplash from './components/IntroSplash.jsx';

// Vite serves files in /public directly at the root URL
const Logo = '/logo.png';
const DonateMissionImg = '/donate-mission.jpg';

const REQUEST_FORM_VIEW_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSejb8t6n8Ueerspex4uf6swcg7AHybMlWZUA2rCo-Gf-sKr_g/viewform';

const DONOR_FORM_VIEW_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfNiUCJB-pkqhM0ykO-AGffZrxzhWpivj1gSOs_Nba0AheXNg/viewform';

const LANGUAGE_STORAGE_KEY = 'get_a_quran_ui_lang';
const PAGE_IDS = ['home', 'request', 'support-mission', 'about-us'];

const getPageFromHash = () => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.slice(1);
  if (hash === 'top') return 'home';
  if (hash === 'request-form') return 'request';
  return PAGE_IDS.includes(hash) ? hash : 'home';
};

const UI_COPY = {
  en: {
    brandName: 'Get a Quran',
    brandTagline: 'Free Hardcopy Initiative',
    navHome: 'Home',
    navAbout: 'About Us',
    navDonate: 'Support Mission',
    navCta: 'Request a Quran',
    heroBadge: '100% Free Printed Mushaf • Delivered to Your Doorstep',
    heroTitleBefore: 'Receive a Printed Hardcopy of ',
    heroTitleHighlight: 'Quran Pak',
    heroTitleAfter: ' with Urdu Translation',
    heroSubtitle:
      'Whether you are beginning your study of the Holy Quran or need a clear translated copy for your home, simply click below and complete the request form. We carefully package and dispatch your physical copy at zero cost.',
    heroPrimaryCta: 'Request a Quran Now',
    heroSecondaryCta: 'Open Google Form directly',
    trustStats: [
      { value: 'Free', label: 'Book & Shipping Cost' },
      { value: 'Standard Size', label: 'One Available Size' },
      { value: 'Urdu', label: 'Translation' },
      { value: 'Free Delivery', label: 'No Shipping Cost' },
    ],
    homeOfferBadge: 'A Mushaf for your home',
    homeOfferHeading: 'A clear copy, delivered with care',
    homeOfferLead:
      'Get a standard-size printed Quran with Urdu translation, prepared with care and sent to you free of charge.',
    homeOfferPoints: [
      'Clear Arabic text with Urdu translation',
      'One standard-size edition',
      'No cost for the Quran or its delivery',
    ],
    homeProcessHeading: 'Getting your Quran is simple',
    homeProcessLead: 'A few steps are all it takes to request your free copy.',
    homeSteps: [
      {
        title: 'Send your request',
        description: 'Share your details using the Quran request form.',
      },
      {
        title: 'We prepare your copy',
        description: 'Our volunteer team arranges your Quran with care.',
      },
      {
        title: 'Receive it at home',
        description: 'Your printed copy is delivered to you free of charge.',
      },
    ],
    homeCtaHeading: 'Begin your Quran journey',
    homeCtaLead: 'Request a printed copy in just a few minutes.',
    homeAboutLink: 'Learn about our mission',
    bookTopLabel: 'The Noble Quran',
    bookTranslationLabel: 'Arabic + Urdu Translation',
    editionTitle: 'Standard-Size Quran',
    editionSize: 'Urdu translation',
    editionDescription:
      'A printed Quran with Urdu translation, available in standard size.',
    insideSampleHeader: 'Inside Page Sample • Tarjuma: Fateh Muhammad Jalandhari',
    formBadge: 'Request Form',
    formHeading: 'Enter Your Details to Receive a Quran',
    formLanguageLabel: 'Form language',
    shareBtn: 'Share Form',
    copiedBtn: 'Link Copied!',
    newTabBtn: 'New Tab',
    loadingTitle: 'Loading Request Form...',
    loadingFallbackPrefix: 'Taking too long?',
    loadingFallbackLink: 'Open the form directly',
    formPrivacyNote:
      'Your information is submitted directly via our official form and used strictly for courier dispatch.',
    donateBadge: 'Sadaqah Jariyah • Support the Mission',
    donateHeading: 'Gift a Quran, Earn Perpetual Reward',
    donateLead:
      'Every hardcopy we dispatch is made possible through collective generosity. By contributing toward printing, protective packaging, or courier delivery, you help place the words of Allah into the hands of someone eager to read and understand.',
    donateHadith:
      '“When a person passes away, their deeds come to an end except for three: ongoing charity (Sadaqah Jariyah), beneficial knowledge, or a righteous child who prays for them.”',
    donateHadithRef: '— Sahih Muslim',
    donateHighlights: [
      '100% of contributions go directly toward Mushaf printing & courier dispatch',
      'Sponsor copies on behalf of yourself or loved ones as Sadaqah Jariyah',
      'Help reach students, families, and seekers in remote areas at zero cost to them',
    ],
    donatePrimaryCta: 'Complete Donor Form',
    donateSecondaryCta: 'Share This Mission',
    donateSharedMsg: 'Mission Link Copied!',
    donorFormBadge: 'Donor Form',
    donorFormHeading: 'Sponsor a Mushaf (Sadaqah Jariyah)',
    donorFormLanguageLabel: 'Form language',
    donorLoadingTitle: 'Loading Donor Form...',
    donorFormPrivacyNote:
      'Your contribution details are submitted directly via our official form so our volunteer team can confirm receipt and dispatch copies.',
    aboutBadge: 'About Us',
    aboutHeading: 'Connecting People with Divine Knowledge',
    aboutLead:
      'Get a Quran is an initiative taken by a team of volunteers. Our mission is to connect people with divine knowledge by placing clear, translated hardcopies of the Holy Quran directly into the hands of every seeker.',
    aboutPillars: [
      {
        title: 'Volunteer-Driven Team',
        description:
          'Organized and run by dedicated volunteers working together to serve seekers of truth with sincerity and care.',
      },
      {
        title: 'Divine Knowledge',
        description:
          'Helping individuals read, reflect upon, and understand the timeless guidance of the Holy Quran in a language they comprehend.',
      },
      {
        title: 'Accessible to All',
        description:
          'Removing financial and logistical barriers by packaging and delivering every Mushaf completely free of charge.',
      },
    ],
    footerDesc:
      'Dedicated to delivering translated hardcopies of the Holy Quran to every seeker.',
    footerNote:
      'Every Mushaf is sanitized, wrapped with reverence, and shipped free of charge.',
  },
  ur: {
    brandName: 'قرآن حاصل کریں',
    brandTagline: 'مفت نسخہ قرآن مہم',
    navHome: 'صفحۂ اول',
    navAbout: 'ہمارے بارے میں',
    navDonate: 'تعاون کریں',
    navCta: 'قرآن منگوائیں',
    heroBadge: 'مکمل مفت مطبوعہ قرآن پاک • آپ کی دہلیز تک ترسیل',
    heroTitleBefore: 'اردو ترجمہ کے ساتھ ',
    heroTitleHighlight: 'قرآن پاک',
    heroTitleAfter: ' کا مطبوعہ نسخہ مفت حاصل کریں',
    heroSubtitle:
      'چاہے آپ قرآن مجید کا مطالعہ شروع کر رہے ہوں یا اپنے گھر کے لیے واضح ترجمے والا نسخہ چاہتے ہوں، نیچے کلک کریں اور درخواست فارم پُر کریں۔ ہم بغیر کسی معاوضے کے نہایت احترام کے ساتھ آپ کا نسخہ روانہ کریں گے۔',
    heroPrimaryCta: 'ابھی قرآن کی درخواست کریں',
    heroSecondaryCta: 'براہِ راست گوگل فارم کھولیں',
    trustStats: [
      { value: 'بالکل مفت', label: 'کتاب اور ترسیل کے اخراجات' },
      { value: 'معیاری سائز', label: 'صرف ایک دستیاب سائز' },
      { value: 'اردو', label: 'ترجمہ' },
      { value: 'مفت ترسیل', label: 'کوئی ترسیلی خرچ نہیں' },
    ],
    homeOfferBadge: 'آپ کے گھر کے لیے قرآن پاک',
    homeOfferHeading: 'واضح نسخہ، احترام کے ساتھ آپ تک',
    homeOfferLead:
      'اردو ترجمے کے ساتھ معیاری سائز کا مطبوعہ قرآن پاک حاصل کریں۔ ہر نسخہ توجہ سے تیار کر کے آپ کو بالکل مفت بھیجا جاتا ہے۔',
    homeOfferPoints: [
      'واضح عربی متن کے ساتھ اردو ترجمہ',
      'صرف ایک معیاری سائز میں دستیاب',
      'قرآن پاک اور ترسیل بالکل مفت',
    ],
    homeProcessHeading: 'قرآن حاصل کرنے کا آسان طریقہ',
    homeProcessLead: 'مفت نسخہ حاصل کرنے کے لیے صرف چند آسان مراحل ہیں۔',
    homeSteps: [
      {
        title: 'درخواست بھیجیں',
        description: 'قرآن کی درخواست کے فارم میں اپنی تفصیلات درج کریں۔',
      },
      {
        title: 'ہم نسخہ تیار کرتے ہیں',
        description: 'ہماری رضاکار ٹیم آپ کا نسخہ توجہ اور احترام سے تیار کرتی ہے۔',
      },
      {
        title: 'گھر پر وصول کریں',
        description: 'مطبوعہ نسخہ آپ تک بالکل مفت پہنچایا جاتا ہے۔',
      },
    ],
    homeCtaHeading: 'قرآن کے مطالعے کا آغاز کریں',
    homeCtaLead: 'چند منٹ میں اپنے مطبوعہ نسخے کی درخواست دیں۔',
    homeAboutLink: 'ہمارے مشن کے بارے میں جانیں',
    bookTopLabel: 'القرآن الحکیم',
    bookTranslationLabel: 'عربی + اردو ترجمہ',
    editionTitle: 'معیاری سائز کا قرآن پاک',
    editionSize: 'اردو ترجمہ',
    editionDescription:
      'اردو ترجمے کے ساتھ مطبوعہ قرآن پاک، صرف معیاری سائز میں دستیاب ہے۔',
    insideSampleHeader: 'اندرونی صفحے کا نمونہ • ترجمہ: فتح محمد جالندھری',
    formBadge: 'درخواست فارم',
    formHeading: 'قرآن پاک حاصل کرنے کے لیے اپنی تفصیلات درج کریں',
    formLanguageLabel: 'فارم کی زبان',
    shareBtn: 'فارم شیئر کریں',
    copiedBtn: 'لنک کاپی ہو گیا!',
    newTabBtn: 'نیا ٹیب',
    loadingTitle: 'درخواست فارم لوڈ ہو رہا ہے...',
    loadingFallbackPrefix: 'زیادہ وقت لگ رہا ہے؟',
    loadingFallbackLink: 'فارم براہِ راست کھولیں',
    formPrivacyNote:
      'آپ کی معلومات براہِ راست ہمارے آفیشل فارم کے ذریعے جمع ہوتی ہیں اور صرف کوریئر ترسیل کے لیے استعمال کی جاتی ہیں۔',
    donateBadge: 'صدقہ جاریہ • اس مشن کا حصہ بنیں',
    donateHeading: 'قرآن پاک کا ہدیہ دیں اور دائمی اجر پائیں',
    donateLead:
      'ہماری جانب سے بھیجا جانے والا ہر مطبوعہ نسخہ اہلِ خیر کے تعاون سے ممکن ہوتا ہے۔ طباعت، محفوظ پیکنگ اور کوریئر ترسیل میں حصہ ڈال کر آپ کلامِ الٰہی کو پڑھنے اور سمجھنے کے متلاشی افراد تک پہنچانے کا ذریعہ بن سکتے ہیں۔',
    donateHadith:
      '”جب انسان فوت ہو جاتا ہے تو اس کے اعمال کا سلسلہ منقطع ہو جاتا ہے سوائے تین چیزوں کے: صدقہ جاریہ، یا ایسا علم جس سے فائدہ اٹھایا جائے، یا نیک اولاد جو اس کے لیے دعا کرے۔“',
    donateHadithRef: '— صحیح مسلم',
    donateHighlights: [
      'آپ کا پورا تعاون براہِ راست قرآن پاک کی طباعت اور ترسیل پر خرچ ہوتا ہے',
      'اپنے یا اپنے مرحومین کے ایصالِ ثواب کے لیے صدقہ جاریہ کے طور پر نسخے ہدیہ کریں',
      'دور دراز علاقوں کے طلبہ اور خاندانوں تک مفت قرآن پہنچانے میں مدد کریں',
    ],
    donatePrimaryCta: 'عطیہ فارم پُر کریں',
    donateSecondaryCta: 'مشن شیئر کریں',
    donateSharedMsg: 'مشن کا لنک کاپی ہو گیا!',
    donorFormBadge: 'عطیات فارم',
    donorFormHeading: 'قرآن پاک کا نسخہ ہدیہ کریں (صدقہ جاریہ)',
    donorFormLanguageLabel: 'فارم کی زبان',
    donorLoadingTitle: 'عطیات فارم لوڈ ہو رہا ہے...',
    donorFormPrivacyNote:
      'آپ کی تفصیلات براہِ راست ہمارے آفیشل فارم کے ذریعے جمع ہوتی ہیں تاکہ ہماری رضاکار ٹیم تصدیق کر کے آپ کی جانب سے نسخے روانہ کر سکے۔',
    aboutBadge: 'ہمارے بارے میں',
    aboutHeading: 'لوگوں کو کتاب اللہ سے جوڑنے کا مشن',
    aboutLead:
      'گیٹ اے قرآن (Get a Quran) رضاکاروں کی ایک ٹیم کی جانب سے شروع کیا گیا ایک اقدام ہے۔ ہمارا مشن لوگوں کو کتاب اللہ سے جوڑنا ہے تاکہ ہدایت اور فہم کے متلاشی ہر فرد تک ترجمہ شدہ قرآن پاک کے مطبوعہ نسخے پہنچ سکیں۔',
      aboutPillars: [
      {
        title: 'رضاکاروں کی ٹیم',
        description:
          'یہ کاوش مخلص رضاکاروں کی ایک ٹیم کے ذریعے چلائی جا رہی ہے جو خالصتاً خدمتِ دین اور خلقِ خدا کی رہنمائی کے جذبے سے سرشار ہیں۔',
      },
      {
        title: 'کتاب اللہ تک رسائی',
        description:
          'ہر انسان کو اپنی سمجھ میں آنے والی زبان میں قرآن مجید کی ابدی ہدایت پڑھنے، سمجھنے اور اس پر غور و فکر کرنے کا موقع فراہم کرنا۔',
      },
      {
        title: 'ہر فرد کے لیے مفت',
        description:
          'مالی اور ترسیلی رکاوٹوں کو ختم کرتے ہوئے ہر مصحف کو نہایت ادب کے ساتھ پیک کر کے بالکل مفت آپ تک پہنچایا جاتا ہے۔',
      },
    ],
    footerDesc:
      'ہر طالبِ علم اور متلاشیِ حق تک ترجمہ شدہ قرآن پاک کے مطبوعہ نسخے پہنچانے کے لیے وقف۔',
    footerNote:
      'ہر مصحف کو نہایت ادب و احترام سے پیک کر کے بالکل مفت ارسال کیا جاتا ہے۔',
  },
};

export const GetAQuran = () => {
  const donorFormCardRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(getPageFromHash);

  const [uiLang, setUiLang] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang === 'ur' || savedLang === 'en') {
          return savedLang;
        }
      } catch {
        // Fallback to default language if storage access is restricted
      }
    }
    return 'en';
  });
  const [formLang, setFormLang] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang === 'ur' || savedLang === 'en') return savedLang;
      } catch {
        // Use the default language if storage access is restricted.
      }
    }
    return 'en';
  });

  const [isFormLoading, setIsFormLoading] = useState(true);
  const [isDonorFormLoading, setIsDonorFormLoading] = useState(true);
  const [highlightForm, setHighlightForm] = useState(false);
  const [highlightDonorForm, setHighlightDonorForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDonorLink, setCopiedDonorLink] = useState(false);
  const [copiedMissionLink, setCopiedMissionLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, uiLang);
      } catch {
        // Ignore storage write errors in restricted browsing modes
      }
    }
  }, [uiLang]);

  useEffect(() => {
    const syncPageWithHash = () => setCurrentPage(getPageFromHash());
    window.addEventListener('popstate', syncPageWithHash);
    window.addEventListener('hashchange', syncPageWithHash);
    return () => {
      window.removeEventListener('popstate', syncPageWithHash);
      window.removeEventListener('hashchange', syncPageWithHash);
    };
  }, []);

  const isUrdu = uiLang === 'ur';
  const t = UI_COPY[uiLang];
  const requestFormViewUrl = `${REQUEST_FORM_VIEW_URL}?hl=${formLang}`;
  const requestFormEmbedUrl = `${REQUEST_FORM_VIEW_URL}?embedded=true&hl=${formLang}`;
  const donorFormViewUrl = `${DONOR_FORM_VIEW_URL}?hl=${formLang}`;
  const donorFormEmbedUrl = `${DONOR_FORM_VIEW_URL}?embedded=true&hl=${formLang}`;

  const changeFormLanguage = (language) => {
    setFormLang(language);
    setIsFormLoading(true);
    setIsDonorFormLoading(true);
  };

  const navigateToPage = (page) => {
    setMobileMenuOpen(false);
    setCurrentPage(page);
    const nextHash = page === 'home' ? '#home' : `#${page}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToRequestForm = () => {
    navigateToPage('request');
    setHighlightForm(true);
    setTimeout(() => setHighlightForm(false), 1600);
  };

  const scrollToDonorForm = () => {
    setMobileMenuOpen(false);
    donorFormCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlightDonorForm(true);
    setTimeout(() => setHighlightDonorForm(false), 1600);
  };

  const handleCopyFormLink = async () => {
    try {
      await navigator.clipboard.writeText(requestFormViewUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      window.open(requestFormViewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyDonorFormLink = async () => {
    try {
      await navigator.clipboard.writeText(donorFormViewUrl);
      setCopiedDonorLink(true);
      setTimeout(() => setCopiedDonorLink(false), 2200);
    } catch {
      window.open(donorFormViewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareMission = async () => {
    const shareUrl =
      typeof window !== 'undefined' ? window.location.href : DONOR_FORM_VIEW_URL;
    try {
      if (navigator.share) {
        await navigator.share({
          title: t.brandName,
          text: t.donateHeading,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopiedMissionLink(true);
      setTimeout(() => setCopiedMissionLink(false), 2200);
    } catch {
      // User dismissed share sheet or clipboard unavailable
    }
  };

  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      className={`min-h-screen overflow-x-hidden bg-[#FAF7F0] text-[#1C1917] selection:bg-[#134E3A] selection:text-[#FAF7F0] ${
        isUrdu
          ? "font-['Noto_Nastaliq_Urdu','Amiri',serif]"
          : "font-['Plus_Jakarta_Sans',sans-serif]"
      }`}
    >
      <IntroSplash uiLang={uiLang} />
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#E5DEC9] bg-[#FAF7F0]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3.5 py-3 sm:gap-3 sm:px-6 sm:py-3.5 lg:px-8">
          {/* Brand Logo + Title */}
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              navigateToPage('home');
            }}
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="flex h-12 w-36 shrink-0 items-center justify-start bg-transparent sm:h-14 sm:w-40">
              <img
                src={Logo}
                alt={t.brandName}
                className="h-full w-full object-contain object-left"
              />
            </div>
            <span className="sr-only">{t.brandName}</span>
          </a>

          {/* Navigation Controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a
              href="#support-mission"
              onClick={(event) => {
                event.preventDefault();
                navigateToPage('support-mission');
              }}
              className={`hidden font-semibold text-[#57534E] transition-colors hover:text-[#134E3A] md:inline-block ${
                isUrdu ? 'text-sm leading-normal' : 'text-sm'
              }`}
            >
              {t.navDonate}
            </a>

            <a
              href="#about-us"
              onClick={(event) => {
                event.preventDefault();
                navigateToPage('about-us');
              }}
              className={`hidden font-semibold text-[#57534E] transition-colors hover:text-[#134E3A] md:inline-block ${
                isUrdu ? 'text-sm leading-normal' : 'text-sm'
              }`}
            >
              {t.navAbout}
            </a>

            {/* Language Switcher Pill (Persisted in localStorage) */}
            <div
              role="group"
              aria-label="Language selector"
              dir="ltr"
              className="inline-flex items-center rounded-full border border-[#D8CCA8] bg-[#F3EDE0] p-0.5 sm:p-1"
            >
              <button
                type="button"
                onClick={() => {
                  setUiLang('en');
                  changeFormLanguage('en');
                }}
                aria-pressed={uiLang === 'en'}
                className={`rounded-full px-2.5 py-1 font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold transition-all sm:px-3 sm:text-xs ${
                  uiLang === 'en'
                    ? 'bg-[#134E3A] text-[#FAF7F0] shadow-sm'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  setUiLang('ur');
                  changeFormLanguage('ur');
                }}
                aria-pressed={uiLang === 'ur'}
                className={`rounded-full px-2.5 py-1 font-['Amiri',serif] text-xs font-bold leading-none transition-all sm:px-3 sm:text-sm ${
                  uiLang === 'ur'
                    ? 'bg-[#134E3A] text-[#FAF7F0] shadow-sm'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                اردو
              </button>
            </div>

            {/* Desktop / Tablet Primary CTA */}
            {/* <button
              type="button"
              onClick={scrollToRequestForm}
              className={`hidden items-center gap-2 rounded-full bg-[#134E3A] px-4 py-2.5 font-semibold text-[#FAF7F0] shadow-sm transition-all hover:bg-[#0E3B2C] hover:shadow focus:outline-none focus:ring-2 focus:ring-[#B68635] focus:ring-offset-2 focus:ring-offset-[#FAF7F0] sm:inline-flex sm:px-5 ${
                isUrdu ? 'text-sm leading-normal' : 'text-sm'
              }`}
            >
              <span>{t.navCta}</span>
              <svg
                className="h-4 w-4 shrink-0 text-[#E6C786]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button> */}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8CCA8] bg-[#F3EDE0] text-[#134E3A] transition-colors hover:bg-[#E5DEC9] sm:hidden"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E5DEC9] bg-[#FAF7F0] px-4 py-4 shadow-md sm:hidden">
            <div className="flex flex-col gap-2.5">
              <a
                href="#support-mission"
                onClick={(event) => {
                  event.preventDefault();
                  navigateToPage('support-mission');
                }}
                className={`rounded-xl px-3 py-2 font-semibold text-[#1C1917] transition-colors hover:bg-[#F3EDE0] ${
                  isUrdu ? 'text-sm leading-loose' : 'text-sm'
                }`}
              >
                {t.navDonate}
              </a>
              <a
                href="#about-us"
                onClick={(event) => {
                  event.preventDefault();
                  navigateToPage('about-us');
                }}
                className={`rounded-xl px-3 py-2 font-semibold text-[#1C1917] transition-colors hover:bg-[#F3EDE0] ${
                  isUrdu ? 'text-sm leading-loose' : 'text-sm'
                }`}
              >
                {t.navAbout}
              </a>
              <a
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  navigateToPage('home');
                }}
                className={`rounded-xl px-3 py-2 font-semibold text-[#1C1917] transition-colors hover:bg-[#F3EDE0] ${
                  isUrdu ? 'text-sm leading-loose' : 'text-sm'
                }`}
              >
                {t.navHome}
              </a>
              <button
                type="button"
                onClick={scrollToRequestForm}
                className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#134E3A] px-5 py-3 font-semibold text-[#FAF7F0] shadow-sm ${
                  isUrdu ? 'text-sm leading-normal' : 'text-sm'
                }`}
              >
                <span>{t.navCta}</span>
                <svg
                  className="h-4 w-4 shrink-0 text-[#E6C786]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {currentPage === 'home' && (
        <>
      {/* Hero Section */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-[#E5DEC9] py-10 sm:py-16 lg:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {/* <p
            dir="rtl"
            className="mb-3 font-['Amiri',serif] text-xl text-[#134E3A] sm:mb-4 sm:text-3xl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p> */}

          {/* <div
            className={`mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#D8CCA8] bg-[#F3EDE0] px-3.5 py-1.5 font-semibold text-[#8C6828] sm:mb-6 sm:px-4 ${
              isUrdu
                ? 'text-xs leading-loose sm:text-sm'
                : 'text-[11px] tracking-wide sm:text-xs sm:uppercase sm:tracking-wider'
            }`}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#134E3A]" />
            {t.heroBadge.split(' • ').map((part, index) => (
              <span className="contents" key={part}>
                {index > 0 && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#134E3A]" />
                )}
                <span>{part}</span>
              </span>
            ))}
          </div> */}

          <h1
            className={`font-bold text-[#1C1917] ${
              isUrdu
                ? 'text-2xl leading-[2.15] sm:text-4xl sm:leading-[2.1] lg:text-5xl lg:leading-[2.1]'
                : "font-['Lora',serif] text-[28px] leading-[1.25] tracking-tight sm:text-4xl lg:text-[52px]"
            }`}
          >
            {t.heroTitleBefore}
            <span className="text-[#134E3A]">{t.heroTitleHighlight}</span>
            {t.heroTitleAfter}
          </h1>

          <p
            className={`mx-auto mt-4 max-w-2xl text-[#57534E] sm:mt-6 ${
              isUrdu
                ? 'text-sm leading-[2.2] sm:text-lg sm:leading-[2.2]'
                : 'text-sm leading-relaxed sm:text-lg'
            }`}
          >
            {t.heroSubtitle}
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3.5 sm:mt-9 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={scrollToRequestForm}
              className={`min-h-[48px] w-full rounded-full bg-[#134E3A] px-7 py-3.5 font-semibold text-[#FAF7F0] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#0E3B2C] hover:shadow-lg sm:w-auto sm:px-8 sm:py-4 ${
                isUrdu ? 'text-base leading-relaxed' : 'text-sm sm:text-base'
              }`}
            >
              {t.heroPrimaryCta}
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Simplicity Bar */}
      {/* <section className="border-b border-[#E5DEC9] bg-[#F3EDE0]/70 py-6 sm:py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:gap-6 sm:px-6 md:grid-cols-4 lg:px-8">
          {t.trustStats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#E5DEC9]/80 bg-[#FAF7F0]/70 p-3.5 text-center sm:border-0 sm:bg-transparent sm:p-0"
            >
              <p
                className={`font-bold text-[#134E3A] ${
                  isUrdu
                    ? 'text-lg leading-loose sm:text-2xl'
                    : "font-['Lora',serif] text-xl sm:text-2xl lg:text-3xl"
                }`}
              >
                {stat.value}
              </p>
              <p
                className={`mt-1 font-medium text-[#57534E] ${
                  isUrdu
                    ? 'text-[11px] leading-loose sm:text-xs'
                    : 'text-[11px] uppercase tracking-wider sm:text-xs'
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* <section className="border-b border-[#E5DEC9] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 md:grid-cols-2 md:gap-12 lg:px-8">
          <div>
            <p
              className={`mb-3 font-semibold text-[#8C6828] ${
                isUrdu ? 'text-sm leading-loose' : 'text-xs uppercase tracking-widest'
              }`}
            >
              {t.homeOfferBadge}
            </p>
            <h2
              className={`font-bold text-[#134E3A] ${
                isUrdu
                  ? 'text-2xl leading-[2.1] sm:text-3xl'
                  : "font-['Lora',serif] text-2xl tracking-tight sm:text-3xl"
              }`}
            >
              {t.homeOfferHeading}
            </h2>
            <p
              className={`mt-4 text-[#57534E] ${
                isUrdu ? 'text-sm leading-[2.2] sm:text-base' : 'text-sm leading-relaxed sm:text-base'
              }`}
            >
              {t.homeOfferLead}
            </p>
            <ul className="mt-5 space-y-3">
              {t.homeOfferPoints.map((point) => (
                <li
                  key={point}
                  className={`flex items-start gap-3 text-[#44403C] ${
                    isUrdu ? 'text-sm leading-[2.1]' : 'text-sm'
                  }`}
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#134E3A] text-[#E6C786]">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={scrollToRequestForm}
              className={`mt-7 inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#134E3A] px-6 py-3 font-semibold text-[#FAF7F0] shadow-sm transition-colors hover:bg-[#0E3B2C] ${
                isUrdu ? 'text-sm leading-loose' : 'text-sm'
              }`}
            >
              {t.heroPrimaryCta}
            </button>
          </div>

          <div className="rounded-3xl border border-[#DFD6BE] bg-[#F3EDE0] p-5 shadow-sm sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative w-40 shrink-0 rounded-r-2xl rounded-l-md border-2 border-[#B68635] bg-gradient-to-br from-[#165943] via-[#134E3A] to-[#0B3124] p-3.5 text-center text-[#FAF7F0] shadow-xl sm:w-44">
                <div className="absolute inset-y-0 left-0 w-2.5 border-r border-[#B68635]/50 bg-[#0A291E]" />
                <div className="rounded-lg border border-[#B68635]/70 p-3">
                  <p
                    className={`text-[#E6C786] ${
                      isUrdu ? 'text-xs leading-relaxed' : 'text-[9px] uppercase tracking-[0.2em]'
                    }`}
                  >
                    {t.bookTopLabel}
                  </p>
                  <p
                    dir="rtl"
                    className="my-3 font-['Amiri',serif] text-2xl font-bold text-[#F3D999]"
                  >
                    القرآن الکریم
                  </p>
                  <div className="mx-auto my-2 h-px w-10 bg-[#B68635]" />
                  <p
                    className={`mt-2 font-medium text-[#E7E5E4] ${
                      isUrdu ? 'text-xs leading-loose' : 'text-[11px]'
                    }`}
                  >
                    {t.bookTranslationLabel}
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-start">
                <h3
                  className={`font-bold text-[#1C1917] ${
                    isUrdu ? 'text-base leading-loose' : "font-['Lora',serif] text-lg"
                  }`}
                >
                  {t.editionTitle}
                </h3>
                <p
                  className={`mt-2 font-semibold text-[#134E3A] ${
                    isUrdu ? 'text-xs leading-loose' : 'text-xs'
                  }`}
                >
                  {t.editionSize}
                </p>
                <p
                  className={`mt-3 text-[#57534E] ${
                    isUrdu ? 'text-sm leading-[2.1]' : 'text-sm leading-relaxed'
                  }`}
                >
                  {t.editionDescription}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-[#E5DEC9] bg-[#FAF7F0] p-4 text-center">
              <p
                className={`mb-1 font-semibold text-[#8C6828] ${
                  isUrdu ? 'text-xs leading-loose' : 'text-[10px] uppercase tracking-wider'
                }`}
              >
                {t.insideSampleHeader}
              </p>
              <p dir="rtl" className="font-['Amiri',serif] text-xl leading-loose text-[#1C1917]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
              </p>
              <p dir="rtl" className="font-['Amiri',serif] text-sm leading-loose text-[#44403C]">
                شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="bg-[#FAF7F0]/60 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className={`font-bold text-[#134E3A] ${
                isUrdu
                  ? 'text-2xl leading-[2.1] sm:text-3xl'
                  : "font-['Lora',serif] text-2xl tracking-tight sm:text-3xl"
              }`}
            >
              {t.homeProcessHeading}
            </h2>
            <p
              className={`mt-3 text-[#57534E] ${
                isUrdu ? 'text-sm leading-[2.1]' : 'text-sm leading-relaxed sm:text-base'
              }`}
            >
              {t.homeProcessLead}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3 md:gap-6">
            {t.homeSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-[#DFD6BE] bg-[#FAF7F0] p-5 shadow-sm sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#134E3A] font-['Lora',serif] text-lg font-bold text-[#E6C786]">
                  {index + 1}
                </span>
                <h3
                  className={`mt-4 font-bold text-[#1C1917] ${
                    isUrdu ? 'text-base leading-loose' : "font-['Lora',serif] text-lg"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`mt-2 text-[#57534E] ${
                    isUrdu ? 'text-sm leading-[2.1]' : 'text-sm leading-relaxed'
                  }`}
                >
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

        </>
      )}

      {/* Main Request Section: Mushaf Card + Embedded Quran Request Form */}
      {currentPage === 'request' && (
        <main
        id="request-form"
        className="mx-auto max-w-6xl scroll-mt-16 px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="flex justify-center items-center gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Left Column: Mushaf Visual & Inside Script Sample */}
        

          {/* Right Column: Integrated Request Google Form Card */}
          <div className="lg:col-span-7">
            <div
              className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 ${
                highlightForm
                  ? 'border-[#134E3A] ring-4 ring-[#134E3A]/15'
                  : 'border-[#E5DEC9]'
              }`}
            >
              {/* Emerald & Gold Header Bar */}
              <div className="border-b border-[#E5DEC9] bg-[#134E3A] px-4 py-4 text-[#FAF7F0] sm:px-8 sm:py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span
                      className={`font-bold text-[#E6C786] ${
                        isUrdu ? 'text-xs leading-loose' : 'text-[11px] uppercase tracking-widest'
                      }`}
                    >
                      {t.formBadge}
                    </span>
                    <h2
                      className={`mt-0.5 font-bold ${
                        isUrdu
                          ? 'text-base leading-loose sm:text-xl'
                          : "font-['Lora',serif] text-lg sm:text-2xl"
                      }`}
                    >
                      {t.formHeading}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      role="group"
                      aria-label={t.formLanguageLabel}
                      dir="ltr"
                      className="inline-flex items-center rounded-full border border-[#D8CCA8] bg-[#F3EDE0] p-0.5"
                    >
                      <button
                        type="button"
                        onClick={() => changeFormLanguage('en')}
                        aria-pressed={formLang === 'en'}
                        className={`rounded-full px-2.5 py-1 font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold ${
                          formLang === 'en' ? 'bg-[#FAF7F0] text-[#134E3A] shadow-sm' : 'text-[#57534E]'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => changeFormLanguage('ur')}
                        aria-pressed={formLang === 'ur'}
                        className={`rounded-full px-2.5 py-1 font-['Amiri',serif] text-xs font-bold ${
                          formLang === 'ur' ? 'bg-[#FAF7F0] text-[#134E3A] shadow-sm' : 'text-[#57534E]'
                        }`}
                      >
                        اردو
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyFormLink}
                      className={`inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E6C786]/40 bg-[#0E3B2C] px-3.5 py-1.5 font-semibold text-[#FAF7F0] transition-colors hover:border-[#E6C786] hover:bg-[#0A291E] sm:min-h-0 sm:flex-initial ${
                        isUrdu ? 'text-xs leading-relaxed' : 'text-xs'
                      }`}
                    >
                      <span>{copiedLink ? t.copiedBtn : t.shareBtn}</span>
                    </button>

                    <a
                      href={requestFormViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#E6C786] px-3.5 py-1.5 font-bold text-[#134E3A] transition-colors hover:bg-[#F3D999] sm:min-h-0 sm:flex-initial ${
                        isUrdu ? 'text-xs leading-relaxed' : 'text-xs'
                      }`}
                    >
                      <span>{t.newTabBtn}</span>
                      <svg
                        className="h-3.5 w-3.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 3h7m0 0v7m0-7L10 14M5 7v11a1 1 0 001 1h11"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Embedded Google Form Container */}
              <div className="relative bg-white">
                {isFormLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FAF7F0]/90 p-6 text-center sm:p-8">
                    <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#D8CCA8] border-t-[#134E3A]" />
                    <p
                      className={`mt-4 font-semibold text-[#134E3A] ${
                        isUrdu ? 'text-base leading-loose' : "font-['Lora',serif] text-base"
                      }`}
                    >
                      {t.loadingTitle}
                    </p>
                    <p
                      className={`mt-1 text-[#57534E] ${
                        isUrdu ? 'text-xs leading-loose' : 'text-xs'
                      }`}
                    >
                      {t.loadingFallbackPrefix}{' '}
                      <a
                        href={requestFormViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#134E3A] underline"
                      >
                        {t.loadingFallbackLink}
                      </a>
                    </p>
                  </div>
                )}

                <iframe
                  key={formLang}
                  src={requestFormEmbedUrl}
                  title="Get a Quran Request Form"
                  onLoad={() => setIsFormLoading(false)}
                  className="h-[980px] w-full border-0 sm:h-[880px] lg:h-[840px]"
                  loading="lazy"
                >
                  Loading…
                </iframe>
              </div>

              {/* Footer Note inside Form Card */}
              <div
                className={`border-t border-[#F3EDE0] bg-[#FAF7F0] px-4 py-3.5 text-center text-[#78716C] sm:px-6 sm:py-4 ${
                  isUrdu ? 'text-xs leading-loose' : 'text-xs'
                }`}
              >
                {t.formPrivacyNote}
              </div>
            </div>
          </div>
        </div>
        </main>
      )}

      {/* Support the Mission / Sadaqah Jariyah + Integrated Donor Form */}
      {currentPage === 'support-mission' && (
        <section
        id="support-mission"
        className="scroll-mt-16 border-t border-[#E5DEC9] bg-[#F3EDE0]/60 py-12 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            {/* Left Column: Illustration + Sadaqah Jariyah Message */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-3xl border border-[#DFD6BE] bg-[#FAF7F0] shadow-sm">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#134E3A]">
                  <img
                    src={DonateMissionImg}
                    alt={t.donateHeading}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 sm:p-7">
                  <div
                    className={`mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#D8CCA8] bg-[#F3EDE0] px-3.5 py-1.5 font-semibold text-[#8C6828] ${
                      isUrdu
                        ? 'text-xs leading-loose sm:text-sm'
                        : 'text-[11px] uppercase tracking-widest'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-[#134E3A]" />
                    <span>{t.donateBadge}</span>
                  </div>

                  <h2
                    className={`font-bold text-[#134E3A] ${
                      isUrdu
                        ? 'text-xl leading-[2.1] sm:text-2xl sm:leading-[2.1]'
                        : "font-['Lora',serif] text-2xl tracking-tight sm:text-3xl"
                    }`}
                  >
                    {t.donateHeading}
                  </h2>

                  <p
                    className={`mt-3 text-[#44403C] ${
                      isUrdu
                        ? 'text-sm leading-[2.2]'
                        : 'text-xs leading-relaxed sm:text-sm'
                    }`}
                  >
                    {t.donateLead}
                  </p>

                  {/* Hadith Quote Box */}
                  <blockquote className="mt-4 rounded-2xl border-s-4 border-[#B68635] bg-[#F3EDE0]/85 p-3.5 sm:p-4">
                    <p
                      className={`italic text-[#1C1917] ${
                        isUrdu ? 'text-xs leading-[2.1] sm:text-sm' : 'text-xs leading-relaxed'
                      }`}
                    >
                      {t.donateHadith}
                    </p>
                    <footer
                      className={`mt-1.5 font-semibold text-[#8C6828] ${
                        isUrdu ? 'text-xs leading-loose' : 'text-[11px]'
                      }`}
                    >
                      {t.donateHadithRef}
                    </footer>
                  </blockquote>

                  {/* Impact Bullets */}
                  <ul className="mt-4 space-y-2.5">
                    {t.donateHighlights.map((item, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2.5 text-[#57534E] ${
                          isUrdu ? 'text-xs leading-[2.1] sm:text-sm' : 'text-xs sm:text-sm'
                        }`}
                      >
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#134E3A] text-[#E6C786]">
                          <svg
                            className="h-2.5 w-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Mobile / Quick Action Buttons */}
                  <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={scrollToDonorForm}
                      className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#134E3A] px-5 py-2.5 font-semibold text-[#FAF7F0] shadow-sm transition-colors hover:bg-[#0E3B2C] lg:hidden ${
                        isUrdu ? 'text-xs leading-relaxed' : 'text-xs sm:text-sm'
                      }`}
                    >
                      <span>{t.donatePrimaryCta}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareMission}
                      className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-[#B68635] bg-[#F3EDE0] px-5 py-2.5 font-semibold text-[#134E3A] transition-colors hover:bg-[#E5DEC9] ${
                        isUrdu ? 'text-xs leading-relaxed' : 'text-xs sm:text-sm'
                      }`}
                    >
                      <span>{copiedMissionLink ? t.donateSharedMsg : t.donateSecondaryCta}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Integrated Donor Google Form Card */}
            <div ref={donorFormCardRef} className="scroll-mt-20 lg:col-span-7">
              <div
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 ${
                  highlightDonorForm
                    ? 'border-[#134E3A] ring-4 ring-[#134E3A]/15'
                    : 'border-[#E5DEC9]'
                }`}
              >
                {/* Emerald & Gold Header Bar */}
                <div className="border-b border-[#E5DEC9] bg-[#134E3A] px-4 py-4 text-[#FAF7F0] sm:px-8 sm:py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span
                        className={`font-bold text-[#E6C786] ${
                          isUrdu ? 'text-xs leading-loose' : 'text-[11px] uppercase tracking-widest'
                        }`}
                      >
                        {t.donorFormBadge}
                      </span>
                      <h3
                        className={`mt-0.5 font-bold ${
                          isUrdu
                            ? 'text-base leading-loose sm:text-xl'
                            : "font-['Lora',serif] text-lg sm:text-2xl"
                        }`}
                      >
                        {t.donorFormHeading}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        role="group"
                        aria-label={t.donorFormLanguageLabel}
                        dir="ltr"
                        className="inline-flex items-center rounded-full border border-[#D8CCA8] bg-[#F3EDE0] p-0.5"
                      >
                        <button
                          type="button"
                          onClick={() => changeFormLanguage('en')}
                          aria-pressed={formLang === 'en'}
                          className={`rounded-full px-2.5 py-1 font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold ${
                            formLang === 'en' ? 'bg-[#FAF7F0] text-[#134E3A] shadow-sm' : 'text-[#57534E]'
                          }`}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          onClick={() => changeFormLanguage('ur')}
                          aria-pressed={formLang === 'ur'}
                          className={`rounded-full px-2.5 py-1 font-['Amiri',serif] text-xs font-bold ${
                            formLang === 'ur' ? 'bg-[#FAF7F0] text-[#134E3A] shadow-sm' : 'text-[#57534E]'
                          }`}
                        >
                          اردو
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyDonorFormLink}
                        className={`inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E6C786]/40 bg-[#0E3B2C] px-3.5 py-1.5 font-semibold text-[#FAF7F0] transition-colors hover:border-[#E6C786] hover:bg-[#0A291E] sm:min-h-0 sm:flex-initial ${
                          isUrdu ? 'text-xs leading-relaxed' : 'text-xs'
                        }`}
                      >
                        <span>{copiedDonorLink ? t.copiedBtn : t.shareBtn}</span>
                      </button>

                      <a
                        href={donorFormViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#E6C786] px-3.5 py-1.5 font-bold text-[#134E3A] transition-colors hover:bg-[#F3D999] sm:min-h-0 sm:flex-initial ${
                          isUrdu ? 'text-xs leading-relaxed' : 'text-xs'
                        }`}
                      >
                        <span>{t.newTabBtn}</span>
                        <svg
                          className="h-3.5 w-3.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 3h7m0 0v7m0-7L10 14M5 7v11a1 1 0 001 1h11"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Embedded Donor Google Form Container */}
                <div className="relative bg-white">
                  {isDonorFormLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FAF7F0]/90 p-6 text-center sm:p-8">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#D8CCA8] border-t-[#134E3A]" />
                      <p
                        className={`mt-4 font-semibold text-[#134E3A] ${
                          isUrdu ? 'text-base leading-loose' : "font-['Lora',serif] text-base"
                        }`}
                      >
                        {t.donorLoadingTitle}
                      </p>
                      <p
                        className={`mt-1 text-[#57534E] ${
                          isUrdu ? 'text-xs leading-loose' : 'text-xs'
                        }`}
                      >
                        {t.loadingFallbackPrefix}{' '}
                        <a
                          href={donorFormViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#134E3A] underline"
                        >
                          {t.loadingFallbackLink}
                        </a>
                      </p>
                    </div>
                  )}

                  <iframe
                    key={formLang}
                    src={donorFormEmbedUrl}
                    title="Get a Quran Donor Form"
                    onLoad={() => setIsDonorFormLoading(false)}
                    className="h-[1160px] w-full border-0 sm:h-[1110px] lg:h-[1090px]"
                    loading="lazy"
                  >
                    Loading…
                  </iframe>
                </div>

                {/* Footer Note inside Donor Form Card */}
                <div
                  className={`border-t border-[#F3EDE0] bg-[#FAF7F0] px-4 py-3.5 text-center text-[#78716C] sm:px-6 sm:py-4 ${
                    isUrdu ? 'text-xs leading-loose' : 'text-xs'
                  }`}
                >
                  {t.donorFormPrivacyNote}
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* About Us Section */}
      {currentPage === 'about-us' && (
        <section
        id="about-us"
        className="scroll-mt-16 border-t border-[#E5DEC9] bg-gradient-to-b from-[#FAF7F0] to-[#F3EDE0]/80 py-12 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Full Brand Crest Medallion */}
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-2 border-[#B68635]/50 bg-[#F5F3E8] p-1.5 shadow-md sm:h-28 sm:w-28">
              <img
                src={Logo}
                alt={t.brandName}
                className="h-full w-full rounded-2xl object-contain"
              />
            </div>

            <div
              className={`mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8CCA8] bg-[#FAF7F0] px-4 py-1.5 font-semibold text-[#8C6828] ${
                isUrdu ? 'text-sm leading-loose' : 'text-xs uppercase tracking-widest'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B68635]" />
              <span>{t.aboutBadge}</span>
            </div>

            <h2
              className={`font-bold text-[#134E3A] ${
                isUrdu
                  ? 'text-2xl leading-[2.1] sm:text-3xl sm:leading-[2.1]'
                  : "font-['Lora',serif] text-2xl tracking-tight sm:text-4xl"
              }`}
            >
              {t.aboutHeading}
            </h2>

            <p
              className={`mt-4 text-[#44403C] sm:mt-5 ${
                isUrdu
                  ? 'text-sm leading-[2.2] sm:text-lg sm:leading-[2.2]'
                  : 'text-sm leading-relaxed sm:text-lg'
              }`}
            >
              {t.aboutLead}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {t.aboutPillars.map((pillar, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#DFD6BE] bg-[#FAF7F0] p-5 shadow-sm transition-colors hover:border-[#B68635] sm:p-6"
              >
                <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#134E3A] text-[#E6C786] sm:mb-4">
                  {index === 0 && (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  )}
                </div>

                <h3
                  className={`font-bold text-[#1C1917] ${
                    isUrdu ? 'text-base leading-loose' : "font-['Lora',serif] text-base sm:text-lg"
                  }`}
                >
                  {pillar.title}
                </h3>
                <p
                  className={`mt-2 text-[#57534E] ${
                    isUrdu ? 'text-sm leading-[2.1]' : 'text-xs leading-relaxed sm:text-sm'
                  }`}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        </section>
      )}

      {/* Unified Footer */}
      <footer className="border-t border-[#E6C786]/25 bg-[#134E3A] text-[#FAF7F0]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-8 text-center sm:px-6 md:grid-cols-[220px_minmax(0,1fr)_auto] md:text-start lg:px-8 lg:py-10">
          <div className="flex h-20 items-center justify-center bg-transparent md:h-24 lg:justify-start">
            <img
              src={Logo}
              alt={t.brandName}
              className="h-full w-full object-contain object-center lg:object-left"
            />
          </div>

          {currentPage === 'home' ? (
            <div>
              <h2
                className={`font-bold text-[#F3D999] ${
                  isUrdu
                    ? 'text-xl leading-[2.1] sm:text-2xl'
                    : "font-['Lora',serif] text-2xl"
                }`}
              >
                {t.homeCtaHeading}
              </h2>
              <p
                className={`mt-1 text-[#E7E5E4] ${
                  isUrdu ? 'text-sm leading-[2.1]' : 'text-sm'
                }`}
              >
                {t.homeCtaLead}
              </p>
              <p
                className={`mt-3 text-[#E7E5E4] ${
                  isUrdu ? 'text-xs leading-loose' : 'text-xs'
                }`}
              >
                {t.footerNote}
              </p>
            </div>
          ) : (
            <p
              className={`text-[#E7E5E4] ${
                isUrdu ? 'text-sm leading-loose' : 'text-sm'
              }`}
            >
              {t.footerNote}
            </p>
          )}

          {currentPage === 'home' && (
            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
              <button
                type="button"
                onClick={scrollToRequestForm}
                className={`min-h-[46px] w-full rounded-full bg-[#E6C786] px-6 py-3 font-bold text-[#134E3A] transition-colors hover:bg-[#F3D999] sm:w-auto ${
                  isUrdu ? 'text-sm leading-loose' : 'text-sm'
                }`}
              >
                {t.heroPrimaryCta}
              </button>
              <button
                type="button"
                onClick={() => navigateToPage('about-us')}
                className={`min-h-[46px] w-full rounded-full border border-[#E6C786]/70 px-6 py-3 font-semibold text-[#FAF7F0] transition-colors hover:bg-[#0E3B2C] sm:w-auto ${
                  isUrdu ? 'text-sm leading-loose' : 'text-sm'
                }`}
              >
                {t.homeAboutLink}
              </button>
            </div>
          )}
        </div>
      </footer>

    </div>
  );
};

export default GetAQuran;