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

// 6. Animation générative en boucle du flux automatisé dans le Hero
const workflowNodes = document.querySelectorAll('#hero-workflow .node-box');
const workflowConns = document.querySelectorAll('#hero-workflow .flow-connector');
const workflowBar = document.getElementById('workflow-live-bar');
const workflowLabel = document.getElementById('workflow-live-label');
const workflowProgress = document.getElementById('workflow-progress');

if (workflowNodes.length === 3 && workflowLabel && workflowBar) {
    let loopTimer = null;

    const renderWorkflowStage = (stage) => {
        workflowNodes.forEach((node, idx) => {
            node.classList.toggle('is-generated', idx <= stage);
            node.classList.toggle('is-active', idx === stage);
        });
        workflowConns.forEach((conn, idx) => {
            conn.classList.toggle('is-visible', idx < stage);
            conn.classList.toggle('is-active', idx === stage - 1 || (stage === 2 && idx === 1));
        });

        const activeNode = workflowNodes[stage];
        const theme = activeNode.dataset.theme || 'blue';
        workflowBar.classList.remove('theme-blue', 'theme-violet', 'theme-emerald');
        workflowBar.classList.add(`theme-${theme}`);
        if (workflowProgress) {
            workflowProgress.style.width = `${Math.round(((stage + 1) / 3) * 100)}%`;
        }
        const label = activeNode.dataset.label;
        if (label) workflowLabel.textContent = label;
    };

    const runWorkflowCycle = () => {
        workflowNodes.forEach((n) => n.classList.remove('is-generated', 'is-active'));
        workflowConns.forEach((c) => c.classList.remove('is-visible', 'is-active'));
        workflowBar.classList.remove('theme-violet', 'theme-emerald');
        workflowBar.classList.add('theme-blue');
        if (workflowProgress) workflowProgress.style.width = '10%';
        workflowLabel.textContent = "Nouveau flux entrant détecté...";

        setTimeout(() => renderWorkflowStage(0), 320);
        setTimeout(() => {
            workflowConns[0].classList.add('is-visible', 'is-active');
            if (workflowProgress) workflowProgress.style.width = '50%';
        }, 1250);
        setTimeout(() => renderWorkflowStage(1), 1900);
        setTimeout(() => {
            workflowConns[1].classList.add('is-visible', 'is-active');
            if (workflowProgress) workflowProgress.style.width = '85%';
        }, 3100);
        setTimeout(() => renderWorkflowStage(2), 3750);
    };

    workflowNodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
            if (loopTimer) clearInterval(loopTimer);
            renderWorkflowStage(idx);
            if (!prefersReduced) {
                loopTimer = setInterval(runWorkflowCycle, 6200);
            }
        });
    });

    if (prefersReduced) {
        renderWorkflowStage(2);
    } else {
        renderWorkflowStage(0);
        setTimeout(() => {
            workflowConns[0].classList.add('is-visible', 'is-active');
            if (workflowProgress) workflowProgress.style.width = '50%';
        }, 1050);
        setTimeout(() => renderWorkflowStage(1), 1650);
        setTimeout(() => {
            workflowConns[1].classList.add('is-visible', 'is-active');
            if (workflowProgress) workflowProgress.style.width = '85%';
        }, 2850);
        setTimeout(() => renderWorkflowStage(2), 3500);
        loopTimer = setInterval(runWorkflowCycle, 6200);
    }
}
