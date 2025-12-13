// =================== DATA ===================
const dataKiloan = {
  "Cuci Setrika": {"Dewasa":5000,"Anak-anak":4000,"Bed Cover":15000},
  "Cuci Lipat": {"Dewasa":4000,"Anak-anak":3000},
  "Setrika Saja": {"Dewasa":3000,"Anak-anak":2000}
};
const dataSatuan = {"Selimut":15000,"Handuk":10000,"Seprai":12000};

// =================== INISIALISASI ===================
window.addEventListener('load', () => {
  const tglMasuk = document.getElementById('tglMasuk');
  if(tglMasuk && !tglMasuk.value){
    const today = new Date();
    tglMasuk.value = today.toISOString().split('T')[0];
  }

  document.getElementById('addKiloBtn')?.addEventListener('click', addKilo);
  document.getElementById('addSatuanBtn')?.addEventListener('click', addSatuan);
  document.getElementById('buatNotaBtn')?.addEventListener('click', cetakNota);
  document.getElementById('copyBtn')?.addEventListener('click', copyNota);

  ['ongkir','hutangSebelumnya','saldo'].forEach(id=>{
    document.getElementById(id)?.addEventListener('input', hitungTotal);
  });

  document.querySelectorAll('.paket-group input, .paket-btn').forEach(el=>{
    el.addEventListener('click', ()=>updatePaket(el));
  });
});

// =================== KILOAN ===================
function addKilo(){
  const tbody = document.querySelector('#tabelKiloan tbody');
  if(!tbody) return;
  const tr = document.createElement('tr');

  let kategoriOptions = `<option value="">-- Pilih Kategori --</option>`;
  for(let k in dataKiloan) kategoriOptions += `<option value="${k}">${k}</option>`;

  tr.innerHTML = `
    <td><select onchange="updateJenis(this)">${kategoriOptions}</select></td>
    <td><select onchange="updateHarga(this)"><option value="">-- Pilih Jenis --</option></select></td>
    <td><input type="number" min="0" oninput="updateTotalKilo(this)"></td>
    <td><input type="number" readonly></td>
    <td><input type="number" readonly></td>
    <td><button onclick="this.closest('tr').remove(); hitungTotal()">Hapus</button></td>
  `;
  tbody.appendChild(tr);
}

function updateJenis(el){
  const tr = el.closest('tr');
  const jenisSelect = tr.querySelector('td:nth-child(2) select');
  jenisSelect.innerHTML = '<option value="">-- Pilih Jenis --</option>';
  const kat = el.value;
  if(kat && dataKiloan[kat]){
    for(let j in dataKiloan[kat]) jenisSelect.innerHTML += `<option value="${j}">${j}</option>`;
  }
  tr.querySelector('td:nth-child(4) input').value='';
  tr.querySelector('td:nth-child(5) input').value='';
  hitungTotal();
}

function updateHarga(el){
  const tr = el.closest('tr');
  const kat = tr.querySelector('td:nth-child(1) select').value;
  const jenis = el.value;
  tr.querySelector('td:nth-child(4) input').value = (kat && jenis)? dataKiloan[kat][jenis]: '';
  updateTotalKilo(tr.querySelector('td:nth-child(3) input'));
}

function updateTotalKilo(el){
  const tr = el.closest('tr');
  const harga = Number(tr.querySelector('td:nth-child(4) input').value) || 0;
  const kg = Number(el.value) || 0;
  tr.querySelector('td:nth-child(5) input').value = (kg*harga) || '';
  hitungTotal();
}

// =================== SATUAN ===================
function addSatuan(){
  const tbody = document.querySelector('#tabelSatuan tbody');
  if(!tbody) return;

  const tr = document.createElement('tr');
  let options = '<option value="">-- Pilih Jenis --</option>';
  for(let j in dataSatuan) options += `<option value="${j}">${j}</option>`;

  tr.innerHTML = `
    <td><select onchange="updateHargaSatuan(this)">${options}</select></td>
    <td><input type="number" min="1" oninput="updateTotalSatuan(this)"></td>
    <td><input type="number" readonly></td>
    <td><input type="number" readonly></td>
    <td><button onclick="this.closest('tr').remove(); hitungTotal()">Hapus</button></td>
  `;
  tbody.appendChild(tr);
}

function updateHargaSatuan(el){
  const tr = el.closest('tr');
  const jenis = el.value;
  tr.querySelector('td:nth-child(3) input').value = dataSatuan[jenis] || '';
  updateTotalSatuan(tr.querySelector('td:nth-child(2) input'));
}

function updateTotalSatuan(el){
  const tr = el.closest('tr');
  const qty = Number(el.value) || 0;
  const harga = Number(tr.querySelector('td:nth-child(3) input').value) || 0;
  tr.querySelector('td:nth-child(4) input').value = (qty*harga) || '';
  hitungTotal();
}

// =================== TOTAL ===================
function hitungTotal(){
  let sum = 0;
  document.querySelectorAll('#tabelKiloan tbody tr').forEach(tr=>{
    const val = Number(tr.querySelector('td:nth-child(5) input').value) || 0;
    sum += val;
  });
  document.querySelectorAll('#tabelSatuan tbody tr').forEach(tr=>{
    const val = Number(tr.querySelector('td:nth-child(4) input').value) || 0;
    sum += val;
  });

  const ongkir = Number(document.getElementById('ongkir')?.value) || 0;
  const hutang = Number(document.getElementById('hutangSebelumnya')?.value) || 0;
  const saldo = Number(document.getElementById('saldo')?.value) || 0;

  const total = sum + ongkir + hutang - saldo;
  document.getElementById('total').value = total>0? total : '';
  document.getElementById('sisa').value = total>0? total : '';
}

// =================== PAKET ===================
function updatePaket(el){
  const tglMasuk = document.getElementById('tglMasuk')?.value;
  const tglJadi = document.getElementById('tglJadi');
  if(!tglMasuk || !tglJadi) return;

  // Reset semua tombol active
  document.querySelectorAll('.paket-btn').forEach(btn=>btn.classList.remove('active'));

  if(el.id === 'kilat' && el.checked){
    const d = new Date(tglMasuk);
    d.setHours(d.getHours()+8);
    tglJadi.value = d.toISOString().split('T')[0];
    document.querySelectorAll('.paket-group input[type="checkbox"]').forEach(cb=>{
      if(cb.id!=='kilat') cb.checked=false;
    });
  } else if(el.classList.contains('paket-btn')){
    el.classList.add('active'); // tandai tombol aktif
    let days = Number(el.dataset.hari) || 0;
    const d = new Date(tglMasuk);
    d.setDate(d.getDate()+days);
    tglJadi.value = d.toISOString().split('T')[0];
    document.getElementById('kilat').checked=false;
  } else {
    tglJadi.value = '';
  }
}

// =================== NOTA ===================
function formatRibuan(num){ 
  return Number(num).toLocaleString('id-ID');
}

function cetakNota(){
  hitungTotal();
  const lines=[];
  lines.push("NUR LAUNDRY");
  lines.push("Karangjati RT. 05");
  lines.push("Telp 085878116420");
  lines.push("--------------------------------");

  const nama = document.getElementById('nama')?.value.trim();
  const alamat = document.getElementById('alamat')?.value.trim();
  const kasir = document.getElementById('kasir')?.value.trim();
  const tglMasuk = document.getElementById('tglMasuk')?.value;
  const tglJadi = document.getElementById('tglJadi')?.value;
  const keterangan = document.getElementById('keterangan')?.value.trim();

  // Paket
  let paket = '';
  if(document.getElementById('kilat')?.checked) paket='Kilat';
  const activeBtn = document.querySelector('.paket-btn.active');
  if(activeBtn) paket = activeBtn.innerText;

  if(nama) lines.push(`Pelanggan  : ${nama}`);
  if(kasir) lines.push(`Kasir      : ${kasir}`);
  if(tglMasuk) lines.push(`Tgl Masuk  : ${tglMasuk}`);
  if(tglJadi) lines.push(`Est Selesai: ${tglJadi}`);
  if(paket) lines.push(`paket      : ${paket}`);
  if(alamat) lines.push(`Alamat/Telp: ${alamat}`);
  lines.push("--------------------------------");

  // KILOAN
  const kiloanData = {};
  document.querySelectorAll('#tabelKiloan tbody tr').forEach(tr=>{
    const kat = tr.querySelector('td:nth-child(1) select').value;
    const jenis = tr.querySelector('td:nth-child(2) select').value;
    const kg = tr.querySelector('td:nth-child(3) input').value;
    const harga = tr.querySelector('td:nth-child(4) input').value;
    const total = tr.querySelector('td:nth-child(5) input').value;

    if(kat && jenis && kg && total){
      if(!kiloanData[kat]) kiloanData[kat] = [];
      kiloanData[kat].push({jenis, kg, harga, total});
    }
  });

  if(Object.keys(kiloanData).length>0){
    lines.push("KILOAN");
    lines.push("Jenis       Kg   Harga   Total");
    for(let kat in kiloanData){
      lines.push(`-${kat}`);
      kiloanData[kat].forEach(item=>{
        lines.push(`${item.jenis.padEnd(12)}${item.kg}kg  ${formatRibuan(item.harga)}   ${formatRibuan(item.total)}`);
      });
    }
    lines.push("--------------------------------");
  }

  // SATUAN
  const satuanData = [];
  document.querySelectorAll('#tabelSatuan tbody tr').forEach(tr=>{
    const jenis = tr.querySelector('td:nth-child(1) select').value;
    const qty = tr.querySelector('td:nth-child(2) input').value;
    const harga = tr.querySelector('td:nth-child(3) input').value;
    const total = tr.querySelector('td:nth-child(4) input').value;

    if(jenis && qty && total){
      satuanData.push({jenis, qty, harga, total});
    }
  });

  if(satuanData.length>0){
    lines.push("SATUAN");
    lines.push("Item        Pot Harga   Total");
    satuanData.forEach(item=>{
      lines.push(`${item.jenis.padEnd(12)}${item.qty}   ${formatRibuan(item.harga)}   ${formatRibuan(item.total)}`);
    });
    lines.push("--------------------------------");
  }

  // Biaya tambahan
  const ongkir = document.getElementById('ongkir')?.value;
  const hutang = document.getElementById('hutangSebelumnya')?.value;
  const saldo = document.getElementById('saldo')?.value;
  const parfum = document.getElementById('parfum')?.value;

  if(ongkir) lines.push("Biaya Ongkir : "+formatRibuan(ongkir));
  if(hutang) lines.push("BB Sebelumnya: "+formatRibuan(hutang));
  if(saldo) lines.push("Saldo/DP     : "+formatRibuan(saldo));

  const totalNota = document.getElementById('total')?.value;
  const sisaNota = document.getElementById('sisa')?.value;
  if(totalNota) lines.push("Total Harga  : "+formatRibuan(totalNota));
  if(sisaNota) lines.push("Kurang       : "+formatRibuan(sisaNota));
  if(parfum) lines.push("Parfum       : "+parfum);
  if(keterangan) lines.push("Catatan      : "+keterangan);

  lines.push("--------------------------------");
  lines.push("Setiap pengambilan dimohon");
  lines.push("disertai nota.");
  lines.push("Terimakasih");

  document.getElementById('notaText').value = lines.join("\n");
}

// =================== COPY NOTA ===================
function copyNota(){
  const nota = document.getElementById('notaText');
  if(!nota) return;
  nota.select();
  document.execCommand('copy');
  alert("Nota berhasil dicopy!");
}
