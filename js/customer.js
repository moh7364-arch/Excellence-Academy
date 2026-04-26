import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const safe=(v='')=>String(v).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
const user=JSON.parse(localStorage.getItem('ahu')||'null');
if(!user){localStorage.setItem('pendingRequest',JSON.stringify({section:'general',service:''})); location.href='auth.html';}
const app=initializeApp(firebaseConfig), db=getFirestore(app);
const statuses={new:'جديد',review:'قيد المراجعة',progress:'قيد التنفيذ',waiting:'بانتظار العميل',done:'مكتمل',cancelled:'ملغي'};
const list=document.getElementById('clientOrders');
document.getElementById('clientLogout').onclick=()=>{localStorage.removeItem('ahu'); location.href='index.html'};
onSnapshot(query(collection(db,'orders'),orderBy('createdAt','desc')),snap=>{
  const orders=snap.docs.map(d=>({id:d.id,...d.data()})).filter(o=>(o.email||'').toLowerCase()===(user.email||'').toLowerCase());
  document.getElementById('totalOrders').textContent=orders.length;
  document.getElementById('activeOrders').textContent=orders.filter(o=>!['done','cancelled'].includes(o.status||'new')).length;
  document.getElementById('doneOrders').textContent=orders.filter(o=>(o.status||'')==='done').length;
  if(!orders.length){list.innerHTML='<div class="admin-empty">لا توجد طلبات بعد. اختر خدمة من المنصة وابدأ طلبك الأول.</div>';return}
  list.innerHTML=orders.map(o=>`<article class="order-card status-${safe(o.status||'new')}"><div class="order-top"><b>${safe(o.service||'طلب خدمة')}</b><span>${safe(statuses[o.status||'new']||'جديد')}</span></div><p>${safe(o.section||'قسم عام')} • ${safe(o.specialization||'بدون تخصص')}</p><small>رقم الطلب: ${safe(o.id.slice(0,8))}</small><details><summary>عرض تفاصيل الطلب</summary><pre>${safe(o.details||'لا توجد تفاصيل إضافية')}</pre></details></article>`).join('');
},err=>{list.innerHTML='<div class="admin-empty">تعذر تحميل الطلبات: '+safe(err.message)+'</div>'});
