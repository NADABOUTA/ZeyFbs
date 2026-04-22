// ── DONNÉES ──
let products = [
    { id: "p1", image: "https://placehold.co/400x300/e8d5b5/5a3e1f?text=Huile+Prestige", title: "Huile d'Olive Prestige", description: "Extra vierge, première pression à froid.", price: 120 },
    { id: "p2", image: "https://placehold.co/400x300/d9c8a7/4a6b3f?text=Domaine+Atlas",   title: "Domaine Atlas Vert",      description: "Bio certifié, goût fruité.",           price: 145 },
    { id: "p3", image: "https://placehold.co/400x300/cbbd9a/3b5e2b?text=Ferme+El+Baraka", title: "Ferme El Baraka",         description: "Tradition familiale.",                price: 135 }
];
let cart = [];
let editingId = null;
let currentPage = 'accueil';


// ── PRODUITS ──

function renderProductsPage() {
    document.getElementById('produitsDynamicContent').innerHTML = `
        <div class="products-header">
            <h2 class="section-title" style="margin:0;">Nos Produits</h2>
            <button class="btn" id="toggleFormBtn" onclick="toggleForm()">+ Ajouter un produit</button>
        </div>
        <div class="form-produit" id="formWrapper" style="display:none;">
            <h3 id="formTitle">Ajouter un produit</h3>
            <div class="form-group">
                <label>Image :</label>
                <input type="file" id="prodImageFile" accept="image/*" onchange="handleUpload(event)" style="width:100%;padding:7px 10px;border:1.5px solid var(--cream2);border-radius:var(--r);background:var(--gold2);cursor:pointer;">
                <input type="hidden" id="prodImage">
                <div class="img-preview-wrap" id="imgPreviewWrap" style="display:none;">
                    <img id="uploadPreview" alt="Apercu">
                    <button type="button" class="btn-remove-img" onclick="removeImage()">x</button>
                </div>
            </div>
            <div class="form-group">
                <label>Nom du produit :</label>
                <input type="text" id="prodTitle" placeholder="Ex: Huile Prestige">
            </div>
            <div class="form-group">
                <label>Description :</label>
                <textarea id="prodDesc" rows="2" placeholder="Description..."></textarea>
            </div>
            <div class="form-group">
                <label>Prix (MAD) :</label>
                <input type="number" id="prodPrice" placeholder="100">
            </div>
            <div class="form-actions">
                <button id="submitBtn" class="btn" onclick="saveProduct()">Ajouter</button>
                <button class="btn btn-cancel" onclick="closeForm()">Annuler</button>
            </div>
        </div>
        <div class="products-grid" id="productsGrid"></div>
    `;
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (!products.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#999;padding:40px;">Aucun produit disponible.</div>';
        return;
    }
    grid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-img" src="${p.image}" alt="${p.title}">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-price">${p.price} MAD</div>
                <div class="product-desc">${p.description}</div>
                <div class="card-actions">
                    <button class="edit-prod"   onclick="editProduct('${p.id}')">Modifier</button>
                    <button class="delete-prod" onclick="deleteProduct('${p.id}')">Supprimer</button>
                    <button class="add-to-cart" onclick="addToCart('${p.id}')">Ajouter</button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function saveProduct() {
    const image = document.getElementById('prodImage').value.trim();
    const title = document.getElementById('prodTitle').value.trim();
    const desc  = document.getElementById('prodDesc').value.trim();
    const price = parseFloat(document.getElementById('prodPrice').value);
    if (!image || !title || !desc || isNaN(price) || price <= 0) return alert('Veuillez remplir tous les champs !');

    if (editingId) {
        const i = products.findIndex(p => p.id === editingId);
        if (i !== -1) products[i] = { ...products[i], image, title, description: desc, price };
    } else {
        products.push({ id: 'p' + Date.now(), image, title, description: desc, price });
    }
    closeForm();
    renderGrid();
}

function editProduct(id) {
    const p = products.find(p => p.id === id);
    if (!p) return;
    editingId = id;
    document.getElementById('prodImage').value = p.image;
    document.getElementById('prodTitle').value = p.title;
    document.getElementById('prodDesc').value  = p.description;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('submitBtn').innerText = 'Modifier';
    document.getElementById('formTitle').innerText = 'Modifier le produit';
    document.getElementById('uploadPreview').src = p.image;
    document.getElementById('imgPreviewWrap').style.display  = 'flex';
    openForm();
}

function deleteProduct(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    products = products.filter(p => p.id !== id);
    cart     = cart.filter(i => i.id !== id);
    updateCartUI();
    renderGrid();
}


// ── FORMULAIRE ──

function toggleForm() {
    const wrapper = document.getElementById('formWrapper');
    const isOpen  = wrapper.style.display !== 'none';
    isOpen ? closeForm() : openForm();
}

function openForm() {
    document.getElementById('formWrapper').style.display    = 'block';
    document.getElementById('toggleFormBtn').textContent    = 'x Fermer';
    document.getElementById('formWrapper').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeForm() {
    document.getElementById('formWrapper').style.display    = 'none';
    document.getElementById('toggleFormBtn').textContent    = '+ Ajouter un produit';
    ['prodImage','prodTitle','prodDesc','prodPrice'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('prodImageFile').value          = '';
    document.getElementById('uploadPreview').src            = '';
    document.getElementById('imgPreviewWrap').style.display = 'none';
    document.getElementById('submitBtn').innerText          = 'Ajouter';
    document.getElementById('formTitle').innerText          = 'Ajouter un produit';
    editingId = null;
}


// ── IMAGE ──

function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('prodImage').value              = e.target.result;
        document.getElementById('uploadPreview').src            = e.target.result;
        document.getElementById('imgPreviewWrap').style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    document.getElementById('prodImage').value              = '';
    document.getElementById('prodImageFile').value          = '';
    document.getElementById('uploadPreview').src            = '';
    document.getElementById('imgPreviewWrap').style.display = 'none';
}

// ── NAVIGATION ──

function showPage(name) {
    ['accueil','produits','contact'].forEach(p => {
        const id = 'page' + p.charAt(0).toUpperCase() + p.slice(1);
        document.getElementById(id).classList.toggle('hidden-page', p !== name);
    });
    if (name === 'produits') renderProductsPage();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === name));
}

function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link =>
        link.addEventListener('click', () => { currentPage = link.dataset.page; showPage(currentPage); })
    );
    document.getElementById('btnVoirProduits')?.addEventListener('click', () => showPage('produits'));
    document.getElementById('btnNosFermes')?.addEventListener('click', () =>
        document.querySelector('.fermes-grid')?.scrollIntoView({ behavior: 'smooth' })
    );
}

function initCartPanel() {
    const panel = document.getElementById('cartPanel');
    document.getElementById('cartIconBtn').addEventListener('click',  () => panel.classList.add('open'));
    document.getElementById('closeCartBtn').addEventListener('click', () => panel.classList.remove('open'));
    window.addEventListener('click', e => { if (e.target === panel) panel.classList.remove('open'); });
}


// ── INIT ──
function init() {
    initNavigation();
    showPage('accueil');
    updateCartUI();
}
init();