import{a as f,L as y,i as p,b as g,c as S}from"./theme-DR39Ld0Y.js";document.addEventListener("DOMContentLoaded",()=>{f(),new y,p.updatePageContent();const c=document.querySelector('.tab-button[data-i18n="login"]'),l=document.querySelector('.tab-button[data-i18n="register"]'),a=document.querySelector(".login-form"),e=document.querySelector(".register-form");function m(){const t={},n=window.location.search,s=new URLSearchParams(n);for(const[r,o]of s.entries())t[r]=o;return t}function d(){c.classList.add("active"),l.classList.remove("active"),a.style.display="block",e.style.display="none"}function v(){l.classList.add("active"),c.classList.remove("active"),e.style.display="block",a.style.display="none"}c&&c.addEventListener("click",function(t){t.preventDefault(),d()}),l&&l.addEventListener("click",function(t){t.preventDefault(),v()}),e&&e.addEventListener("submit",async t=>{var o;t.preventDefault();const n=e.querySelector("#password-registro").value,s=e.querySelector("#confirm-password").value;if(n!==s){alert("Las contraseñas no coinciden");return}const r={nombre:e.querySelector("#nombre").value,apellidos:e.querySelector("#apellidos").value,email:e.querySelector("#email-registro").value,telefono:e.querySelector("#telefono").value,pais:e.querySelector("#pais").value,ciudad:e.querySelector("#ciudad").value,barrio:e.querySelector("#barrio").value,direccion:e.querySelector("#direccion").value,codigoPostal:e.querySelector("#codigo-postal").value,password:n,ocasiones:Array.from(e.querySelectorAll('input[name="ocasiones"]:checked')).map(i=>i.value),newsletter:((o=e.querySelector('input[name="newsletter"]'))==null?void 0:o.checked)||!1};try{const{data:i,error:u}=await g(r.email,r.password,r);if(u){alert(`Error en el registro: ${u.message}`);return}alert("Registro exitoso! Por favor, verifica tu correo electrónico para confirmar tu cuenta."),e.reset(),d()}catch(i){console.error("Error durante el registro:",i),alert("Ocurrió un error durante el registro. Por favor, intenta de nuevo.")}}),a&&a.addEventListener("submit",async t=>{t.preventDefault();const n=a.querySelector("#email").value,s=a.querySelector("#password").value;try{const{data:r,error:o}=await S(n,s);if(o){alert(`Error al iniciar sesión: ${o.message}`);return}if(r!=null&&r.user){const u=m().returnUrl||"/index.html";window.location.href=u}}catch(r){console.error("Error durante el inicio de sesión:",r),alert("Ocurrió un error durante el inicio de sesión. Por favor, intenta de nuevo.")}})});
