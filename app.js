const ADMIN_PIN = "1234";
let products = JSON.parse(localStorage.getItem("a1_products") || "[]");

const grid = document.getElementById("productsGrid");
const adminFab = document.getElementById("adminFab");
const loginModal = document.getElementById("loginModal");
const dashboardModal = document.getElementById("dashboardModal");
const productFormModal = document.getElementById("productFormModal");
const adminTable = document.querySelector("#adminTable tbody");
const productForm = document.getElementById("productForm");
const productFormTitle = document.getElementById("productFormTitle");

function openModal(id){ document.getElementById(id).classList.add("show"); }
function closeModal(id){ document.getElementById(id).classList.remove("show"); }

function saveProducts(){ localStorage.setItem("a1_products", JSON.stringify(products)); }

function renderProducts(){
grid.innerHTML = "";
products.forEach(p=>{
const card=document.createElement("div");
card.className="card";
if(!p.available) card.style.opacity=0.5;
card.innerHTML=`
<img src="${p.img || 'https://via.placeholder.com/300x200'}" alt="${p.title}">
<h3>${p.title}</h3>
<p>${p.subtitle || ""}</p>
<div class="price">${p.price} ر.س</div>
<div><small>${p.category}</small></div>
`;
grid.appendChild(card);
});
}

function renderAdminTable(){
adminTable.innerHTML="";
products.forEach((p,i)=>{
const row=document.createElement("tr");
row.innerHTML=`
<td><img src="${p.img || 'https://via.placeholder.com/50'}" style="width:50px;height:50px;object-fit:cover;"></td>
<td>${p.title}</td>
<td>${p.price} ر.س</td>
<td>${p.category}</td>
<td>${p.available ? "✅" : "❌"}</td>
<td>
<button class="btn ghost" onclick="editProduct(${i})">✏️</button>
<button class="btn danger" onclick="deleteProduct(${i})">🗑️</button>
<button class="btn primary" onclick="toggleProduct(${i})">${p.available ? "إيقاف" : "تشغيل"}</button>
</td>
`;
adminTable.appendChild(row);
});
}

function toggleProduct(i){
products[i].available=!products[i].available;
saveProducts(); renderProducts(); renderAdminTable();
}
function deleteProduct(i){
if(confirm("متأكد تبغى تحذف المنتج؟")){
products.splice(i,1);
saveProducts(); renderProducts(); renderAdminTable();
}
}
function editProduct(i){
const p=products[i];
productFormTitle.textContent="تعديل منتج";
productForm.title.value=p.title;
productForm.subtitle.value=p.subtitle;
productForm.price.value=p.price;
productForm.img.value=p.img;
productForm.category.value=p.category;
productForm.id.value=i;
openModal('productFormModal');
}

// زر الإدارة
adminFab.onclick=()=>openModal('loginModal');

// تسجيل دخول
document.getElementById("loginAdminBtn").onclick=()=>{
const pin=document.getElementById("adminPin").value.trim();
if(pin===ADMIN_PIN){
closeModal('loginModal');
renderAdminTable();
openModal('dashboardModal');
}else{
alert("PIN غير صحيح");
}
};

// إضافة منتج
document.getElementById("addProductBtn").onclick=()=>{
productForm.reset();
productFormTitle.textContent="إضافة منتج";
openModal('productFormModal');
};

// حفظ منتج
productForm.onsubmit=(e)=>{
e.preventDefault();
const data=Object.fromEntries(new FormData(productForm).entries());
const newProduct={
title:data.title,
subtitle:data.subtitle,
price:parseFloat(data.price),
img:data.img,
category:data.category,
available:true
};
if(data.id){
products[data.id]=newProduct;
}else{
products.push(newProduct);
}
saveProducts(); renderProducts(); renderAdminTable();
closeModal('productFormModal');
};

// أول تشغيل
renderProducts();

// export للدوال
window.editProduct=editProduct;
window.deleteProduct=deleteProduct;
window.toggleProduct=toggleProduct;
