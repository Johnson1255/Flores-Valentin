document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos DOM
    const flowersContainer = document.getElementById('flowers-container');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const resetButton = document.getElementById('filter-reset');
    const categoryTabs = document.getElementById('category-tabs').querySelector('ul');
    const resultsCount = document.getElementById('results-count');
    const viewGridBtn = document.getElementById('view-grid');
    const viewListBtn = document.getElementById('view-list');
    const pagination = document.getElementById('pagination');

    // Variables de estado
    let products = []; // Se llenará con datos de la API
    let filteredProducts = [];
    let currentView = 'grid'; // 'grid' o 'list'
    let currentPage = 1;
    const productsPerPage = 9;
    let categories = new Set();

    // Función para cargar productos (simulada - en producción vendría de una API)
    const loadProducts = async () => {
        try {
            // Simulando carga de datos
            // En producción: const response = await fetch('/api/products');
            // const data = await response.json();
            
            // Datos de muestra
            products = [
                {
                    id: 1,
                    name: "Ramo de Rosas Rojas",
                    description: "Hermoso ramo de 12 rosas rojas, perfecto para expresar amor y pasión.",
                    price: 50000,
                    category: "Rosas",
                    image: "./images/rosas-rojas.jpg",
                    stock: 15
                },
                {
                    id: 2,
                    name: "Tulipanes Coloridos",
                    description: "Arreglo de tulipanes holandeses frescos en variados colores.",
                    price: 45000,
                    category: "Tulipanes",
                    image: "./images/tulipanes.jpg",
                    stock: 20
                },
                {
                    id: 3,
                    name: "Orquídeas Elegantes",
                    description: "Arreglo de orquídeas para ocasiones especiales.",
                    price: 75000,
                    category: "Orquídeas",
                    image: "./images/orquideas.jpg",
                    stock: 10
                },
                {
                    id: 4,
                    name: "Girasoles Radiantes",
                    description: "Ramo de girasoles frescos que alegran cualquier espacio.",
                    price: 40000,
                    category: "Girasoles",
                    image: "./images/flor5.jpg",
                    stock: 25
                },
                {
                    id: 5,
                    name: "Lirios Blancos",
                    description: "Elegantes lirios blancos, símbolo de pureza y elegancia.",
                    price: 55000,
                    category: "Lirios",
                    image: "./images/flor3.jpg",
                    stock: 12
                },
                {
                    id: 6,
                    name: "Rosas Variadas",
                    description: "Ramo mixto de rosas en diferentes colores.",
                    price: 60000,
                    category: "Rosas",
                    image: "./images/flor1.jpg",
                    stock: 15
                }
            ];

            // Recopilar categorías únicas
            products.forEach(product => categories.add(product.category));
            
            // Llenar selectores de categoría
            populateCategorySelectors();
            
            // Aplicar filtros iniciales
            applyFilters();
            
        } catch (error) {
            console.error('Error cargando productos:', error);
            flowersContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error al cargar los productos. Intente nuevamente.</p></div>';
        }
    };

    // Función para poblar selectores de categoría
    const populateCategorySelectors = () => {
        // Llenar el selector dropdown
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Llenar las pestañas de categoría
        categoryTabs.innerHTML = '<li class="nav-item"><button class="nav-link active" data-category="">Todas</button></li>';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            const button = document.createElement('button');
            button.className = 'nav-link';
            button.setAttribute('data-category', category);
            button.textContent = category;
            li.appendChild(button);
            categoryTabs.appendChild(li);
        });

        // Agregar event listeners a las pestañas
        categoryTabs.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                categoryTabs.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                categoryFilter.value = button.getAttribute('data-category');
                applyFilters();
            });
        });
    };

    // Función para aplicar filtros
    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const sortOption = sortBy.value;

        // Filtrar productos
        filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                  product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        // Ordenar productos
        switch (sortOption) {
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
        }

        // Actualizar contador de resultados
        resultsCount.textContent = `Mostrando ${filteredProducts.length} productos`;

        // Resetear paginación
        currentPage = 1;
        
        // Renderizar productos
        renderProducts();
        renderPagination();
    };

    // Función para renderizar productos
    const renderProducts = () => {
        // Calcular productos para la página actual
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const currentProducts = filteredProducts.slice(startIndex, endIndex);

        // Limpiar contenedor
        flowersContainer.innerHTML = '';

        if (currentProducts.length === 0) {
            flowersContainer.innerHTML = '<div class="col-12 text-center py-5"><p>No se encontraron productos que coincidan con su búsqueda.</p></div>';
            return;
        }

        // Renderizar cada producto
        currentProducts.forEach(product => {
            const productCard = document.createElement('div');
            
            if (currentView === 'grid') {
                productCard.className = 'col-md-4 mb-4';
                productCard.innerHTML = `
                    <div class="card h-100 product-card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text text-primary fw-bold">$${(product.price).toLocaleString()}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary btn-sm quick-view" data-id="${product.id}">
                                    <i class="fas fa-eye"></i> Vista Rápida
                                </button>
                                <button class="btn btn-outline-primary btn-sm add-to-cart" data-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                productCard.className = 'col-12 mb-3';
                productCard.innerHTML = `
                    <div class="card product-card-list">
                        <div class="row g-0">
                            <div class="col-md-3">
                                <img src="${product.image}" class="img-fluid rounded-start h-100" alt="${product.name}">
                            </div>
                            <div class="col-md-9">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <h5 class="card-title">${product.name}</h5>
                                        <span class="badge bg-primary">$${(product.price).toLocaleString()}</span>
                                    </div>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-text">
                                        <small class="text-muted">
                                            <i class="fas fa-box me-1"></i> ${product.stock} unidades disponibles
                                        </small>
                                    </p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-primary btn-sm quick-view" data-id="${product.id}">
                                            <i class="fas fa-eye"></i> Vista Rápida
                                        </button>
                                        <button class="btn btn-outline-primary btn-sm add-to-cart" data-id="${product.id}">
                                            <i class="fas fa-shopping-cart"></i> Añadir al Carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            flowersContainer.appendChild(productCard);
        });

        // Agregar event listeners a los botones de vista rápida
        document.querySelectorAll('.quick-view').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                showQuickView(productId);
            });
        });

        // Agregar event listeners a los botones de añadir al carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    };

    // Función para renderizar la paginación
    const renderPagination = () => {
        pagination.innerHTML = '';
        
        // Si no hay suficientes productos para paginar
        if (filteredProducts.length <= productsPerPage) {
            return;
        }
        
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        // Botón anterior
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-link';
        prevBtn.innerHTML = '&laquo;';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                renderPagination();
            }
        });
        prevLi.appendChild(prevBtn);
        pagination.appendChild(prevLi);
        
        // Páginas numeradas
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${currentPage === i ? 'active' : ''}`;
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-link';
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
                renderPagination();
            });
            pageLi.appendChild(pageBtn);
            pagination.appendChild(pageLi);
        }
        
        // Botón siguiente
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-link';
        nextBtn.innerHTML = '&raquo;';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                renderPagination();
            }
        });
        nextLi.appendChild(nextBtn);
        pagination.appendChild(nextLi);
    };

    // Función para mostrar vista rápida del producto
    const showQuickView = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        // Llenar modal con datos del producto
        document.getElementById('quickViewTitle').textContent = 'Vista Rápida: ' + product.name;
        document.getElementById('quickViewName').textContent = product.name;
        document.getElementById('quickViewDescription').textContent = product.description;
        document.getElementById('quickViewCategory').textContent = product.category;
        document.getElementById('quickViewPrice').textContent = '$' + (product.price).toLocaleString();
        document.getElementById('quickViewStock').textContent = product.stock;
        document.getElementById('quickViewImage').src = product.image;
        
        // Mostrar modal
        const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
        quickViewModal.show();
    };

// Función para añadir al carrito (simulada)
const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Simulación de añadir al carrito
    console.log(`Producto añadido al carrito: ${product.name}`);
    
    // Aquí iría la lógica real para añadir al carrito
    // Por ejemplo, enviar a una API o guardar en localStorage
    
    // Mostrar un toast de confirmación
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1050';
    toastContainer.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Flores San Valentín</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                <i class="fas fa-check-circle text-success me-2"></i>
                ${product.name} ha sido añadido al carrito.
            </div>
        </div>
    `;
    document.body.appendChild(toastContainer);
    
    // Eliminar el toast después de 3 segundos
    setTimeout(() => {
        toastContainer.querySelector('.toast').classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toastContainer);
        }, 300);
    }, 3000);
};

// Event listeners
searchInput.addEventListener('input', () => {
    applyFilters();
});

categoryFilter.addEventListener('change', () => {
    // Actualizar tabs para reflejar la selección
    categoryTabs.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === categoryFilter.value) {
            btn.classList.add('active');
        }
    });
    
    if (categoryFilter.value === '') {
        categoryTabs.querySelector('button[data-category=""]').classList.add('active');
    }
    
    applyFilters();
});

sortBy.addEventListener('change', () => {
    applyFilters();
});

resetButton.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    sortBy.value = 'name-asc';
    
    // Resetear tabs
    categoryTabs.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
    });
    categoryTabs.querySelector('button[data-category=""]').classList.add('active');
    
    applyFilters();
});

viewGridBtn.addEventListener('click', () => {
    currentView = 'grid';
    viewGridBtn.classList.add('active');
    viewListBtn.classList.remove('active');
    renderProducts();
});

viewListBtn.addEventListener('click', () => {
    currentView = 'list';
    viewListBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    renderProducts();
});

// Agregar CSS personalizado
const addCustomCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
        .product-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .product-card .card-img-top {
            height: 200px;
            object-fit: cover;
        }
        
        .product-card-list .img-fluid {
            object-fit: cover;
            height: 100%;
        }
        
        .category-tabs .nav-link {
            cursor: pointer;
            border-radius: 20px;
            padding: 0.5rem 1rem;
            margin-right: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .category-tabs .nav-link:hover {
            background-color: rgba(var(--bs-primary-rgb), 0.1);
        }
        
        .category-tabs .nav-link.active {
            background-color: var(--bs-primary);
            color: white;
        }
    `;
    document.head.appendChild(style);
};

// Inicializar
const initialize = () => {
    addCustomCSS();
    loadProducts();
    
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
};

initialize();
});z