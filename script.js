const contactForm = document.getElementById('contact-form');
const preview = document.getElementById('preview');
const downloadButton = document.getElementById('download');
const copyButton = document.getElementById('copy');
const filenameInput = document.getElementById('filename');
const contactCountElement = document.getElementById('contactCount');

let contacts = [];

// Ajoute un nouveau champ pour saisir un contact
function addContactField() {
    const contactIndex = contacts.length;
    const div = document.createElement('div');
    div.id = `contact-${contactIndex}`;
    div.classList.add('contact-entry');
    div.innerHTML = `
        <label>Entrez pour Contact ${contactIndex + 1}</label><br>
        <div class="input-group">
            <span class="icon">👤</span>
            <input type="text" id="name-${contactIndex}" placeholder="Nom et prénom" required>
        </div>
        <div class="input-group">
            <span class="icon">📞</span>
            <input type="number" id="number-${contactIndex}" placeholder="Numéro" required>
        </div>
        <div class="input-group">
            <span class="icon">✉️</span>
            <input type="email" id="email-${contactIndex}" placeholder="Email (facultatif)">
        </div>
        <div class="input-group">
            <span class="icon">🏠</span>
            <input type="text" id="address-${contactIndex}" placeholder="Adresse (facultatif)">
        </div>
        <div class="input-group">
            <span class="icon">🏢</span>
            <input type="text" id="organization-${contactIndex}" placeholder="Organisation (facultatif)">
        </div>
        <div class="input-group">
            <span class="icon">💼</span>
            <input type="text" id="jobTitle-${contactIndex}" placeholder="Titre professionnel (facultatif)">
        </div>
        <div class="input-group">
            <span class="icon">🌐</span>
            <input type="url" id="website-${contactIndex}" placeholder="Site web (facultatif)">
        </div>
        <br>
        <button class="button add-button">Ajouter</button>
    `;
    contactForm.appendChild(div);

    const submitButton = div.querySelector('.add-button');
    submitButton.addEventListener('click', () => {
        const name = document.getElementById(`name-${contactIndex}`).value.trim();
        const number = document.getElementById(`number-${contactIndex}`).value.trim();
        const email = document.getElementById(`email-${contactIndex}`).value.trim();
        const address = document.getElementById(`address-${contactIndex}`).value.trim();
        const organization = document.getElementById(`organization-${contactIndex}`).value.trim();
        const jobTitle = document.getElementById(`jobTitle-${contactIndex}`).value.trim();
        const website = document.getElementById(`website-${contactIndex}`).value.trim();

        if (name && number) {
            contacts.push({ name, number, email, address, organization, jobTitle, website });
            updatePreview();
            contactForm.removeChild(div);
            addContactField();
        } else {
            alert('Veuillez saisir au moins un nom et un numéro.');
        }
    });
}


// Génèrer le contenu vCard pour tous les contacts
function generateVCard() {
    let vCard = '';
    contacts.forEach(contact => {
        let contactData = `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.name}\nTEL;TYPE=CELL:${contact.number}`;
        if (contact.email) contactData += `\nEMAIL;TYPE=INTERNET:${contact.email}`;
        if (contact.address) contactData += `\nADR:${contact.address}`;
        if (contact.organization) contactData += `\nORG:${contact.organization}`;
        if (contact.jobTitle) contactData += `\nTITLE:${contact.jobTitle}`;
        if (contact.website) contactData += `\nURL:${contact.website}`;
        contactData += `\nEND:VCARD\n\n`;
        vCard += contactData;
    });
    return vCard;
}

// Met à jour l'aperçu des vCards
function updatePreview() {
    preview.textContent = generateVCard();
    contactCountElement.textContent = `${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`;
}

const openFileButton = document.getElementById('openFile');
const fileInput = document.getElementById('fileInput');

// Empêche le téléchargement si l'aperçu est vide
downloadButton.addEventListener('click', () => {
if (!contacts.length) {
alert('L\'aperçu est vide. Veuillez ajouter au moins un contact avant de télécharger.');
return;
}
const vCardText = generateVCard();
const filename = filenameInput.value || 'contacts';
const blob = new Blob([vCardText], { type: 'text/vcard' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${filename}.vcf`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
});

// Ouvre un fichier .vcf et affiche un aperçu automatique
openFileButton.addEventListener('click', () => {
fileInput.click();
});

fileInput.addEventListener('change', (event) => {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (e) => {
    const content = e.target.result;
    parseVCard(content);
};
reader.readAsText(file);
}
});

// Parse le contenu d'un fichier vCard et met à jour les contacts
function parseVCard(vCardText) {
const vCards = vCardText.split('END:VCARD').filter(v => v.trim());
contacts = vCards.map(vCard => {
const nameMatch = vCard.match(/FN:(.+)/);
const numberMatch = vCard.match(/TEL;[^:]*:(.+)/);
const emailMatch = vCard.match(/EMAIL;[^:]*:(.+)/);
const addressMatch = vCard.match(/ADR:(.+)/);
const organizationMatch = vCard.match(/ORG:(.+)/);
const jobTitleMatch = vCard.match(/TITLE:(.+)/);
const websiteMatch = vCard.match(/URL:(.+)/);

return {
    name: nameMatch ? nameMatch[1].trim() : '',
    number: numberMatch ? numberMatch[1].trim() : '',
    email: emailMatch ? emailMatch[1].trim() : '',
    address: addressMatch ? addressMatch[1].trim() : '',
    organization: organizationMatch ? organizationMatch[1].trim() : '',
    jobTitle: jobTitleMatch ? jobTitleMatch[1].trim() : '',
    website: websiteMatch ? websiteMatch[1].trim() : ''
};
});
updatePreview();
}

 // Copie du contenu vCard dans le presse-papiers
 copyButton.addEventListener('click', async () => {
    const vCardText = generateVCard(); 
    if (vCardText ==='') {
        alert('Le contenu vcard est vide')
    } else{
    try {
        await navigator.clipboard.writeText(vCardText);
        copyButton.innerHTML = '<span>✅ Copié!</span>';
        setTimeout(() => {
            copyButton.innerHTML = '<span>📋 Copier</span>';
        }, 2000);
    } catch (err) {
        console.error('Erreur lors de la copie :', err);
    }
}

});

// Initialise le formulaire avec un champ de contact
addContactField();