"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const translations = {
  en: {
    home: "Home", shop: "Shop", laptops: "Laptops", desktops: "Desktop PCs", accessories: "Accessories", contact: "Contact",
    callNow: "Call Now", search: "Search products", language: "اردو", heroEyebrow: "Technology providers · Karachi",
    heroTitle: "The right tech, for everything ahead.", heroBody: "Explore trusted laptops, desktop PCs, components and accessories — selected with care by your local technology experts.",
    explore: "Explore the collection", whatsapp: "WhatsApp us", delivery: "Local expertise. Genuine tech.",
    categories: "Find your next upgrade", categoryIntro: "The essentials, thoughtfully selected.", viewAll: "View all", arrivals: "Fresh off the shelf",
    featured: "A few favorites", featuredBody: "Hand-picked gear our customers come back for.", brands: "Brands you know. Support you can trust.",
    why: "Why Delta", whyTitle: "Good technology. Better guidance.", genuine: "Genuine products", genuineBody: "Products sourced with care, from brands you recognize.",
    warranty: "Warranty support", warrantyBody: "Clear warranty information and help when you need it.", fairPrices: "Fair prices", fairBody: "Thoughtful recommendations that respect your budget.",
    expert: "Real people, real support", expertBody: "Talk to our local team before or after your purchase.", years: "Years serving Karachi", customers: "Happy customers", products: "Tech essentials",
    visit: "Let's find your next upgrade.", address: "Visit us in Golden Town, Karachi.", directions: "Get directions", about: "About Delta",
    aboutTitle: "Technology, made a little more personal.", aboutBody: "Delta Computers is your neighborhood technology store in Golden Town, Karachi. We help people choose the right devices and components with straightforward advice and dependable local support.",
    aboutStory: "A local shop built around good advice", aboutStoryBody: "From a first laptop to a desktop upgrade, our team helps you compare what matters: performance, condition, warranty and value. Stop by, call us, or send a message — we're happy to help.",
    trustTitle: "A simpler way to shop for tech", trust1: "Carefully selected products", trust2: "Helpful, human advice", trust3: "Local after-sales support",
    contactTitle: "Talk to a real person.", contactBody: "Tell us what you need. Our team can help you find the right fit.", sendInquiry: "Send an inquiry",
    name: "Your name", phone: "Phone number", message: "How can we help?", send: "Send message", sent: "Thanks — your message is ready. We'll be in touch.",
    shopTitle: "Find your next favorite.", shopBody: "Browse the latest laptops, components and everyday essentials.", filters: "Filters", category: "Category", brand: "Brand", condition: "Condition",
    all: "All", new: "New", used: "Used", refurbished: "Refurbished", minPrice: "Min price", maxPrice: "Max price", inStock: "In stock only", sort: "Sort by",
    newest: "Newest", priceLow: "Price: low to high", priceHigh: "Price: high to low", clear: "Clear filters", results: "products", noResults: "No products match those filters yet.",
    askPrice: "Ask about price", orderWhatsapp: "Order on WhatsApp", specifications: "Specifications", details: "Product details", related: "You may also like",
    stock: "In stock", outStock: "Out of stock", warrantyLabel: "Warranty", demo: "Sample listing", menu: "Open menu", close: "Close menu",
    categoryCount: "Product categories", sampleCount: "Sample listings", productCount: "Catalog products", contactsCount: "Shop contacts", locationCount: "Karachi shop location",
    "laptops": "Laptops", "desktop-pcs": "Desktop PCs", "accessories": "Accessories", "components": "Components", "networking": "Networking",
    "condition-new": "New", "condition-used": "Used", "condition-refurbished": "Refurbished", ready: "Ready for you",
    productDescription: "Selected by Delta Computers. Contact our team for current availability, condition and warranty details.",
    inquiryReceived: "Thanks — your message has been received.",
  },
  ur: {
    home: "ہوم", shop: "شاپ", laptops: "لیپ ٹاپ", desktops: "ڈیسک ٹاپ پی سی", accessories: "لوازمات", contact: "رابطہ",
    callNow: "ابھی کال کریں", search: "پروڈکٹس تلاش کریں", language: "English", heroEyebrow: "ٹیکنالوجی فراہم کنندہ · کراچی",
    heroTitle: "ہر نئے قدم کے لیے، صحیح ٹیکنالوجی۔", heroBody: "قابلِ اعتماد لیپ ٹاپ، ڈیسک ٹاپ، کمپوننٹس اور لوازمات — آپ کے مقامی ٹیک ماہرین کی منتخب کردہ چیزیں۔",
    explore: "کلیکشن دیکھیں", whatsapp: "واٹس ایپ کریں", delivery: "مقامی مہارت۔ اصل ٹیک۔",
    categories: "اپنی اگلی اپ گریڈ منتخب کریں", categoryIntro: "ضروری چیزیں، سوچ سمجھ کر منتخب کی گئیں۔", viewAll: "سب دیکھیں", arrivals: "نئی آمد",
    featured: "پسندیدہ انتخاب", featuredBody: "منتخب ٹیکنالوجی جس کے لیے گاہک دوبارہ آتے ہیں۔", brands: "مانوس برانڈز۔ قابلِ اعتماد مدد۔",
    why: "ڈیلٹا کیوں", whyTitle: "اچھی ٹیکنالوجی۔ بہتر رہنمائی۔", genuine: "اصل پروڈکٹس", genuineBody: "معروف برانڈز کی احتیاط سے منتخب کردہ مصنوعات۔",
    warranty: "وارنٹی سپورٹ", warrantyBody: "واضح وارنٹی معلومات اور ضرورت کے وقت مدد۔", fairPrices: "مناسب قیمتیں", fairBody: "آپ کے بجٹ کے مطابق سوچ سمجھ کر مشورہ۔",
    expert: "حقیقی لوگ، حقیقی مدد", expertBody: "خریداری سے پہلے یا بعد میں ہماری مقامی ٹیم سے بات کریں۔", years: "کراچی میں خدمت کے سال", customers: "خوش گاہک", products: "ٹیک ضروریات",
    visit: "اپنی اگلی اپ گریڈ تلاش کریں۔", address: "گولڈن ٹاؤن، کراچی میں تشریف لائیں۔", directions: "راستہ دیکھیں", about: "ڈیلٹا کے بارے میں",
    aboutTitle: "ٹیکنالوجی، ذرا زیادہ ذاتی انداز میں۔", aboutBody: "ڈیلٹا کمپیوٹرز گولڈن ٹاؤن، کراچی میں آپ کی مقامی ٹیکنالوجی شاپ ہے۔ ہم سادہ مشورے اور قابلِ اعتماد مقامی مدد کے ساتھ درست ڈیوائس اور کمپوننٹ منتخب کرنے میں مدد کرتے ہیں۔",
    aboutStory: "اچھے مشورے کے لیے مقامی شاپ", aboutStoryBody: "پہلے لیپ ٹاپ سے ڈیسک ٹاپ اپ گریڈ تک، ہماری ٹیم کارکردگی، حالت، وارنٹی اور قیمت کا موازنہ کرنے میں مدد دیتی ہے۔ تشریف لائیں، کال کریں یا پیغام بھیجیں۔",
    trustTitle: "ٹیکنالوجی خریدنے کا آسان طریقہ", trust1: "احتیاط سے منتخب کردہ پروڈکٹس", trust2: "مددگار، انسانی مشورہ", trust3: "خریداری کے بعد مقامی مدد",
    contactTitle: "کسی حقیقی شخص سے بات کریں۔", contactBody: "ہمیں بتائیں آپ کو کیا چاہیے۔ ہماری ٹیم درست انتخاب میں مدد کرے گی۔", sendInquiry: "سوال بھیجیں",
    name: "آپ کا نام", phone: "فون نمبر", message: "ہم کیسے مدد کر سکتے ہیں؟", send: "پیغام بھیجیں", sent: "شکریہ — آپ کا پیغام تیار ہے۔ ہم رابطہ کریں گے۔",
    shopTitle: "اپنی اگلی پسندیدہ چیز تلاش کریں۔", shopBody: "لیپ ٹاپ، کمپوننٹس اور روزمرہ کی ضروریات دیکھیں۔", filters: "فلٹرز", category: "کیٹیگری", brand: "برانڈ", condition: "حالت",
    all: "سب", new: "نیا", used: "استعمال شدہ", refurbished: "ریفربشڈ", minPrice: "کم از کم قیمت", maxPrice: "زیادہ سے زیادہ قیمت", inStock: "صرف دستیاب", sort: "ترتیب",
    newest: "نئے پہلے", priceLow: "قیمت: کم سے زیادہ", priceHigh: "قیمت: زیادہ سے کم", clear: "فلٹر ختم کریں", results: "پروڈکٹس", noResults: "ان فلٹرز کے مطابق فی الحال پروڈکٹ نہیں ہے۔",
    askPrice: "قیمت پوچھیں", orderWhatsapp: "واٹس ایپ پر آرڈر", specifications: "خصوصیات", details: "پروڈکٹ کی تفصیل", related: "آپ کو یہ بھی پسند آ سکتے ہیں",
    stock: "دستیاب", outStock: "دستیاب نہیں", warrantyLabel: "وارنٹی", demo: "نمونہ پروڈکٹ", menu: "مینو کھولیں", close: "مینو بند کریں",
    categoryCount: "پروڈکٹ کیٹیگریز", sampleCount: "نمونہ پروڈکٹس", productCount: "کیٹلاگ پروڈکٹس", contactsCount: "دکان کے رابطے", locationCount: "کراچی میں دکان",
    "laptops": "لیپ ٹاپ", "desktop-pcs": "ڈیسک ٹاپ پی سی", "accessories": "لوازمات", "components": "کمپوننٹس", "networking": "نیٹ ورکنگ",
    "condition-new": "نیا", "condition-used": "استعمال شدہ", "condition-refurbished": "ریفربشڈ", ready: "آپ کے لیے تیار",
    productDescription: "ڈیلٹا کمپیوٹرز کی منتخب کردہ چیز۔ دستیابی، حالت اور وارنٹی کی تفصیل کے لیے ہماری ٹیم سے رابطہ کریں۔",
    inquiryReceived: "شکریہ — آپ کا پیغام موصول ہو گیا ہے۔",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("delta-language");
    if (saved === "ur" || saved === "en") setLanguage(saved);
  }, []);

  const value = useMemo(() => ({
    language,
    direction: language === "ur" ? "rtl" : "ltr",
    toggleLanguage() {
      setLanguage((current) => {
        const next = current === "en" ? "ur" : "en";
        window.localStorage.setItem("delta-language", next);
        document.documentElement.lang = next;
        document.documentElement.dir = next === "ur" ? "rtl" : "ltr";
        return next;
      });
    },
    t(key) {
      return translations[language][key] || translations.en[key] || key;
    },
  }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
