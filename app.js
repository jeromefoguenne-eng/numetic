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
        desc: "Des ateliers concrets adaptés à votre secteur (prompting, LLM, synthèse, création de contenu) animés par un formateur agréé et conférencier international.",
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
