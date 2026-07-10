
console.log("NUMETIC site initialized successfully.");
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        const subject = encodeURIComponent(`[NUMETIC] Demande d'audit d'automatisation — ${name}`);
        const body = encodeURIComponent(
            `Bonjour Jérôme,\n\n` +
            `Une nouvelle demande d'audit d'automatisation a été soumise depuis le site vitrine NUMETIC :\n\n` +
            `• Nom du contact : ${name}\n` +
            `• Adresse e-mail : ${email}\n` +
            `• Description des processus répétitifs à optimiser :\n` +
            `"${message}"\n\n` +
            `---\n` +
            `Ce message a été généré par le site vitrine NUMETIC.`
        );
        const mailtoUrl = `mailto:numetic.liege@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
        alert("Votre application de messagerie va s'ouvrir pour envoyer le message de demande d'audit à Jérôme (numetic.liege@gmail.com). Merci !");
    });
}