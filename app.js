console.log("NUMETIC site initialized successfully.");

// 1. Menu mobile / tablette
const menuToggle = document.getElementById('mobile-menu-toggle');
const mobileDrawer = document.getElementById('mobile-nav-drawer');

if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
        const isOpen = !mobileDrawer.hasAttribute('hidden');
        if (isOpen) {
            mobileDrawer.setAttribute('hidden', '');
            menuToggle.setAttribute('aria-expanded', 'false');
        } else {
            mobileDrawer.removeAttribute('hidden');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            mobileDrawer.setAttribute('hidden', '');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// 2. Sélecteur Double Parcours (PME vs Formations)
const parcoursModes = {
    pme: {
        tag: "Parcours Entreprise • Clé en main",
        title: "Supprimez les saisies manuelles et gagnez des heures chaque semaine.",
        desc: "Nous connectons vos outils existants (boîte mail, devis, facturation, CRM) grâce au No-Code pour éliminer les tâches répétitives sans perturber votre organisation.",
        cta: "Demander mon audit PME gratuit",
        items: [
            "<strong>1. Diagnostic 30 min :</strong> repérage des tâches les plus chronophages.",
            "<strong>2. Déploiement No-Code :</strong> automatisations visuelles fiables et documentées.",
            "<strong>3. Sobriété énergétique :</strong> choix de modèles IA légers et économiques."
        ]
    },
    formation: {
        tag: "Parcours Équipes • Pédagogie pratique",
        title: "Rendez vos collaborateurs autonomes sur l'IA générative utile.",
        desc: "Des ateliers concrets adaptés à votre secteur (prompting, LLM, synthèse, création de contenu) animés par un formateur agréé, technopédagogue et chercheur en numérique et IA.",
        cta: "Planifier une formation sur-mesure",
        items: [
            "<strong>1. Programme adapté :</strong> cas d'usage réels issus de votre métier.",
            "<strong>2. Zéro prérequis technique :</strong> approche claire et progressive.",
            "<strong>3. Cadre éthique &amp; sobre :</strong> confidentialité des données et bonnes pratiques."
        ]
    }
};

const toggleBtns = document.querySelectorAll('.toggle-btn');
toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const mode = parcoursModes[btn.dataset.mode];
        if (!mode) return;
        toggleBtns.forEach((b) => {
            const active = b === btn;
            b.classList.toggle('active', active);
            b.setAttribute('aria-selected', String(active));
        });
        document.getElementById('p-tag').textContent = mode.tag;
        document.getElementById('p-title').textContent = mode.title;
        document.getElementById('p-desc').textContent = mode.desc;
        document.getElementById('p-cta').querySelector('span').textContent = mode.cta;
        document.getElementById('p-list').innerHTML = mode.items.map((item) => `<li>${item}</li>`).join('');
    });
});

// 3. Effets Parallax doux (désactivés si prefers-reduced-motion)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
    const parallaxEls = document.querySelectorAll('[data-speed]');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
            const speed = parseFloat(el.dataset.speed);
            el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        });
    }, { passive: true });

    const widget = document.querySelector('[data-mouse-parallax]');
    if (widget && window.innerWidth >= 1024) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 12;
            const y = (e.clientY / window.innerHeight - 0.5) * 12;
            widget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }, { passive: true });
    }
}

// 4. Révélation progressive au défilement
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// 5. Formulaire sans pop-up alert() avec envoi direct FormSubmit + fallback mailto
const contactForm = document.getElementById('contact-form');
const feedbackBox = document.getElementById('form-feedback');

if (contactForm && feedbackBox) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const goal = document.getElementById('contact-goal').value;
        const message = document.getElementById('contact-message').value.trim();

        feedbackBox.hidden = false;
        feedbackBox.classList.remove('error');

        if (!name || !email || !message) {
            feedbackBox.classList.add('error');
            feedbackBox.textContent = "Merci de remplir votre nom, votre e-mail et votre message.";
            return;
        }

        const submitBtn = document.getElementById('contact-submit');
        submitBtn.disabled = true;
        feedbackBox.textContent = "Envoi de votre demande d'audit en cours...";

        try {
            const res = await fetch("https://formsubmit.co/ajax/numetic.liege@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    _subject: `[NUMETIC] ${goal} — ${name}`,
                    priorite: goal,
                    message
                })
            });
            if (!res.ok) throw new Error("HTTP " + res.status);
            feedbackBox.textContent = "Merci ! Votre demande d'audit a bien été transmise à Jérôme. Réponse rapide sous 24h ouvrables.";
            contactForm.reset();
        } catch {
            const subject = encodeURIComponent(`[NUMETIC] ${goal} — ${name}`);
            const body = encodeURIComponent(`Nom : ${name}\nE-mail : ${email}\nPriorité : ${goal}\n\nMessage :\n${message}`);
            feedbackBox.innerHTML = `Envoi direct indisponible pour le moment — <a href="mailto:numetic.liege@gmail.com?subject=${subject}&body=${body}" style="text-decoration:underline;color:#fff;">cliquez ici pour ouvrir votre messagerie</a> ou appelez le 0485 83 65 79.`;
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// 6. Synchronisation du cycle BD 2 Temps (24s : Temps 1 Sans IA -> Temps 2 Avec NUMETIC +6.0h/sem)
const cinemaStage = document.getElementById('cinema-stage');
const cycleBadge = document.getElementById('cycle-phase-badge');
const cycleFill = document.getElementById('cycle-track-fill');
const gainPill = document.getElementById('cinema-gain-pill');
const metricHours = document.getElementById('cinema-metric-hours');
const skyDawn = document.getElementById('sky-dawn');
const skyDay = document.getElementById('sky-day');
const skyDusk = document.getElementById('sky-dusk');
const starsLayer = document.getElementById('stars-layer');
const sunOrb = document.getElementById('sun-orb');
const moonOrb = document.getElementById('moon-orb');
const bdWalker = document.getElementById('bd-walker');
const lampHalos = document.querySelectorAll('.night-lamp-halo');

if (cinemaStage && cycleBadge && cycleFill) {
    const TOTAL_MS = 24000;
    const HALF_MS = 12000;
    const startTime = performance.now();
    const STAGES = [
        'stage-t1-office', 'stage-t1-commute', 'stage-t1-homework',
        'stage-t2-office', 'stage-t2-commute', 'stage-t2-family', 'stage-t2-sofa'
    ];

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const tri = (t, a, b, c, d) => {
        if (t <= a || t >= d) return 0;
        if (t < b) return (t - a) / (b - a);
        if (t <= c) return 1;
        return (d - t) / (d - c);
    };

    const setSkyState = (localSec, isPhase2) => {
        // Temps 1 : jour (0..4.4s) -> crépuscule (4.4..6.0s) -> nuit noire (6.0..12.0s)
        // Temps 2 : aube->jour (0..4.5s) -> plein jour trajet (4.5..7.2s) -> fin d'aprem dorée (7.2..9.6s) -> soirée/nuit cosy (9.6..12.0s)
        let dawn = 0, day = 0, dusk = 0, night = 0, sunProg = -1, moonProg = -1;

        if (!isPhase2) {
            dawn = tri(localSec, 0, 0.4, 0.9, 1.8);
            day = tri(localSec, 0.5, 1.4, 4.0, 5.2);
            dusk = tri(localSec, 4.0, 4.9, 5.6, 6.6);
            night = clamp01((localSec - 5.2) / 1.2);
            if (localSec < 5.6) sunProg = localSec / 5.6;
            if (localSec >= 5.4) moonProg = (localSec - 5.4) / 6.6;
        } else {
            dawn = tri(localSec, 0, 0.4, 0.9, 1.8);
            day = tri(localSec, 0.5, 1.3, 6.9, 8.2);
            dusk = tri(localSec, 6.9, 7.9, 9.2, 10.4);
            night = clamp01((localSec - 9.2) / 1.2);
            if (localSec < 8.6) sunProg = localSec / 8.6;
            if (localSec >= 9.0) moonProg = (localSec - 9.0) / 3.0;
        }

        if (skyDawn) skyDawn.setAttribute('opacity', dawn.toFixed(2));
        if (skyDay) skyDay.setAttribute('opacity', day.toFixed(2));
        if (skyDusk) skyDusk.setAttribute('opacity', dusk.toFixed(2));
        if (starsLayer) starsLayer.setAttribute('opacity', (night * 0.95).toFixed(2));
        lampHalos.forEach((el) => el.setAttribute('opacity', clamp01(night + dusk * 0.35).toFixed(2)));

        // Synchronise la luminosité de tout l'arrière-plan du site avec le cycle Jour / Nuit
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--sky-day', clamp01(day + dawn * 0.45).toFixed(3));
        rootStyle.setProperty('--sky-dusk', clamp01(dusk + dawn * 0.55).toFixed(3));
        rootStyle.setProperty('--sky-night', night.toFixed(3));

        if (sunOrb) {
            if (sunProg >= 0 && sunProg <= 1) {
                const angle = (-70 + sunProg * 140) * (Math.PI / 180);
                const x = Math.sin(angle) * 260;
                const y = 260 - Math.cos(angle) * 260;
                sunOrb.setAttribute('opacity', clamp01(Math.sin(sunProg * Math.PI) * 1.35).toFixed(2));
                sunOrb.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
            } else {
                sunOrb.setAttribute('opacity', '0');
            }
        }
        if (moonOrb) {
            if (moonProg >= 0 && moonProg <= 1) {
                const angle = (-58 + moonProg * 116) * (Math.PI / 180);
                const x = Math.sin(angle) * 230;
                const y = 240 - Math.cos(angle) * 240;
                moonOrb.setAttribute('opacity', clamp01(Math.sin(moonProg * Math.PI) * 1.5).toFixed(2));
                moonOrb.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
            } else {
                moonOrb.setAttribute('opacity', '0');
            }
        }
    };

    const updateTwoPhaseCycle = () => {
        const elapsed = (performance.now() - startTime) % TOTAL_MS;
        const pct = (elapsed / TOTAL_MS) * 100;
        const isPhase2 = elapsed >= HALF_MS;
        const localSec = (elapsed % HALF_MS) / 1000;

        cinemaStage.classList.toggle('phase-1', !isPhase2);
        cinemaStage.classList.toggle('phase-2', isPhase2);
        cycleFill.style.width = `${Math.max(4, Math.round(pct))}%`;

        let activeStage = 'stage-t1-office';
        let walkX = 290;
        let showWalker = false;
        let hoursGained = 0;

        if (!isPhase2) {
            if (localSec < 4.5) {
                activeStage = 'stage-t1-office';
                cycleBadge.textContent = "⏳ Temps 1/2 • Sans IA : travaille non-stop sur son PC";
            } else if (localSec < 8.2) {
                activeStage = 'stage-t1-commute';
                showWalker = true;
                const walkProg = clamp01((localSec - 4.5) / 3.7);
                walkX = 290 + walkProg * 365;
                cycleBadge.textContent = "🌙 Temps 1/2 • Sans IA : rentre chez lui tard dans le noir";
            } else {
                activeStage = 'stage-t1-homework';
                cycleBadge.textContent = "💻 Temps 1/2 • Sans IA : continue à trier ses mails à 23h30";
            }
            if (gainPill) gainPill.textContent = "⏳ +0.0h gagnées / semaine (Sans IA)";
            if (metricHours) metricHours.textContent = "+0h";
        } else {
            if (localSec < 4.5) {
                activeStage = 'stage-t2-office';
                hoursGained = clamp01(localSec / 4.2) * 6.0;
                cycleBadge.textContent = "⚡ Temps 2/2 • Avec NUMETIC : l'IA code, il échange avec ses clients";
            } else if (localSec < 7.2) {
                activeStage = 'stage-t2-commute';
                showWalker = true;
                hoursGained = 6.0;
                const walkProg = clamp01((localSec - 4.5) / 2.7);
                walkX = 290 + walkProg * 365;
                cycleBadge.textContent = "☀️ Temps 2/2 • Avec NUMETIC : rentre chez lui alors qu'il fait encore clair !";
            } else if (localSec < 9.6) {
                activeStage = 'stage-t2-family';
                hoursGained = 6.0;
                cycleBadge.textContent = "👨‍👩‍👦 Temps 2/2 • Avec NUMETIC : profite de sa famille";
            } else {
                activeStage = 'stage-t2-sofa';
                hoursGained = 6.0;
                cycleBadge.textContent = "🛋️ Temps 2/2 • Soirée paisible sur son canapé";
            }
            const formattedHours = `+${hoursGained.toFixed(1)}h`;
            if (gainPill) {
                gainPill.textContent = hoursGained >= 5.95
                    ? "🚀 +6.0h gagnées / semaine avec NUMETIC"
                    : `⚡ ${formattedHours} gagnées / semaine...`;
            }
            if (metricHours) metricHours.textContent = hoursGained >= 5.95 ? "+6h" : formattedHours;
        }

        STAGES.forEach((cls) => cinemaStage.classList.toggle(cls, cls === activeStage));
        if (bdWalker) {
            bdWalker.setAttribute('opacity', showWalker ? '1' : '0');
            bdWalker.setAttribute('transform', `translate(${walkX.toFixed(1)} 0)`);
        }
        setSkyState(localSec, isPhase2);
    };

    updateTwoPhaseCycle();
    if (!prefersReduced) {
        const loop = () => {
            updateTwoPhaseCycle();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    } else {
        cinemaStage.classList.remove('phase-1', ...STAGES);
        cinemaStage.classList.add('phase-2', 'stage-t2-family');
        cycleBadge.textContent = "🚀 Avec NUMETIC • +6.0h gagnées / semaine";
        if (gainPill) gainPill.textContent = "🚀 +6.0h gagnées / semaine avec NUMETIC";
    }
}
