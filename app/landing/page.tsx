'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './Landing.module.css';

/* ── Custom Icons ── */
function IconLock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function IconAlarm() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8"></circle>
      <path d="M12 9v4l2 2"></path>
      <path d="M5 3L2 6"></path>
      <path d="M19 3l3 3"></path>
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

const TRANSLATIONS = {
  EN: {
    heroTitle: 'Never Miss Prayer Time Again',
    heroSubtitle: 'The only app that physically locks your phone until you scan your prayer mat. Zero escape, maximum discipline.',
    downloadBtn: 'Download Now',
    demoBtn: 'Watch Demo',
    problemLabel: 'The Struggle',
    problemTitle: 'Why Muslims Struggle With Prayer Discipline',
    problem1Title: 'Phone Distractions',
    problem1Text: 'Phone distractions and endless scrolling make you miss Salah or delay it until the last minute.',
    problem2Title: 'No Accountability',
    problem2Text: 'No real accountability system exists to help you stay firm when motivation is low.',
    problem3Title: 'Fading Motivation',
    problem3Text: 'Motivation fades quickly without visible progress tracking and consistent habits.',
    featuresLabel: 'Solutions',
    featuresTitle: 'Built for Spiritual Excellence',
    feature1Title: 'Force Lock',
    feature1Desc: 'Your phone becomes unusable at prayer time. The only way to unlock it is to complete your Salah and scan your mat.',
    feature2Title: 'Fajr Alarm',
    feature2Desc: 'A smart alarm that is impossible to snooze or dismiss. It ensures you\'re up and focused for the most important start of the day.',
    feature3Title: 'Smart Streaks',
    feature3Desc: 'Track your consistency with detailed stats. Watch your spiritual growth through beautiful visualizations and streaks.',
    feature4Title: 'Family Mode',
    feature4Desc: 'Share progress and compete together. Build a stronger bond with your family through shared spiritual goals.',
    howLabel: 'Process',
    howTitle: 'How It Works',
    howStep1: 'Download PrayLock',
    howStep1Desc: 'Install the app and set up your profile.',
    howStep2: 'Set Your Schedule',
    howStep2Desc: 'Configure your prayer times and blocking rules.',
    howStep3: 'Never Miss Salah',
    howStep3Desc: 'Stay disciplined with physical phone locks.',
    testimonialsLabel: 'Community',
    testimonialsTitle: 'Trusted by the Ummah',
    pricingLabel: 'Pricing',
    pricingTitle: 'Invest in Your Deen',
    planFree: 'Free',
    planPremium: 'Premium',
    planFamily: 'Family',
    finalTitle: 'Join 10,000+ Muslims Building Prayer Discipline',
    startTrial: 'Start Free Trial',
  },
  FR: {
    heroTitle: 'Ne manquez plus jamais l\'heure de la prière',
    heroSubtitle: 'La seule application qui verrouille physiquement votre téléphone jusqu\'à ce que vous scanniez votre tapis de prière. Zéro échappatoire, discipline maximale.',
    downloadBtn: 'Télécharger maintenant',
    demoBtn: 'Voir la démo',
    problemLabel: 'La lutte',
    problemTitle: 'Pourquoi les musulmans luttent pour la discipline de la prière',
    problem1Title: 'Distractions téléphoniques',
    problem1Text: 'Les distractions et le défilement infini vous font manquer la Salah ou la retarder à la dernière minute.',
    problem2Title: 'Pas de responsabilité',
    problem2Text: 'Il n\'existe aucun véritable système de responsabilité pour vous aider à rester ferme quand la motivation est basse.',
    problem3Title: 'Motivation déclinante',
    problem3Text: 'La motivation s\'estompe rapidement sans suivi des progrès et habitudes constantes.',
    featuresLabel: 'Solutions',
    featuresTitle: 'Conçu pour l\'excellence spirituelle',
    feature1Title: 'Force Lock',
    feature1Desc: 'Votre téléphone devient inutilisable à l\'heure de la prière. Le seul moyen de le déverrouiller est de scanner votre tapis.',
    feature2Title: 'Alarme Fajr',
    feature2Desc: 'Une alarme intelligente impossible à ignorer. Elle vous assure d\'être debout et concentré pour bien commencer la journée.',
    feature3Title: 'Smart Streaks',
    feature3Desc: 'Suivez votre constance avec des statistiques détaillées. Observez votre croissance spirituelle.',
    feature4Title: 'Family Mode',
    feature4Desc: 'Partagez vos progrès et relevez des défis ensemble. Renforcez les liens spirituels de votre famille.',
    howLabel: 'Processus',
    howTitle: 'Comment ça marche',
    howStep1: 'Télécharger PrayLock',
    howStep1Desc: 'Installez l\'application et configurez votre profil.',
    howStep2: 'Régler vos horaires',
    howStep2Desc: 'Configurez vos heures de prière et vos règles de blocage.',
    howStep3: 'Ne manquez plus la Salah',
    howStep3Desc: 'Restez discipliné avec le verrouillage physique.',
    testimonialsLabel: 'Communauté',
    testimonialsTitle: 'Approuvé par la Ummah',
    pricingLabel: 'Tarifs',
    pricingTitle: 'Investissez dans votre Deen',
    planFree: 'Gratuit',
    planPremium: 'Premium',
    planFamily: 'Famille',
    finalTitle: 'Rejoignez 10 000+ musulmans pour plus de discipline',
    startTrial: 'Essai gratuit',
  },
  AR: {
    heroTitle: 'لا تفوت وقت الصلاة مرة أخرى',
    heroSubtitle: 'التطبيق الوحيد الذي يقفل هاتفك فعلياً حتى تمسح سجادة الصلاة. لا هروب، أقصى درجات الانضباط.',
    downloadBtn: 'تحميل الآن',
    demoBtn: 'مشاهدة العرض',
    problemLabel: 'المعاناة',
    problemTitle: 'لماذا يعاني المسلمون مع الانضباط في الصلاة',
    problem1Title: 'تشتت الهاتف',
    problem1Text: 'تشتت الهاتف والتصفح اللانهائي يجعلك تفوت الصلاة أو تؤخرها.',
    problem2Title: 'غياب المساءلة',
    problem2Text: 'لا يوجد نظام مساءلة حقيقي لمساعدتك على البقاء ثابتاً.',
    problem3Title: 'تلاشي الدافع',
    problem3Text: 'يتلاشى الدافع سريعاً بدون تتبع التقدم والعادات الثابتة.',
    featuresLabel: 'الحلول',
    featuresTitle: 'بني للتميز الروحي',
    feature1Title: 'القفل القسري',
    feature1Desc: 'يصبح هاتفك غير قابل للاستخدام في وقت الصلاة. الطريقة الوحيدة لفتحه هي إكمال صلاتك.',
    feature2Title: 'منبه الفجر',
    feature2Desc: 'منبه ذكي يستحيل تجاهله، يضمن استيقاظك وتركيزك.',
    feature3Title: 'سلاسل النجاح',
    feature3Desc: 'تتبع استمراريتك بإحصائيات مفصلة وشاهد نموك الروحي.',
    feature4Title: 'وضع العائلة',
    feature4Desc: 'شارك تقدمك وتنافس مع عائلتك لبناء روابط روحية أقوى.',
    howLabel: 'العملية',
    howTitle: 'كيف يعمل',
    howStep1: 'تحميل PrayLock',
    howStep1Desc: 'ثبت التطبيق وأنشئ ملفك الشخصي.',
    howStep2: 'ضبط جدولك',
    howStep2Desc: 'اضبط أوقات الصلاة وقواعد القفل الخاصة بك.',
    howStep3: 'لا تفوت الصلاة أبداً',
    howStep3Desc: 'ابق منضبطاً بفضل قفل الهاتف الفعلي.',
    testimonialsLabel: 'المجتمع',
    testimonialsTitle: 'موثوق من الأمة',
    pricingLabel: 'الأسعار',
    pricingTitle: 'استثمر في دينك',
    planFree: 'مجاني',
    planPremium: 'بريميوم',
    planFamily: 'عائلي',
    finalTitle: 'انضم إلى أكثر من 10,000 مسلم لبناء الانضباط في الصلاة',
    startTrial: 'ابدأ التجربة المجانية',
  }
};

export default function LandingPage() {
  const [activeLang, setActiveLang] = useState<'EN' | 'FR' | 'AR'>('EN');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = TRANSLATIONS[activeLang];
  const scrollRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    scrollRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !scrollRefs.current.includes(el)) {
      scrollRefs.current.push(el);
    }
  };

  return (
    <div className={styles.container}>
      {/* ── Navbar ── */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span style={{ fontSize: '24px' }}>🌙</span> PrayLock
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.menuToggle} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={`${styles.hamburger} ${isMenuOpen ? styles.menuActive : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <Link href="#features" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Features</Link>
          <Link href="#pricing" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Pricing</Link>
          <div className={styles.langSwitcher}>
            <span 
              className={activeLang === 'EN' ? styles.langActive : ''} 
              onClick={() => { setActiveLang('EN'); setIsMenuOpen(false); }}
            >EN</span>
            <span 
              className={activeLang === 'FR' ? styles.langActive : ''} 
              onClick={() => { setActiveLang('FR'); setIsMenuOpen(false); }}
            >FR</span>
            <span 
              className={activeLang === 'AR' ? styles.langActive : ''} 
              onClick={() => { setActiveLang('AR'); setIsMenuOpen(false); }}
            >AR</span>
          </div>
          <Link href="/auth/signup" className={styles.primaryBtn} style={{ padding: '8px 20px', fontSize: '14px' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
        <p className={styles.subtitle}>{t.heroSubtitle}</p>
        <div className={styles.heroActions}>
          <Link href="/auth/signup" className={styles.primaryBtn}>{t.downloadBtn}</Link>
          <button className={styles.secondaryBtn}>{t.demoBtn}</button>
        </div>
        <div className={styles.heroPreview}>
          <div className={styles.mockupWrapper}>
            <img 
              src="/dashboard_preview.png" 
              alt="PrayLock Dashboard" 
              className={styles.mockupImg} 
            />
          </div>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section ref={addToRefs} className={`${styles.problemSection} ${styles.animateOnScroll}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>{t.problemLabel}</span>
          <h2 className={styles.sectionTitle}>{t.problemTitle}</h2>
        </div>
        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <div className={styles.problemIcon}>📱</div>
            <h3 className={styles.problemTitle}>{t.problem1Title}</h3>
            <p className={styles.problemText}>{t.problem1Text}</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemIcon}>⚖️</div>
            <h3 className={styles.problemTitle}>{t.problem2Title}</h3>
            <p className={styles.problemText}>{t.problem2Text}</p>
          </div>
          <div className={styles.problemCard}>
            <div className={styles.problemIcon}>📉</div>
            <h3 className={styles.problemTitle}>{t.problem3Title}</h3>
            <p className={styles.problemText}>{t.problem3Text}</p>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" ref={addToRefs} className={`${styles.featuresSection} ${styles.animateOnScroll}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>{t.featuresLabel}</span>
          <h2 className={styles.sectionTitle}>{t.featuresTitle}</h2>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><IconLock /></div>
            <h3 className={styles.featureTitle}>{t.feature1Title}</h3>
            <p className={styles.featureDesc}>{t.feature1Desc}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><IconAlarm /></div>
            <h3 className={styles.featureTitle}>{t.feature2Title}</h3>
            <p className={styles.featureDesc}>{t.feature2Desc}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><IconChart /></div>
            <h3 className={styles.featureTitle}>{t.feature3Title}</h3>
            <p className={styles.featureDesc}>{t.feature3Desc}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><IconUsers /></div>
            <h3 className={styles.featureTitle}>{t.feature4Title}</h3>
            <p className={styles.featureDesc}>{t.feature4Desc}</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section ref={addToRefs} className={`${styles.howSection} ${styles.animateOnScroll}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>{t.howLabel}</span>
          <h2 className={styles.sectionTitle}>{t.howTitle}</h2>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>{t.howStep1}</h3>
            <p className={styles.stepDesc}>{t.howStep1Desc}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>{t.howStep2}</h3>
            <p className={styles.stepDesc}>{t.howStep2Desc}</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>{t.howStep3}</h3>
            <p className={styles.stepDesc}>{t.howStep3Desc}</p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section ref={addToRefs} className={`${styles.testimonialSection} ${styles.animateOnScroll}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>{t.testimonialsLabel}</span>
          <h2 className={styles.sectionTitle}>{t.testimonialsTitle}</h2>
        </div>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.quote}>"Since using PrayLock, I haven't missed a single Fajr. The force lock is exactly what I needed to break my scrolling habit."</p>
            <div className={styles.author}>
              <div className={styles.authorAvatar}>A</div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Aminata</span>
                <span className={styles.authorLoc}>Dakar, Senegal</span>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.quote}>"The family mode changed how we pray together. My kids are now excited to complete their streaks and compete with me."</p>
            <div className={styles.author}>
              <div className={styles.authorAvatar}>I</div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Ibrahim</span>
                <span className={styles.authorLoc}>Abidjan, Ivory Coast</span>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.quote}>"I tried many apps, but this is the only one that provides real accountability. The stats keep me motivated every day."</p>
            <div className={styles.author}>
              <div className={styles.authorAvatar}>K</div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Khadija</span>
                <span className={styles.authorLoc}>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" ref={addToRefs} className={`${styles.pricingSection} ${styles.animateOnScroll}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>{t.pricingLabel}</span>
          <h2 className={styles.sectionTitle}>{t.pricingTitle}</h2>
        </div>
        <div className={styles.pricingGrid}>
          <div className={styles.priceCard}>
            <span className={styles.planName}>{t.planFree}</span>
            <div className={styles.planPrice}>$0<span>/mo</span></div>
            <ul className={styles.planFeatures}>
              <li className={styles.planFeature}><IconCheck /> 1 User</li>
              <li className={styles.planFeature}><IconCheck /> Basic Stats</li>
              <li className={styles.planFeature}><IconCheck /> 5 Locks per Month</li>
            </ul>
            <Link href="/auth/signup" className={styles.priceBtn} style={{ textAlign: 'center' }}>Get Started</Link>
          </div>
          <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
            <div className={styles.featuredBadge}>Most Popular</div>
            <span className={styles.planName}>{t.planPremium}</span>
            <div className={styles.planPrice}>$4.99<span>/mo</span></div>
            <ul className={styles.planFeatures}>
              <li className={styles.planFeature}><IconCheck /> Unlimited Locks</li>
              <li className={styles.planFeature}><IconCheck /> Advanced Stats</li>
              <li className={styles.planFeature}><IconCheck /> Priority Support</li>
              <li className={styles.planFeature}><IconCheck /> Customizable Alarms</li>
            </ul>
            <Link href="/auth/signup" className={`${styles.priceBtn} ${styles.priceBtnActive}`} style={{ textAlign: 'center' }}>{t.startTrial}</Link>
          </div>
          <div className={styles.priceCard}>
            <span className={styles.planName}>{t.planFamily}</span>
            <div className={styles.planPrice}>$9.99<span>/mo</span></div>
            <ul className={styles.planFeatures}>
              <li className={styles.planFeature}><IconCheck /> Up to 5 Users</li>
              <li className={styles.planFeature}><IconCheck /> Shared Streaks</li>
              <li className={styles.planFeature}><IconCheck /> Family Leaderboard</li>
              <li className={styles.planFeature}><IconCheck /> Managed Profiles</li>
            </ul>
            <Link href="/auth/signup" className={styles.priceBtn} style={{ textAlign: 'center' }}>Join Now</Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section ref={addToRefs} className={`${styles.hero} ${styles.finalCtaSection} ${styles.animateOnScroll}`}>
        <h2 className={`${styles.sectionTitle} ${styles.finalTitle}`}>{t.finalTitle}</h2>
        <Link href="/auth/signup" className={styles.primaryBtn} style={{ padding: '20px 48px', fontSize: '18px' }}>{t.startTrial}</Link>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>🌙 PrayLock</div>
            <p className={styles.footerDesc}>The world's most disciplined prayer companion. Helping the Ummah stay firm in their Salah.</p>
          </div>
          <div>
            <h4 className={styles.footerTitle}>Features</h4>
            <div className={styles.footerLinks}>
              <Link href="#" className={styles.footerLink}>Force Lock</Link>
              <Link href="#" className={styles.footerLink}>Fajr Alarm</Link>
              <Link href="#" className={styles.footerLink}>Streaks</Link>
            </div>
          </div>
          <div>
            <h4 className={styles.footerTitle}>Company</h4>
            <div className={styles.footerLinks}>
              <Link href="#" className={styles.footerLink}>About Us</Link>
              <Link href="#" className={styles.footerLink}>Support</Link>
              <Link href="#" className={styles.footerLink}>Privacy</Link>
            </div>
          </div>
          <div>
            <h4 className={styles.footerTitle}>Connect</h4>
            <div className={styles.footerLinks}>
              <Link href="#" className={styles.footerLink}>Twitter</Link>
              <Link href="#" className={styles.footerLink}>Instagram</Link>
              <Link href="#" className={styles.footerLink}>Contact</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 PrayLock. All rights reserved.</p>
          <p>Made with ❤️ for the Ummah</p>
        </div>
      </footer>
    </div>
  );
}
