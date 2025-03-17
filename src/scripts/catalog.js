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
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const authContainer = document.getElementById('auth-container');
    const catalogContainer = document.getElementById('catalog-container');
    
    // Variables de estado
    let products = []; // Se llenará con datos de la API
    let filteredProducts = [];
    let currentView = localStorage.getItem('viewMode') || 'grid'; // 'grid' o 'list'
    let currentPage = 1;
    const productsPerPage = 12;
    let categories = new Set();
    let isAuthenticated = false;

    // Verificar autenticación
    const checkAuth = () => {
        // Verificamos si hay un token en localStorage (simulando autenticación)
        const token = localStorage.getItem('authToken');
        if (token) {
            isAuthenticated = true;
            showCatalog();
        } else {
            showLoginForm();
        }
    };

    // Mostrar formulario de login
    const showLoginForm = () => {
        if (authContainer && catalogContainer) {
            authContainer.style.display = 'block';
            catalogContainer.style.display = 'none';
        }
    };

    // Mostrar catálogo (solo para usuarios autenticados)
    const showCatalog = () => {
        if (authContainer && catalogContainer) {
            authContainer.style.display = 'none';
            catalogContainer.style.display = 'block';
            
            // Cargar productos
            loadProducts();
        }
    };

    // Manejar login
    const handleLogin = (e) => {
        if (e) e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simulación de autenticación - en producción esto sería una llamada a API
        if (username && password) {
            // Guardar token en localStorage
            localStorage.setItem('authToken', 'simulated-auth-token');
            isAuthenticated = true;
            
            // Mostrar catálogo
            showCatalog();
        } else {
            alert('Por favor, ingresa un nombre de usuario y contraseña válidos.');
        }
    };

    // Manejar logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        isAuthenticated = false;
        showLoginForm();
    };

    // Función para cargar productos (en producción vendría de una API)
    const loadProducts = async () => {
        try {
            // En producción, esta sería una llamada a la API para obtener los productos de Supabase
            // const response = await fetch('/api/products');
            // const data = await response.json();
            
            // Para la demostración, generamos 100 productos de muestra
            products = generateSampleProducts(100);
            
            // Recopilar categorías únicas
            products.forEach(product => categories.add(product.category));
            
            // Llenar selectores de categoría
            populateCategorySelectors();
            
            // Aplicar filtros iniciales
            applyFilters();
            
            // Configurar la vista (grid o list)
            if (currentView === 'list') {
                currentView = 'list';
                viewListBtn.classList.add('active');
                viewGridBtn.classList.remove('active');
            } else {
                currentView = 'grid';
                viewGridBtn.classList.add('active');
                viewListBtn.classList.remove('active');
            }
            
            renderProducts();
            
        } catch (error) {
            console.error('Error cargando productos:', error);
            flowersContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error al cargar los productos. Intente nuevamente.</p></div>';
        }
    };

    // Generar productos de muestra para la demostración
    const generateSampleProducts = (count) => {
        const sampleProducts = [];
        const categories = ['Rosas', 'Tulipanes', 'Orquídeas', 'Girasoles', 'Lirios', 'Claveles', 'Margaritas', 'Crisantemos'];
        const imageUrls = [
            './images/rosas-rojas.jpg', 
            './images/tulipanes.jpg', 
            './images/orquideas.jpg', 
            './images/flor5.jpg', 
            './images/flor3.jpg', 
            './images/flor1.jpg'
        ];
        
        const descriptions = [
            "Hermoso arreglo perfecto para expresar amor y pasión.",
            "Frescas flores importadas en variados colores vibrantes.",
            "Elegante arreglo para ocasiones especiales y celebraciones.",
            "Flores radiantes que alegran cualquier espacio del hogar.",
            "Símbolo de pureza y elegancia, ideales como regalo.",
            "Arreglo mixto con diferentes colores para toda ocasión."
        ];
        
        for (let i = 1; i <= count; i++) {
            const categoryIndex = Math.floor(Math.random() * categories.length);
            const imageIndex = Math.floor(Math.random() * imageUrls.length);
            const descIndex = Math.floor(Math.random() * descriptions.length);
            
            sampleProducts.push({
                id: i,
                name: `${categories[categoryIndex]} ${i <= 20 ? "Premium" : "Clásicas"} ${i}`,
                description: descriptions[descIndex],
                price: Math.floor(Math.random() * 50000) + 20000,
                category: categories[categoryIndex],
                image: imageUrls[imageIndex],
                stock: Math.floor(Math.random() * 30) + 5
            });
        }
        
        return sampleProducts;
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
                            <p class="card-text text-muted mb-2">
                                <span class="badge bg-light text-dark">${product.category}</span>
                            </p>
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
                                    <p class="card-text text-muted mb-2">
                                        <span class="badge bg-light text-dark">${product.category}</span>
                                    </p>
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

    // Event listeners para los filtros
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
        localStorage.setItem('viewMode', 'grid');
        viewGridBtn.classList.add('active');
        viewListBtn.classList.remove('active');
        renderProducts();
    });

    viewListBtn.addEventListener('click', () => {
        currentView = 'list';
        localStorage.setItem('viewMode', 'list');
        viewListBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
        renderProducts();
    });

    // Event listeners para login/logout
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Agregar CSS personalizado
    const addCustomCSS = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para el formulario de login */
            .login-container {
                max-width: 400px;
                margin: 100px auto;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                background-color: #fff;
            }
            
            /* Estilos para el catálogo */
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
            
            /* Estilos para el header de usuario autenticado */
            .user-header {
                background-color: #f8f9fa;
                padding: 10px 0;
                border-bottom: 1px solid #e9ecef;
            }
            
            .user-header .btn-logout {
                border-radius: 20px;
                padding: 0.25rem 0.75rem;
            }
        `;
        document.head.appendChild(style);
    };

    // Inicializar
    const initialize = () => {
        addCustomCSS();
        checkAuth();
        
        // Inicializar tooltips de Bootstrap
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    };

    initialize();
});