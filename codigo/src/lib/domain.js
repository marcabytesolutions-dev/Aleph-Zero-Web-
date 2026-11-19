export const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const isPriced = v => Number.isFinite(v?.price) && v.price >= 0 && /^[A-Z]{3}$/.test(v.currency ?? '');
export function money(value, currency) {
  return `${new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value)} ${currency}`;
}
export function priceLabel(v) { return isPriced(v) ? money(v.price,v.currency) : 'Precio por confirmar'; }
export function variantLabel(v) {
  return [v.size && `${v.sizeSystem || 'Sistema por confirmar'} ${v.size}`,v.color,v.volume && `${v.volume} ml`,v.concentration].filter(Boolean).join(' · ') || 'Variante por confirmar';
}
export function matchesCategory(p, category) {return category==='todos'||!category||p.category===category||(category==='perfumeria'&&p.category!=='calzado');}
export function filterProducts(products, filters={}) {
  const result=products.filter(p=>matchesCategory(p,filters.category) && (!filters.q||normalize(p.name+' '+p.brand).includes(normalize(filters.q))) && (!filters.brand||p.brand===filters.brand) && (!filters.size||p.variants.some(v=>v.size===filters.size)) && (!filters.volume||p.variants.some(v=>String(v.volume)===filters.volume)) && (!filters.concentration||p.variants.some(v=>v.concentration===filters.concentration)) && (!filters.price||p.variants.some(v=>isPriced(v)&&v.currency==='USD'&&v.price<=Number(filters.price))));
  if(filters.sort==='name') result.sort((a,b)=>(a.brand+' '+a.name).localeCompare(b.brand+' '+b.name,'es'));
  if(filters.sort==='price-asc'||filters.sort==='price-desc') result.sort((a,b)=>{
    const av=a.variants[0],bv=b.variants[0];
    if(!isPriced(av))return isPriced(bv)?1:0;if(!isPriced(bv))return -1;
    if(av.currency!==bv.currency)return av.currency.localeCompare(bv.currency);
    return (av.price-bv.price)*(filters.sort==='price-asc'?1:-1);
  });
  return result;
}
export function sanitizeSelection(input,products){
  if(!Array.isArray(input))return [];
  const merged=new Map();
  for(const entry of input){
    const p=products.find(p=>p.id===entry?.productId);
    if(!p?.variants.some(v=>v.id===entry.variantId)||!Number.isInteger(entry.quantity)||entry.quantity<1)continue;
    const key=`${entry.productId}:${entry.variantId}`;
    const existing=merged.get(key);
    merged.set(key,{productId:p.id,variantId:entry.variantId,quantity:Math.min(99,(existing?.quantity||0)+entry.quantity)});
  }
  return [...merged.values()];
}
export function selectionLines(selection,products){return sanitizeSelection(selection,products).map(entry=>{const product=products.find(p=>p.id===entry.productId);return {...entry,product,variant:product.variants.find(v=>v.id===entry.variantId)};});}
export function totalsFor(lines){
  const totals={};let unknown=0;
  for(const line of lines){if(!isPriced(line.variant)){unknown+=line.quantity;continue;}totals[line.variant.currency]=(totals[line.variant.currency]||0)+Math.round(line.variant.price*100)*line.quantity;}
  return {totals:Object.fromEntries(Object.entries(totals).map(([currency,cents])=>[currency,cents/100])),unknown};
}
export function buildMessage(lines,municipality=''){
  const {totals,unknown}=totalsFor(lines);
  return ['CONSULTA DE DEMOSTRACIÓN · ALEPH ZERO','Hola, quisiera confirmar disponibilidad y precio de esta selección:',...lines.map((l,i)=>`\n${i+1}. ${l.product.brand} ${l.product.name}\nReferencia: ${l.variant.reference}\nVariante: ${variantLabel(l.variant)}\nCantidad: ${l.quantity}\nPrecio mostrado: ${priceLabel(l.variant)}\nSubtotal referencial: ${isPriced(l.variant)?money(Math.round(l.variant.price*100)*l.quantity/100,l.variant.currency):'pendiente de confirmación'}\nProducto: ${l.variant.sourceUrl||l.product.sourceUrl}`),'',...Object.entries(totals).map(([c,n])=>`Subtotal referencial${unknown?' parcial':''}: ${money(n,c)}`),unknown?`${unknown} unidad(es) con precio pendiente. No hay un total completo.`:'',municipality.trim()?`Municipio de entrega: ${municipality.trim().slice(0,80)}`:'','Precios de muestra consultados el 14/11/2026; sin sincronización en tiempo real.','Envío y condiciones de pago por confirmar. Esta consulta no reserva existencias ni confirma un pedido.'].filter(Boolean).join('\n');
}
