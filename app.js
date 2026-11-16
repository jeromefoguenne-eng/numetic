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

// 6. Moteur Pictural René Magritte 60 FPS (Tableau peint à l'huile multi-plans : Jour / Crépuscule L'Empire des Lumières / Nuit)
const cinemaStage = document.getElementById('cinema-stage');
const magritteCanvas = document.getElementById('magritte-canvas');
const magritteSkyBg = document.getElementById('magritte-sky-bg');
const cycleBadge = document.getElementById('cycle-phase-badge');
const cycleFill = document.getElementById('cycle-track-fill');
const gainPill = document.getElementById('cinema-gain-pill');
const metricHours = document.getElementById('cinema-metric-hours');
const metricCode = document.getElementById('cinema-metric-code');

if (cinemaStage && magritteCanvas) {
    const ctx = magritteCanvas.getContext('2d', { alpha: true });
    const skyLayerCanvas = document.createElement('canvas');
    skyLayerCanvas.width = 1024;
    skyLayerCanvas.height = 336;
    const skyCtx = skyLayerCanvas.getContext('2d');

    // Préchargement des calques peints à l'huile (esthétique René Magritte identique à l'image de référence)
    const ASSET_KEYS = {
        plateDay: 'images/magritte/plate_day.png',
        plateTwilight: 'images/magritte/plate_twilight.png',
        plateNight: 'images/magritte/plate_night.png',
        skyMask: 'images/magritte/sky_mask.png',
        officeRoomJ1: 'images/magritte/office_room_j1_clean.png',
        officeRoomJ2: 'images/magritte/office_room_clean.png',
        officeTorso: 'images/magritte/office_char_torso.png',
        officeHeadTired: 'images/magritte/office_head_tired.png',
        officeHeadCalm: 'images/magritte/office_head_calm.png',
        officeArmL: 'images/magritte/office_arm_l.png',
        officeClient: 'images/magritte/office_client.png',
        banknoteOil: 'images/magritte/banknote_oil.png',
        codeMonitorJ1: 'images/magritte/code_monitor_j1.png',
        aiTerminal: 'images/magritte/ai_terminal_night.png',
        maisonJ1: 'images/magritte/maison_j1_paperwork.png',
        maisonJ2: 'images/magritte/maison_j2_reading.png',
        maisonEmpty: 'images/magritte/maison_empty_away.png',
        maisonHeadTired: 'images/magritte/maison_head_tired.png',
        maisonHeadCalm: 'images/magritte/maison_head_calm.png',
        maisonMullions: 'images/magritte/maison_mullions_fg.png',
        walkerUpperHat: 'images/magritte/walker_upper_hat.png',
        walkerUpperBare: 'images/magritte/walker_upper_barehead.png',
        walkerLegBack: 'images/magritte/walker_leg_back.png',
        walkerLegFront: 'images/magritte/walker_leg_front.png',
        hatOil: 'images/magritte/hat_oil.png',
        env0: 'images/magritte/env_0.png',
        env1: 'images/magritte/env_1.png',
        env2: 'images/magritte/env_2.png',
        env3: 'images/magritte/env_3.png',
        env4: 'images/magritte/env_4.png',
        env5: 'images/magritte/env_5.png',
        env6: 'images/magritte/env_6.png',
        env7: 'images/magritte/env_7.png'
    };

    const imgs = {};
    const entries = Object.entries(ASSET_KEYS);
    entries.forEach(([key, src], idx) => {
        const im = new Image();
        im.decoding = 'async';
        let retries = 0;
        const loadSrc = () => {
            im.src = `${src}?v=20261116ah${retries ? '&r=' + retries : ''}`;
        };
        im.onerror = () => {
            if (retries < 4) {
                retries++;
                setTimeout(loadSrc, 80 * retries);
            }
        };
        // Échelonnement léger (8ms) pour éviter de saturer un serveur HTTP monothread local
        setTimeout(loadSrc, idx * 8);
        imgs[key] = im;
    });

    const isReady = (im) => im && im.complete && im.naturalWidth > 0;

    // Étoiles fines dans la voûte céleste nocturne
    const STARS = [
        { x: 112, y: 22, r: 1.3, ph: 0.2 },
        { x: 196, y: 38, r: 1.5, ph: 1.1 },
        { x: 268, y: 18, r: 1.2, ph: 2.4 },
        { x: 356, y: 28, r: 1.4, ph: 0.8 },
        { x: 442, y: 15, r: 1.6, ph: 1.9 },
        { x: 534, y: 24, r: 1.2, ph: 3.1 },
        { x: 618, y: 18, r: 1.5, ph: 0.5 },
        { x: 716, y: 32, r: 1.2, ph: 2.0 },
        { x: 848, y: 22, r: 1.5, ph: 1.4 },
        { x: 938, y: 36, r: 1.3, ph: 2.7 },
        { x: 412, y: 66, r: 1.1, ph: 1.6 },
        { x: 568, y: 58, r: 1.2, ph: 0.9 }
    ];

    // Trajectoires organiques des 8 enveloppes et feuilles peintes à l'huile dans la vitrine ENTREPRISE (Jour 1)
    const ENVELOPE_ORBITS = [
        { key: 'env0', bx: 188, by: 432, ax: 14, ay: 10, sp: 1.35, rot: -0.18, ph: 0.0 },
        { key: 'env1', bx: 218, by: 392, ax: 18, ay: 8,  sp: 1.15, rot: 0.14,  ph: 0.9 },
        { key: 'env2', bx: 262, by: 348, ax: 16, ay: 12, sp: 1.45, rot: -0.22, ph: 1.8 },
        { key: 'env3', bx: 326, by: 318, ax: 14, ay: 9,  sp: 1.25, rot: 0.19,  ph: 2.6 },
        { key: 'env4', bx: 394, by: 314, ax: 18, ay: 11, sp: 1.30, rot: -0.16, ph: 3.4 },
        { key: 'env5', bx: 446, by: 356, ax: 15, ay: 12, sp: 1.20, rot: 0.21,  ph: 4.2 },
        { key: 'env6', bx: 496, by: 324, ax: 12, ay: 10, sp: 1.50, rot: -0.15, ph: 5.0 },
        { key: 'env7', bx: 486, by: 396, ax: 16, ay: 9,  sp: 1.10, rot: 0.17,  ph: 5.8 }
    ];

    const TOTAL_MS = 52000;
    const HALF_MS = 26000;
    const startTime = performance.now();
    const STAGES = [
        'stage-t1-office', 'stage-t1-commute', 'stage-t1-homework',
        'stage-t2-office', 'stage-t2-commute', 'stage-t2-read'
    ];

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const tri = (t, a, b, c, d) => {
        if (t <= a || t >= d) return 0;
        if (t < b) return (t - a) / (b - a);
        if (t <= c) return 1;
        return (d - t) / (d - c);
    };

    const computeSkyState = (localSec, isPhase2) => {
        let dawn = 0, day = 0, dusk = 0, night = 0, sunProg = -1, moonProg = -1;

        if (!isPhase2) {
            dawn = tri(localSec, 0, 1.4, 3.2, 6.4);
            day = tri(localSec, 1.0, 3.6, 9.2, 15.6);
            dusk = tri(localSec, 8.0, 11.8, 15.4, 20.2);
            night = clamp01((localSec - 12.0) / 5.8);
            if (localSec < 14.0) sunProg = localSec / 14.0;
            if (localSec >= 12.4) moonProg = (localSec - 12.4) / 13.6;
        } else {
            dawn = tri(localSec, 0, 1.4, 3.2, 6.4);
            day = tri(localSec, 1.0, 3.4, 17.8, 22.6);
            dusk = tri(localSec, 16.4, 19.6, 22.0, 25.2);
            night = clamp01((localSec - 19.8) / 4.8);
            if (localSec < 20.8) sunProg = localSec / 20.8;
            if (localSec >= 19.4) moonProg = (localSec - 19.4) / 6.6;
        }

        const rootStyle = document.documentElement.style;
        const dayFactor = clamp01(day + dawn * 0.48);
        const duskFactor = clamp01(dusk + dawn * 0.55);
        rootStyle.setProperty('--sky-day', dayFactor.toFixed(3));
        rootStyle.setProperty('--sky-dusk', duskFactor.toFixed(3));
        rootStyle.setProperty('--sky-night', night.toFixed(3));

        return { dawn, day, dusk, night, sunProg, moonProg };
    };

    const renderMagritteCanvas = (state) => {
        const {
            nowSec, isPhase2, activeStage, walkProg, showWalker,
            clockMinutes, sky
        } = state;

        if (!isReady(imgs.plateTwilight)) return;

        ctx.save();
        ctx.clearRect(0, 0, 2048, 672);

        // 1. FOND PICTURAL MAGRITTE : Fondu progressif Jour Céruléen <-> Crépuscule L'Empire des Lumières <-> Nuit Étoilée
        ctx.globalAlpha = 1.0;
        ctx.drawImage(imgs.plateTwilight, 0, 0, 2048, 672);

        if (sky.day > 0.01 && isReady(imgs.plateDay)) {
            ctx.globalAlpha = clamp01(sky.day);
            ctx.drawImage(imgs.plateDay, 0, 0, 2048, 672);
        }
        if (sky.night > 0.01 && isReady(imgs.plateNight)) {
            ctx.globalAlpha = clamp01(sky.night);
            ctx.drawImage(imgs.plateNight, 0, 0, 2048, 672);
        }
        ctx.globalAlpha = 1.0;

        // 2. ASTRE SOLAIRE, LUNE & ÉTOILES gérés dans #magritte-sky-bg (directement derrière les planches à ciel transparent, zéro démarcation)

        // 3. VITRINE DE L'ENTREPRISE (x = 156..552, y = 306..520 en 2x)
        const drawAiMonitor = (mx, my, mw, mh, isNightGlow) => {
            if (!isReady(imgs.aiTerminal)) return;
            ctx.save();
            // Halo lumineux IA sur le bureau et le mur (particulièrement visible la nuit quand le bureau est vide)
            const pulse = 0.78 + 0.22 * Math.sin(nowSec * 3.4);
            const gRad = isNightGlow ? 92 : 64;
            const gAlpha = (isNightGlow ? 0.42 : 0.26) * pulse;
            const aiHalo = ctx.createRadialGradient(mx + mw * 0.5, my + mh * 0.42, 4, mx + mw * 0.5, my + mh * 0.42, gRad);
            aiHalo.addColorStop(0, `rgba(52, 211, 153, ${gAlpha.toFixed(3)})`);
            aiHalo.addColorStop(0.55, `rgba(56, 189, 248, ${(gAlpha * 0.45).toFixed(3)})`);
            aiHalo.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = aiHalo;
            ctx.beginPath();
            ctx.arc(mx + mw * 0.5, my + mh * 0.42, gRad, 0, Math.PI * 2);
            ctx.fill();

            ctx.drawImage(imgs.aiTerminal, mx, my, mw, mh);

            // Lignes de workflows IA animées en temps réel sur l'écran (exécution autonome jour & nuit)
            const sx = mx + mw * 0.22;
            const sy = my + mh * 0.22;
            const sw = mw * 0.56;
            const sh = mh * 0.42;
            for (let b = 0; b < 3; b++) {
                const prog = ((nowSec * (0.9 + b * 0.25) + b * 0.33) % 1.0);
                const by = sy + 6 + b * (sh * 0.31);
                ctx.fillStyle = b === 1 ? 'rgba(56, 189, 248, 0.92)' : 'rgba(52, 211, 153, 0.95)';
                ctx.fillRect(sx + 2, by, Math.max(4, (sw - 4) * prog), 3.5);
            }
            // Nœud IA actif pulsant
            const nodeX = sx + sw * (0.2 + 0.6 * ((nowSec * 0.7) % 1.0));
            ctx.fillStyle = '#A7F3D0';
            ctx.beginPath();
            ctx.arc(nodeX, sy + sh * 0.5, 2.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        ctx.save();
        ctx.beginPath();
        ctx.rect(156, 306, 396, 214);
        ctx.clip();

        if (activeStage === 'stage-t1-office' && isReady(imgs.officeRoomJ1) && isReady(imgs.officeTorso)) {
            // Jour 1 : Mouvement réaliste de travail sur ordinateur (fauteuil ancré, frappe naturelle des mains, regard qui alterne écran/dossiers, fatigue visible + chiffres surréalistes)
            ctx.drawImage(imgs.officeRoomJ1, 156, 306, 396, 214);

            // Écran d'ordinateur bien visible sur le bureau affichant du code qui défile rapidement
            if (isReady(imgs.codeMonitorJ1)) {
                const mx = 236, my = 382, mw = 88, mh = 66;
                const stressPulse = 0.24 + 0.08 * Math.sin(nowSec * 3.5);
                const monGlow = ctx.createRadialGradient(mx + mw * 0.5, my + mh * 0.45, 4, mx + mw * 0.5, my + mh * 0.45, 76);
                monGlow.addColorStop(0, `rgba(253, 224, 130, ${stressPulse.toFixed(3)})`);
                monGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
                ctx.fillStyle = monGlow;
                ctx.beginPath();
                ctx.arc(mx + mw * 0.5, my + mh * 0.45, 76, 0, Math.PI * 2);
                ctx.fill();

                ctx.drawImage(imgs.codeMonitorJ1, mx, my, mw, mh);

                // Lignes de code qui défilent sur l'écran de l'ordinateur
                const sx = mx + 16, sy = my + 14, sw = mw - 32, sh = mh - 30;
                ctx.save();
                ctx.beginPath();
                ctx.rect(sx, sy, sw, sh);
                ctx.clip();
                const scrollY = (nowSec * 34) % 12;
                for (let ln = -1; ln < 5; ln++) {
                    const ly = sy + ln * 8 - scrollY;
                    const lw = 18 + ((ln * 17 + 23) % 30);
                    ctx.fillStyle = ln % 2 === 0 ? 'rgba(254, 240, 138, 0.92)' : 'rgba(148, 163, 184, 0.85)';
                    ctx.fillRect(sx + 3, ly, lw, 2.5);
                }
                ctx.restore();
            }

            // Buste ancré sur le fauteuil (zéro balancement irréaliste du siège)
            const breathY = Math.sin(nowSec * 1.9) * 1.0;
            ctx.save();
            ctx.translate(156 + 245, 306 + 198 + breathY);
            ctx.drawImage(imgs.officeTorso, -245, -198, 396, 214);

            // Clavier & deux mains/poignets blancs clairement visibles qui tapent activement en alternance devant l'écran !
            const kbX = 118 - 245;
            const kbY = 126 - 198;
            ctx.fillStyle = '#1E293B';
            ctx.fillRect(kbX, kbY, 46, 7);
            ctx.fillStyle = '#64748B';
            ctx.fillRect(kbX + 3, kbY + 1.5, 40, 2);

            const tapL = Math.abs(Math.sin(nowSec * 11.5));
            const tapR = Math.abs(Math.cos(nowSec * 11.5));
            const slideL = Math.sin(nowSec * 6.5) * 4.5;
            const slideR = Math.cos(nowSec * 7.2) * 4.5;

            // Avant-bras gauche peint à l'huile avec mouvement net de frappe au clavier
            if (isReady(imgs.officeArmL)) {
                ctx.save();
                ctx.translate(114 - 245 + 82, 102 - 198 + 28);
                ctx.rotate(-0.04 + tapL * 0.09);
                ctx.drawImage(imgs.officeArmL, -82 + slideL * 0.5, -28 - tapL * 5.5, 94, 46);
                ctx.restore();
            }

            // Main gauche & manchette blanche bien contrastée qui frappe les touches
            ctx.save();
            ctx.translate(kbX + 14 + slideL, kbY - 2 - tapL * 6.5);
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(-3, -3, 8, 5);
            ctx.fillStyle = '#E2A986';
            ctx.beginPath();
            ctx.ellipse(-5, 1, 5.5, 3.8, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Main droite & manchette blanche en opposition de phase sur le clavier
            ctx.save();
            ctx.translate(kbX + 32 + slideR, kbY - 2 - tapR * 6.5);
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(-3, -3, 8, 5);
            ctx.fillStyle = '#D99E7B';
            ctx.beginPath();
            ctx.ellipse(-5, 1, 5.5, 3.8, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Tête fatiguée ancrée au col : alterne naturellement entre l'écran et les dossiers
            if (isReady(imgs.officeHeadTired)) {
                const glanceCurve = Math.sin(nowSec * 1.25);
                const headTilt = -0.025 + glanceCurve * 0.036;
                const headDrop = Math.max(0, -glanceCurve) * 1.8;
                ctx.save();
                ctx.translate(216 - 245 + 34, 50 - 198 + 46 + headDrop);
                ctx.rotate(headTilt);
                ctx.drawImage(imgs.officeHeadTired, -34, -46, 60, 54);
                ctx.restore();
            }
            ctx.restore();

            // Chiffres & symboles informatiques volant de façon surréaliste (style René Magritte)
            const CODE_SYMBOLS = ['{ }', '01', '</>', ';', 'if()', '0', '1', '=>', '#', 'λ', '101', '()'];
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            CODE_SYMBOLS.forEach((sym, i) => {
                const drift = ((nowSec * (0.18 + (i % 4) * 0.04) + i * 0.11) % 1.0);
                const sx = 188 + ((i * 33) % 270) + Math.sin(nowSec * 1.4 + i * 1.3) * 16;
                const sy = 446 - drift * 125 + Math.cos(nowSec * 1.7 + i) * 7;
                const sAlpha = Math.sin(drift * Math.PI) * 0.88;
                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(Math.sin(nowSec * 1.1 + i) * 0.22);
                ctx.fillStyle = i % 3 === 0 ? `rgba(253, 230, 138, ${sAlpha.toFixed(3)})` : `rgba(226, 238, 252, ${sAlpha.toFixed(3)})`;
                ctx.font = `700 ${14 + (i % 3) * 3}px "Plus Jakarta Sans", monospace`;
                ctx.shadowColor = 'rgba(7, 11, 22, 0.8)';
                ctx.shadowBlur = 4;
                ctx.fillText(sym, 0, 0);
                ctx.restore();
            });
            ctx.restore();
        } else if (activeStage === 'stage-t2-office' && isReady(imgs.officeRoomJ2) && isReady(imgs.officeTorso)) {
            // Jour 2 (Avec Numetic) : Collaboration réaliste à deux autour du bureau pendant que l'ordinateur IA automatise les tâches
            ctx.drawImage(imgs.officeRoomJ2, 156, 306, 396, 214);

            // Collaborateur / Associé assis à gauche : posture engagée, hochement attentif & geste de la main vers l'écran
            if (isReady(imgs.officeClient)) {
                const clientBreath = Math.sin(nowSec * 1.7 + 0.8) * 1.0;
                const clientNod = 0.015 + Math.sin(nowSec * 1.45 + 1.6) * 0.028;
                ctx.save();
                ctx.translate(156 + 64, 306 + 148 + clientBreath);
                ctx.rotate(clientNod);
                ctx.drawImage(imgs.officeClient, -56, -90, 108, 140);

                // Main & poignet blanc de l'associé qui répond par un geste naturel
                const cGest = Math.max(0, Math.sin(nowSec * 2.2 + 2.4));
                ctx.save();
                ctx.translate(28 + cGest * 6, -24 - cGest * 10);
                ctx.rotate(-0.2 - cGest * 0.25);
                ctx.fillStyle = '#1E293B';
                ctx.fillRect(-16, -4, 18, 8);
                ctx.fillStyle = '#F8FAFC';
                ctx.fillRect(0, -3.5, 6, 7);
                ctx.fillStyle = '#DFA783';
                ctx.beginPath();
                ctx.ellipse(9, 0, 5.5, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                ctx.restore();
            }

            // Écran d'ordinateur IA bien visible au centre du bureau automatisant les tâches
            drawAiMonitor(242, 372, 92, 68, false);

            // Notre entrepreneur à droite : buste ancré, parle avec ses mains de façon bien visible et naturelle à son associé !
            const talkBreath = Math.sin(nowSec * 1.8) * 1.0;
            ctx.save();
            ctx.translate(156 + 245, 306 + 198 + talkBreath);
            ctx.drawImage(imgs.officeTorso, -245, -198, 396, 214);

            // Avant-bras gauche pivotant depuis le coude (levé bien en vue dans l'espace libre pour parler avec les mains)
            const talkWave = Math.sin(nowSec * 2.8);
            const liftAmt = (0.5 + 0.5 * talkWave); // 0..1
            if (isReady(imgs.officeArmL)) {
                ctx.save();
                ctx.translate(194 - 245, 118 - 198); // Pivot au coude
                ctx.rotate(0.14 + liftAmt * 0.28); // Lève nettement l'avant-bras vers l'associé
                ctx.drawImage(imgs.officeArmL, -80, -24, 94, 46);
                ctx.restore();
            }

            // Seconde main droite qui accompagne la parole avec un geste ouvert bien visible
            const talkWaveR = Math.sin(nowSec * 2.8 + 0.9);
            const liftR = (0.5 + 0.5 * talkWaveR);
            ctx.save();
            ctx.translate(182 - 245 - liftR * 8, 128 - 198 - liftR * 12);
            ctx.rotate(-0.15 - liftR * 0.22);
            ctx.fillStyle = '#18222F';
            ctx.fillRect(0, -4, 20, 8);
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(-5, -3.5, 6, 7);
            ctx.fillStyle = '#E2A986';
            ctx.beginPath();
            ctx.ellipse(-9, 0, 5.5, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Tête sereine qui hoche naturellement en parlant
            if (isReady(imgs.officeHeadCalm)) {
                const headNod = Math.sin(nowSec * 1.65) * 0.036;
                ctx.save();
                ctx.translate(216 - 245 + 34, 50 - 198 + 46 + Math.sin(nowSec * 1.65) * 1.2);
                ctx.rotate(headNod);
                ctx.drawImage(imgs.officeHeadCalm, -34, -46, 60, 54);
                ctx.restore();
            }
            ctx.restore();

            // Billets peints à l'huile flottant de façon surréaliste dans l'air (style Golconde de Magritte)
            if (isReady(imgs.banknoteOil)) {
                for (let i = 0; i < 6; i++) {
                    const bProg = ((nowSec * (0.14 + (i % 3) * 0.04) + i * 0.17) % 1.0);
                    const bx = 200 + ((i * 48) % 245) + Math.sin(nowSec * 1.3 + i * 1.9) * 14;
                    const by = 450 - bProg * 120 + Math.cos(nowSec * 1.6 + i) * 6;
                    const bAlpha = Math.sin(bProg * Math.PI) * 0.92;
                    ctx.save();
                    ctx.globalAlpha = bAlpha;
                    ctx.translate(bx, by);
                    ctx.rotate(Math.sin(nowSec * 1.2 + i * 1.4) * 0.25);
                    ctx.drawImage(imgs.banknoteOil, -18, -10, 36, 20);
                    ctx.restore();
                }
            }
        } else if (isPhase2) {
            // Jour 2 Soir & Nuit : Il est rentré chez lui, mais l'ordinateur reste allumé et exécute les tâches IA toute la nuit !
            drawAiMonitor(266, 396, 94, 70, true);
        }
        // En Jour 1 Soir/Nuit, sans IA, le bureau reste éteint et vide.
        ctx.restore();

        // Horloge numérique murale dans l'angle supérieur droit de la vitrine ENTREPRISE
        const rounded = Math.floor(clockMinutes / 5) * 5;
        const hh = String(Math.floor(rounded / 60) % 24).padStart(2, '0');
        const mm = String(rounded % 60).padStart(2, '0');
        const clockColor = !isPhase2
            ? (rounded >= 1080 ? '#F87171' : '#FBBF24')
            : (rounded >= 1020 ? '#38BDF8' : '#34D399');

        ctx.save();
        ctx.fillStyle = 'rgba(9, 14, 24, 0.86)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(436, 254, 102, 38, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = clockColor;
        ctx.font = '800 22px "Plus Jakarta Sans", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${hh}:${mm}`, 487, 274);
        ctx.restore();

        // 4. GRANDE FENÊTRE DU SALON DE LA MAISON AGRANDIE (x = 1396..1612, y = 312..544 en 2x, 216x232 bien cadrée dans la façade)
        ctx.save();
        ctx.beginPath();
        ctx.rect(1396, 312, 216, 232);
        ctx.clip();

        if (activeStage === 'stage-t1-homework' && isReady(imgs.maisonJ1)) {
            // Jour 1 Nuit : Il écrit des mails tard le soir à la maison (mouvement de frappe + tête fatiguée + enveloppes surréalistes flottant dans l'air)
            const microWork = Math.sin(nowSec * 9.0) * 1.8;
            ctx.drawImage(imgs.maisonJ1, 1396, 312 + microWork * 0.5, 216, 232);

            // Tête fatiguée qui hoche et s'incline au-dessus de son ordinateur
            if (isReady(imgs.maisonHeadTired)) {
                const mx = 1396 + 103;
                const my = 312 + 76 + Math.sin(nowSec * 2.5) * 2.4;
                ctx.save();
                ctx.translate(mx + 20, my + 34);
                ctx.rotate(Math.sin(nowSec * 2.2) * 0.05);
                ctx.drawImage(imgs.maisonHeadTired, -20, -34, 42, 44);
                ctx.restore();
            }

            // Enveloppes peintes à l'huile flottant dans l'air de façon surréaliste
            for (let i = 0; i < 8; i++) {
                const envIm = imgs[`env${i % 8}`];
                if (!isReady(envIm)) continue;
                const floatProg = ((nowSec * (0.16 + (i % 3) * 0.04) + i * 0.14) % 1.0);
                const fx = 1418 + ((i * 28) % 168) + Math.sin(nowSec * 1.5 + i * 1.4) * 12;
                const fy = 490 - floatProg * 155 + Math.cos(nowSec * 1.3 + i) * 7;
                const fAlpha = Math.sin(floatProg * Math.PI) * 0.92;
                const ew = envIm.naturalWidth * 1.6;
                const eh = envIm.naturalHeight * 1.6;

                ctx.save();
                ctx.globalAlpha = fAlpha;
                ctx.translate(fx, fy);
                ctx.rotate(Math.sin(nowSec * 1.4 + i) * 0.24);
                ctx.drawImage(envIm, -ew / 2, -eh / 2, ew, eh);
                ctx.restore();
            }
        } else if (activeStage === 'stage-t2-read' && isReady(imgs.maisonJ2)) {
            // Jour 2 Soirée : Détendu chez lui en train de lire un livre avec des notes de musique flottant de façon surréaliste !
            const breath = Math.sin(nowSec * 1.6) * 1.6;
            ctx.drawImage(imgs.maisonJ2, 1396, 312 + breath * 0.5, 216, 232);

            if (isReady(imgs.maisonHeadCalm)) {
                const mx = 1396 + 103;
                const my = 312 + 76 + breath * 0.75;
                ctx.save();
                ctx.translate(mx + 20, my + 34);
                ctx.rotate(Math.sin(nowSec * 1.1) * 0.045);
                ctx.drawImage(imgs.maisonHeadCalm, -20, -34, 42, 44);
                ctx.restore();
            }

            // Notes de musique flottant de façon surréaliste dans la lumière dorée du salon
            const NOTES = ['♪', '♫', '♩', '♪', '♬', '♫'];
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            NOTES.forEach((note, i) => {
                const nProg = ((nowSec * (0.17 + (i % 3) * 0.03) + i * 0.18) % 1.0);
                const nx = 1426 + ((i * 32) % 156) + Math.sin(nowSec * 1.5 + i * 1.7) * 11;
                const ny = 495 - nProg * 165;
                const nAlpha = Math.sin(nProg * Math.PI) * 0.92;
                ctx.save();
                ctx.translate(nx, ny);
                ctx.rotate(Math.sin(nowSec * 1.4 + i) * 0.2);
                ctx.fillStyle = `rgba(255, 248, 220, ${nAlpha.toFixed(3)})`;
                ctx.font = `700 ${18 + (i % 2) * 5}px "Georgia", serif`;
                ctx.shadowColor = 'rgba(120, 53, 15, 0.85)';
                ctx.shadowBlur = 5;
                ctx.fillText(note, 0, 0);
                ctx.restore();
            });
            ctx.restore();
        } else if (isReady(imgs.maisonEmpty)) {
            ctx.drawImage(imgs.maisonEmpty, 1396, 312, 216, 232);
        }

        // Croisillons en bois peints au premier plan de la fenêtre agrandie de la Maison
        if (isReady(imgs.maisonMullions)) {
            ctx.drawImage(imgs.maisonMullions, 1396, 312, 216, 232);
        }
        ctx.restore();

        // 5. HALOS VOLUMÉTRIQUES DES RÉVERBÈRES (L'Empire des Lumières : toujours allumés jour et nuit)
        const lampPulse = 0.88 + 0.12 * Math.sin(nowSec * 2.1);
        const lampIntensity = (0.55 + 0.45 * sky.night) * lampPulse;
        [
            { x: 808, y: 344, r: 78 },
            { x: 1304, y: 344, r: 78 },
            { x: 922, y: 456, r: 34 },
            { x: 1182, y: 428, r: 38 }
        ].forEach((l) => {
            const g = ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.r);
            g.addColorStop(0, `rgba(255, 250, 215, ${(0.36 * lampIntensity).toFixed(3)})`);
            g.addColorStop(0.5, `rgba(251, 191, 36, ${(0.14 * lampIntensity).toFixed(3)})`);
            g.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
            ctx.fill();
        });

        // 6. LE PROMENEUR AU CHAPEAU MELON DE MAGRITTE (Marche articulée 60 FPS non sautillante + Jeu du Chapeau Melon)
        if (showWalker && isReady(imgs.walkerUpperHat) && isReady(imgs.walkerLegBack) && isReady(imgs.walkerLegFront)) {
            // Trajet du bâtiment ENTREPRISE (x = 570 en 2x) jusqu'au perron de la MAISON (x = 1520 en 2x)
            const wx = 570 + walkProg * 950;
            const footY = 650; // Niveau exact du trottoir en 2x (ancrage sans flottement)
            const drawW = 148;
            const drawH = 296;

            // Cycle de marche cinématique fluide (zéro rebond sautillant : amplitude verticale limitée à 1.4px en 2x = 0.7px en 1x)
            const strideCycles = isPhase2 ? 4.5 : 5.5;
            const gaitPhase = walkProg * Math.PI * 2 * strideCycles;
            const legAngle = Math.sin(gaitPhase) * 0.22; // Balancement naturel des jambes
            const bodyBob = Math.abs(Math.sin(gaitPhase)) * 1.4;
            const torsoTilt = isPhase2 ? 0.0 : 0.032; // Légère inclinaison fatiguée le Jour 1, port droit le Jour 2

            const topX = wx - drawW / 2;
            const topY = footY - drawH - bodyBob;
            const hipX = wx + 2;
            const hipY = topY + drawH * 0.675;

            ctx.save();

            // Ombre portée douce au sol directement sous les chaussures sur le trottoir humide
            const shGrad = ctx.createRadialGradient(wx, footY - 8, 4, wx, footY - 8, 48);
            shGrad.addColorStop(0, 'rgba(5, 8, 16, 0.68)');
            shGrad.addColorStop(0.65, 'rgba(5, 8, 16, 0.28)');
            shGrad.addColorStop(1, 'rgba(5, 8, 16, 0)');
            ctx.fillStyle = shGrad;
            ctx.beginPath();
            ctx.ellipse(wx, footY - 8, 46, 7.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Jambe arrière articulée autour de la hanche
            ctx.save();
            ctx.translate(hipX - 6, hipY);
            ctx.rotate(legAngle);
            ctx.drawImage(imgs.walkerLegBack, -(hipX - 6 - topX), -(hipY - topY), drawW, drawH);
            ctx.restore();

            // Jambe avant articulée en opposition de phase autour de la hanche
            ctx.save();
            ctx.translate(hipX + 6, hipY);
            ctx.rotate(-legAngle);
            ctx.drawImage(imgs.walkerLegFront, -(hipX + 6 - topX), -(hipY - topY), drawW, drawH);
            ctx.restore();

            // Buste en pardessus de laine sombre, serviette en cuir, parapluie, visage 3/4 peint & Jeu du Chapeau Melon
            ctx.save();
            ctx.translate(hipX, hipY);
            ctx.rotate(torsoTilt + Math.sin(gaitPhase) * 0.012);

            const isPuttingOnHat = walkProg < 0.09;
            const isTakingOffHat = walkProg > 0.91;

            if ((isPuttingOnHat || isTakingOffHat) && isReady(imgs.walkerUpperBare) && isReady(imgs.hatOil)) {
                // On voit sa chevelure et son visage pendant qu'il met ou retire son chapeau melon !
                ctx.drawImage(imgs.walkerUpperBare, -(hipX - topX), -(hipY - topY), drawW, drawH);

                // Trajectoire du chapeau melon entre le porte-manteau et sa tête
                const hatT = isPuttingOnHat
                    ? clamp01(walkProg / 0.09)
                    : clamp01((1.0 - walkProg) / 0.09);
                const smoothT = hatT * hatT * (3 - 2 * hatT);
                const headHatX = -(hipX - topX) + drawW * 0.30;
                const headHatY = -(hipY - topY) + drawH * 0.01;
                const rackOffsetX = isPuttingOnHat ? -38 * (1 - smoothT) : 38 * (1 - smoothT);
                const rackOffsetY = -18 * (1 - smoothT) - Math.sin(smoothT * Math.PI) * 14;
                const hatTilt = (1 - smoothT) * (isPuttingOnHat ? -0.35 : 0.35);

                ctx.save();
                ctx.translate(headHatX + rackOffsetX + 32, headHatY + rackOffsetY + 20);
                ctx.rotate(hatTilt);
                ctx.drawImage(imgs.hatOil, -32, -20, 64, 42);
                ctx.restore();
            } else {
                // Chapeau melon posé sur la tête durant tout le trajet sur le trottoir
                ctx.drawImage(imgs.walkerUpperHat, -(hipX - topX), -(hipY - topY), drawW, drawH);
            }

            ctx.restore();
            ctx.restore();
        }

        ctx.restore();
    };

    const updateTwoPhaseCycle = () => {
        const SPEED_MULT = 1.28;
        const now = performance.now();
        const elapsed = (typeof window.__forcedTimeSec === 'number')
            ? ((window.__forcedTimeSec * 1000) % TOTAL_MS)
            : (((now - startTime) * SPEED_MULT) % TOTAL_MS);
        const pct = (elapsed / TOTAL_MS) * 100;
        const isPhase2 = elapsed >= HALF_MS;
        const localSec = (elapsed % HALF_MS) / 1000;
        const nowSec = (typeof window.__forcedTimeSec === 'number') ? window.__forcedTimeSec : ((now / 1000) * SPEED_MULT);

        cinemaStage.classList.toggle('phase-1', !isPhase2);
        cinemaStage.classList.toggle('phase-2', isPhase2);
        if (cycleFill) cycleFill.style.width = `${Math.max(4, Math.round(pct))}%`;

        let activeStage = 'stage-t1-office';
        let walkProg = 0;
        let showWalker = false;
        let hoursGained = 0;
        let codeLines = 0;
        let clockMinutes = 540;
        let showT2Evening = false;

        if (!isPhase2) {
            // Jour 1 : compteur d'heures à 0h, lignes de code complexe augmentent progressivement de 0 jusqu'à 10 000
            codeLines = Math.round(clamp01(localSec / 22.0) * 100) * 100;
            if (localSec < 10.5) {
                activeStage = 'stage-t1-office';
                clockMinutes = 540 + (localSec / 10.5) * 690; // 09:00 -> 20:30
                if (cycleBadge) cycleBadge.textContent = "⏳ Temps 1/2 • Sans IA : travaille non-stop sur son PC";
            } else if (localSec < 17.5) {
                activeStage = 'stage-t1-commute';
                showWalker = true;
                walkProg = clamp01((localSec - 10.5) / 7.0);
                clockMinutes = 1230 + walkProg * 120; // 20:30 -> 22:30
                if (cycleBadge) cycleBadge.textContent = "🌙 Temps 1/2 • Sans IA : rentre chez lui tard dans le noir";
            } else {
                activeStage = 'stage-t1-homework';
                clockMinutes = 1350 + clamp01((localSec - 17.5) / 8.5) * 60; // 22:30 -> 23:30
                if (cycleBadge) cycleBadge.textContent = "💻 Temps 1/2 • Sans IA : continue à trier ses mails à 23h30";
            }
            if (gainPill) gainPill.textContent = "⏳ 0h gagnée / semaine (Sans IA)";
            if (metricHours) metricHours.textContent = "0h";
            if (metricCode) {
                metricCode.textContent = codeLines.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }
        } else {
            // Jour 2 : d'abord "Avec numetic." (0.2..4.2s), puis Automatisation IA (4.5..7.5s), Collaboration (7.8..10.8s) et Optimisation (11.1..14.2s)
            const autoProg = clamp01((localSec - 4.2) / 10.0);
            codeLines = Math.round((1 - autoProg) * 100) * 100;
            if (localSec < 14.5) {
                activeStage = 'stage-t2-office';
                hoursGained = autoProg * 10.0;
                clockMinutes = 540 + (localSec / 14.5) * 450; // 09:00 -> 16:30
                if (cycleBadge) cycleBadge.textContent = "⚡ Temps 2/2 • Avec NUMETIC : l'IA automatise, il supervise sereinement";
            } else if (localSec < 19.2) {
                activeStage = 'stage-t2-commute';
                showWalker = true;
                hoursGained = 10.0;
                walkProg = clamp01((localSec - 14.5) / 4.7);
                clockMinutes = 990 + walkProg * 30; // 16:30 -> 17:00
                showT2Evening = localSec >= 17.0;
                if (cycleBadge) cycleBadge.textContent = "☀️ Temps 2/2 • Avec NUMETIC : rentre chez lui alors qu'il fait encore clair !";
            } else {
                activeStage = 'stage-t2-read';
                hoursGained = 10.0;
                showT2Evening = true;
                clockMinutes = 1020 + clamp01((localSec - 19.2) / 6.8) * 300; // 17:00 -> 22:00
                if (cycleBadge) cycleBadge.textContent = "📖 Temps 2/2 • Lecture & détente dans son salon chaleureux";
            }
            const formattedHours = `+${hoursGained.toFixed(1)}h`;
            if (gainPill) {
                gainPill.textContent = hoursGained >= 9.95
                    ? "🚀 +10h gagnées / semaine avec NUMETIC"
                    : `⚡ ${formattedHours} gagnées / semaine...`;
            }
            if (metricHours) metricHours.textContent = hoursGained >= 9.95 ? "+10h" : (hoursGained <= 0.05 ? "0h" : formattedHours);
            if (metricCode) {
                metricCode.textContent = codeLines.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }
        }

        STAGES.forEach((cls) => cinemaStage.classList.toggle(cls, cls === activeStage));
        cinemaStage.classList.toggle('stage-t2-evening', showT2Evening);

        // Apparition puis disparition séquentielle des mots-clés en blanc pur (#FFFFFF)
        const setWordVisible = (id, show) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('is-visible', show);
        };
        setWordVisible('mk-j1-mails', !isPhase2 && localSec >= 0.5 && localSec < 5.0);
        setWordVisible('mk-j1-admin', !isPhase2 && localSec >= 5.4 && localSec < 10.0);
        setWordVisible('mk-j1-soir', !isPhase2 && localSec >= 18.0 && localSec < 24.5);

        setWordVisible('mk-j2-center', isPhase2 && localSec >= 0.2 && localSec < 4.2);
        setWordVisible('mk-j2-auto', isPhase2 && localSec >= 4.5 && localSec < 7.5);
        setWordVisible('mk-j2-collab', isPhase2 && localSec >= 7.8 && localSec < 10.8);
        setWordVisible('mk-j2-opti', isPhase2 && localSec >= 11.1 && localSec < 14.2);
        setWordVisible('mk-j2-detente', isPhase2 && localSec >= 19.5 && localSec < 25.0);

        const sky = computeSkyState(localSec, isPhase2);
        renderHeroSkyBackground(nowSec, sky);
        renderMagritteCanvas({
            nowSec,
            isPhase2,
            activeStage,
            walkProg,
            showWalker,
            clockMinutes,
            sky
        });
    };

    const renderHeroSkyBackground = (nowSec, sky) => {
        if (!magritteSkyBg) return;
        const w = magritteSkyBg.clientWidth || window.innerWidth;
        const h = magritteSkyBg.clientHeight || 720;
        if (magritteSkyBg.width !== w || magritteSkyBg.height !== h) {
            magritteSkyBg.width = w;
            magritteSkyBg.height = h;
        }
        const sctx = magritteSkyBg.getContext('2d');
        sctx.clearRect(0, 0, w, h);

        // Mélange exact des palettes du ciel René Magritte : Crépuscule (base), Jour Céruléen (sky.day), Nuit Étoilée (sky.night)
        const lerp = (a, b, t) => a + (b - a) * t;
        const mixRgb = (c1, c2, t) => [
            Math.round(lerp(c1[0], c2[0], t)),
            Math.round(lerp(c1[1], c2[1], t)),
            Math.round(lerp(c1[2], c2[2], t))
        ];

        // Couleurs top -> mid -> bottom prolongées sur toute la hauteur de la page, adaptant leur luminosité au cycle Jour/Crépuscule/Nuit
        let topC = [38, 62, 92];
        let midC = [48, 76, 112];
        let botC = [18, 30, 48];

        const dayTop = [22, 74, 136], dayMid = [38, 98, 166], dayBot = [16, 44, 82];
        const nightTop = [8, 16, 30], nightMid = [13, 25, 46], nightBot = [7, 11, 22];

        if (sky.day > 0.01) {
            const t = clamp01(sky.day);
            topC = mixRgb(topC, dayTop, t);
            midC = mixRgb(midC, dayMid, t);
            botC = mixRgb(botC, dayBot, t);
        }
        if (sky.night > 0.01) {
            const t = clamp01(sky.night);
            topC = mixRgb(topC, nightTop, t);
            midC = mixRgb(midC, nightMid, t);
            botC = mixRgb(botC, nightBot, t);
        }

        const grad = sctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, `rgb(${topC.join(',')})`);
        grad.addColorStop(0.55, `rgb(${midC.join(',')})`);
        grad.addColorStop(1, `rgb(${botC.join(',')})`);
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, w, h);

        // Étoiles fines dans la voûte céleste étendue la nuit et au crépuscule
        const starVis = clamp01(sky.night * 0.92 + sky.dusk * 0.35 + (1 - sky.day) * 0.3);
        if (starVis > 0.05) {
            for (let i = 0; i < 36; i++) {
                const sx = ((i * 197 + 43) % 1000) / 1000 * w;
                const sy = ((i * 113 + 29) % 620) / 1000 * h;
                const tw = 0.55 + 0.45 * Math.sin(nowSec * 2.1 + i * 0.9);
                sctx.fillStyle = `rgba(255, 251, 238, ${(starVis * tw * 0.78).toFixed(3)})`;
                sctx.beginPath();
                sctx.arc(sx, sy, (i % 3 === 0 ? 1.5 : 1.0), 0, Math.PI * 2);
                sctx.fill();
            }
        }

        // Nuages cotonneux sculptés façon René Magritte (sommets blanc crème, base gris-bleu ardoise) montant haut dans le ciel
        const cloudAlpha = 0.24 + 0.56 * sky.day + 0.14 * sky.dusk;
        const drawMagritteCloud = (cx, cy, sc) => {
            sctx.save();
            sctx.translate(cx, cy);
            sctx.scale(sc, sc);
            const cGrad = sctx.createLinearGradient(0, -34, 0, 24);
            cGrad.addColorStop(0, `rgba(255, 253, 249, ${cloudAlpha.toFixed(3)})`);
            cGrad.addColorStop(0.62, `rgba(226, 232, 240, ${(cloudAlpha * 0.92).toFixed(3)})`);
            cGrad.addColorStop(1, `rgba(125, 146, 172, ${(cloudAlpha * 0.85).toFixed(3)})`);
            sctx.fillStyle = cGrad;
            sctx.beginPath();
            sctx.arc(-44, 8, 20, 0, Math.PI * 2);
            sctx.arc(-16, -6, 28, 0, Math.PI * 2);
            sctx.arc(18, -2, 24, 0, Math.PI * 2);
            sctx.arc(46, 9, 17, 0, Math.PI * 2);
            sctx.fill();
            sctx.restore();
        };
        drawMagritteCloud(((nowSec * 6.5 + w * 0.12) % (w + 260)) - 130, h * 0.19, 1.15);
        drawMagritteCloud(((nowSec * 4.8 + w * 0.42) % (w + 260)) - 130, h * 0.34, 1.32);
        drawMagritteCloud(((nowSec * 5.6 + w * 0.72) % (w + 260)) - 130, h * 0.13, 0.95);
        drawMagritteCloud(((nowSec * 6.0 + w * 0.88) % (w + 260)) - 130, h * 0.29, 1.10);

        // Soleil & Croissant de Lune haut dans le ciel au-dessus des toits (trajectoire ample et intégrée au fond)
        if (sky.sunProg >= 0 && sky.sunProg <= 1) {
            const ang = (-64 + sky.sunProg * 128) * (Math.PI / 180);
            const sx = w * 0.5 + Math.sin(ang) * Math.min(w * 0.36, 420);
            const sy = h * 0.31 + (1 - Math.cos(ang)) * (h * 0.18);
            const sunAlpha = clamp01(Math.sin(sky.sunProg * Math.PI) * 1.35);

            const sunGrad = sctx.createRadialGradient(sx, sy, 4, sx, sy, 76);
            sunGrad.addColorStop(0, `rgba(255, 252, 232, ${(0.95 * sunAlpha).toFixed(3)})`);
            sunGrad.addColorStop(0.32, `rgba(253, 224, 115, ${(0.52 * sunAlpha).toFixed(3)})`);
            sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
            sctx.fillStyle = sunGrad;
            sctx.beginPath();
            sctx.arc(sx, sy, 76, 0, Math.PI * 2);
            sctx.fill();

            sctx.fillStyle = `rgba(255, 251, 228, ${sunAlpha.toFixed(3)})`;
            sctx.beginPath();
            sctx.arc(sx, sy, 18, 0, Math.PI * 2);
            sctx.fill();
        }

        if (sky.moonProg >= 0 && sky.moonProg <= 1) {
            const ang = (-56 + sky.moonProg * 112) * (Math.PI / 180);
            const mx = w * 0.5 + Math.sin(ang) * Math.min(w * 0.34, 390);
            const my = h * 0.32 + (1 - Math.cos(ang)) * (h * 0.17);
            const moonAlpha = clamp01(Math.sin(sky.moonProg * Math.PI) * 1.45);

            const moonGrad = sctx.createRadialGradient(mx, my, 3, mx, my, 62);
            moonGrad.addColorStop(0, `rgba(240, 249, 255, ${(0.88 * moonAlpha).toFixed(3)})`);
            moonGrad.addColorStop(0.45, `rgba(147, 197, 253, ${(0.30 * moonAlpha).toFixed(3)})`);
            moonGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
            sctx.fillStyle = moonGrad;
            sctx.beginPath();
            sctx.arc(mx, my, 62, 0, Math.PI * 2);
            sctx.fill();

            const mCanvas = document.createElement('canvas');
            mCanvas.width = 48;
            mCanvas.height = 48;
            const mCtx = mCanvas.getContext('2d');
            mCtx.fillStyle = '#F8FAFC';
            mCtx.beginPath();
            mCtx.arc(24, 24, 15, 0, Math.PI * 2);
            mCtx.fill();
            mCtx.globalCompositeOperation = 'destination-out';
            mCtx.beginPath();
            mCtx.arc(30, 19, 13, 0, Math.PI * 2);
            mCtx.fill();

            sctx.globalAlpha = moonAlpha;
            sctx.drawImage(mCanvas, mx - 24, my - 24);
            sctx.globalAlpha = 1.0;
        }
    };

    updateTwoPhaseCycle();
    const loop = () => {
        updateTwoPhaseCycle();
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}
