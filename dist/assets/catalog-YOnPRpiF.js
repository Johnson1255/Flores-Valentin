import"./theme-bU7hyL3V.js";import"./main-Bs780hrD.js";document.addEventListener("DOMContentLoaded",()=>{const p=document.getElementById("flowers-container"),h=document.getElementById("search-input"),c=document.getElementById("category-filter"),f=document.getElementById("sort-by"),w=document.getElementById("filter-reset"),r=document.getElementById("category-tabs").querySelector("ul"),q=document.getElementById("results-count"),E=document.getElementById("view-grid"),L=document.getElementById("view-list"),g=document.getElementById("pagination");let u=[],n=[],k="grid",i=1;const v=9;let C=new Set;const I=async()=>{try{u=[{id:1,name:"Ramo de Rosas Rojas",description:"Hermoso ramo de 12 rosas rojas, perfecto para expresar amor y pasión.",price:5e4,category:"Rosas",image:"./images/rosas-rojas.jpg",stock:15},{id:2,name:"Tulipanes Coloridos",description:"Arreglo de tulipanes holandeses frescos en variados colores.",price:45e3,category:"Tulipanes",image:"./images/tulipanes.jpg",stock:20},{id:3,name:"Orquídeas Elegantes",description:"Arreglo de orquídeas para ocasiones especiales.",price:75e3,category:"Orquídeas",image:"./images/orquideas.jpg",stock:10},{id:4,name:"Girasoles Radiantes",description:"Ramo de girasoles frescos que alegran cualquier espacio.",price:4e4,category:"Girasoles",image:"./images/flor5.jpg",stock:25},{id:5,name:"Lirios Blancos",description:"Elegantes lirios blancos, símbolo de pureza y elegancia.",price:55e3,category:"Lirios",image:"./images/flor3.jpg",stock:12},{id:6,name:"Rosas Variadas",description:"Ramo mixto de rosas en diferentes colores.",price:6e4,category:"Rosas",image:"./images/flor1.jpg",stock:15}],u.forEach(t=>C.add(t.category)),B(),l()}catch(t){console.error("Error cargando productos:",t),p.innerHTML='<div class="col-12 text-center"><p class="text-danger">Error al cargar los productos. Intente nuevamente.</p></div>'}},B=()=>{c.innerHTML='<option value="">Todas las categorías</option>',C.forEach(t=>{const a=document.createElement("option");a.value=t,a.textContent=t,c.appendChild(a)}),r.innerHTML='<li class="nav-item"><button class="nav-link active" data-category="">Todas</button></li>',C.forEach(t=>{const a=document.createElement("li");a.className="nav-item";const o=document.createElement("button");o.className="nav-link",o.setAttribute("data-category",t),o.textContent=t,a.appendChild(o),r.appendChild(a)}),r.querySelectorAll("button").forEach(t=>{t.addEventListener("click",()=>{r.querySelectorAll("button").forEach(a=>a.classList.remove("active")),t.classList.add("active"),c.value=t.getAttribute("data-category"),l()})})},l=()=>{const t=h.value.toLowerCase(),a=c.value,o=f.value;switch(n=u.filter(e=>{const s=e.name.toLowerCase().includes(t)||e.description.toLowerCase().includes(t),d=a===""||e.category===a;return s&&d}),o){case"name-asc":n.sort((e,s)=>e.name.localeCompare(s.name));break;case"name-desc":n.sort((e,s)=>s.name.localeCompare(e.name));break;case"price-asc":n.sort((e,s)=>e.price-s.price);break;case"price-desc":n.sort((e,s)=>s.price-e.price);break}q.textContent=`Mostrando ${n.length} productos`,i=1,m(),b()},m=()=>{const t=(i-1)*v,a=t+v,o=n.slice(t,a);if(p.innerHTML="",o.length===0){p.innerHTML='<div class="col-12 text-center py-5"><p>No se encontraron productos que coincidan con su búsqueda.</p></div>';return}o.forEach(e=>{const s=document.createElement("div");k==="grid"?(s.className="col-md-4 mb-4",s.innerHTML=`
                    <div class="card h-100 product-card">
                        <img src="${e.image}" class="card-img-top" alt="${e.name}">
                        <div class="card-body">
                            <h5 class="card-title">${e.name}</h5>
                            <p class="card-text">${e.description}</p>
                            <p class="card-text text-primary fw-bold">$${e.price.toLocaleString()}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary btn-sm quick-view" data-id="${e.id}">
                                    <i class="fas fa-eye"></i> Vista Rápida
                                </button>
                                <button class="btn btn-outline-primary btn-sm add-to-cart" data-id="${e.id}">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `):(s.className="col-12 mb-3",s.innerHTML=`
                    <div class="card product-card-list">
                        <div class="row g-0">
                            <div class="col-md-3">
                                <img src="${e.image}" class="img-fluid rounded-start h-100" alt="${e.name}">
                            </div>
                            <div class="col-md-9">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <h5 class="card-title">${e.name}</h5>
                                        <span class="badge bg-primary">$${e.price.toLocaleString()}</span>
                                    </div>
                                    <p class="card-text">${e.description}</p>
                                    <p class="card-text">
                                        <small class="text-muted">
                                            <i class="fas fa-box me-1"></i> ${e.stock} unidades disponibles
                                        </small>
                                    </p>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-primary btn-sm quick-view" data-id="${e.id}">
                                            <i class="fas fa-eye"></i> Vista Rápida
                                        </button>
                                        <button class="btn btn-outline-primary btn-sm add-to-cart" data-id="${e.id}">
                                            <i class="fas fa-shopping-cart"></i> Añadir al Carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `),p.appendChild(s)}),document.querySelectorAll(".quick-view").forEach(e=>{e.addEventListener("click",()=>{const s=parseInt(e.getAttribute("data-id"));T(s)})}),document.querySelectorAll(".add-to-cart").forEach(e=>{e.addEventListener("click",()=>{const s=parseInt(e.getAttribute("data-id"));$(s)})})},b=()=>{if(g.innerHTML="",n.length<=v)return;const t=Math.ceil(n.length/v),a=document.createElement("li");a.className=`page-item ${i===1?"disabled":""}`;const o=document.createElement("button");o.className="page-link",o.innerHTML="&laquo;",o.addEventListener("click",()=>{i>1&&(i--,m(),b())}),a.appendChild(o),g.appendChild(a);for(let d=1;d<=t;d++){const x=document.createElement("li");x.className=`page-item ${i===d?"active":""}`;const y=document.createElement("button");y.className="page-link",y.textContent=d,y.addEventListener("click",()=>{i=d,m(),b()}),x.appendChild(y),g.appendChild(x)}const e=document.createElement("li");e.className=`page-item ${i===t?"disabled":""}`;const s=document.createElement("button");s.className="page-link",s.innerHTML="&raquo;",s.addEventListener("click",()=>{i<t&&(i++,m(),b())}),e.appendChild(s),g.appendChild(e)},T=t=>{const a=u.find(e=>e.id===t);if(!a)return;document.getElementById("quickViewTitle").textContent="Vista Rápida: "+a.name,document.getElementById("quickViewName").textContent=a.name,document.getElementById("quickViewDescription").textContent=a.description,document.getElementById("quickViewCategory").textContent=a.category,document.getElementById("quickViewPrice").textContent="$"+a.price.toLocaleString(),document.getElementById("quickViewStock").textContent=a.stock,document.getElementById("quickViewImage").src=a.image,new bootstrap.Modal(document.getElementById("quickViewModal")).show()},$=t=>{const a=u.find(e=>e.id===t);if(!a)return;console.log(`Producto añadido al carrito: ${a.name}`);const o=document.createElement("div");o.className="position-fixed bottom-0 end-0 p-3",o.style.zIndex="1050",o.innerHTML=`
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Flores San Valentín</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                <i class="fas fa-check-circle text-success me-2"></i>
                ${a.name} ha sido añadido al carrito.
            </div>
        </div>
    `,document.body.appendChild(o),setTimeout(()=>{o.querySelector(".toast").classList.remove("show"),setTimeout(()=>{document.body.removeChild(o)},300)},3e3)};h.addEventListener("input",()=>{l()}),c.addEventListener("change",()=>{r.querySelectorAll("button").forEach(t=>{t.classList.remove("active"),t.getAttribute("data-category")===c.value&&t.classList.add("active")}),c.value===""&&r.querySelector('button[data-category=""]').classList.add("active"),l()}),f.addEventListener("change",()=>{l()}),w.addEventListener("click",()=>{h.value="",c.value="",f.value="name-asc",r.querySelectorAll("button").forEach(t=>{t.classList.remove("active")}),r.querySelector('button[data-category=""]').classList.add("active"),l()}),E.addEventListener("click",()=>{k="grid",E.classList.add("active"),L.classList.remove("active"),m()}),L.addEventListener("click",()=>{k="list",L.classList.add("active"),E.classList.remove("active"),m()});const S=()=>{const t=document.createElement("style");t.textContent=`
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
    `,document.head.appendChild(t)};(()=>{S(),I(),[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function(a){return new bootstrap.Tooltip(a)})})()});z;
