
let products = [
    { id: "p1", image: "https://placehold.co/400x300/e8d5b5/5a3e1f?text=Huile+Prestige", title: "Huile d'Olive Prestige", description: "Extra vierge, première pression à froid.", price: 120 },
    { id: "p2", image: "https://placehold.co/400x300/d9c8a7/4a6b3f?text=Domaine+Atlas",   title: "Huile 2",      description: "Bio certifié, goût fruité.",           price: 145 },
    { id: "p3", image: "https://placehold.co/400x300/cbbd9a/3b5e2b?text=Ferme+El+Baraka", title: "Huile 3",         description: "Tradition familiale.",                price: 135 }
];

let cart            = [];
let editingProductId = null; 
let currentPage     = 'accueil';



// PRODUITS

function renderProductsPage() {
    document.getElementById('produitsDynamicContent').innerHTML = `
        <h2 class="section-title">Nos Produits</h2>
        <div class="products-grid" id="productsGrid"></div>

        <div class="form-produit">
            <h3 id="formTitle">Ajouter un produit</h3>
            <form id="productForm">
                <div class="form-group">
                    <label>Image URL :</label>
                    <input type="text" id="prodImage" placeholder="https://placehold.co/400x300/...">
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
                <button type="submit"  id="submitProductBtn" class="btn">Ajouter</button>
                <button type="button" id="resetFormBtn"      class="btn-outline btn">Annuler</button>
            </form>
        </div>
    `;

    renderProductsGrid();
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('resetFormBtn').addEventListener('click', resetProductForm);
}

/* ---  des cartes produits --- */
function renderProductsGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(prod => `
        <div class="product-card">
            <img class="product-img" src="${prod.image}" alt="${prod.title}">
            <div class="product-info">
                <div class="product-title">${prod.title}</div>
                <div class="product-price">${prod.price} MAD</div>
                <div class="product-desc">${prod.description}</div>
                <div class="card-actions">
                    <button class="edit-prod"   data-id="${prod.id}">✏️ Modifier</button>
                    <button class="delete-prod" data-id="${prod.id}">🗑️ Supprimer</button>
                    <button class="add-to-cart" data-id="${prod.id}">🛒 Ajouter</button>
                </div>
            </div>
        </div>
    `).join('');

    //les événements 
    grid.querySelectorAll('.edit-prod').forEach(btn =>
        btn.addEventListener('click', () => editProduct(btn.dataset.id)));
    grid.querySelectorAll('.delete-prod').forEach(btn =>
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id)));
    grid.querySelectorAll('.add-to-cart').forEach(btn =>
        btn.addEventListener('click', () => addToCart(btn.dataset.id)));
}