// ================= DATA PAKET =================
const dataPaket = {
  "REGULER-2H": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 5500,
      "P.Anak": 6500,
      "P.Dalam": 8000,
      "P.Bayi": 8000,
      "Hijab Tipis": 8000,
      "Jaket": 7000,
      "Jumper": 7000,
      "Suwiter.T": 7000,
      "Handuk": 7000,
      "Sajadah": 7000,
      "Seprai+Sb": 11000,
      "Selimut": 12000,
      "Sleeping Bag": 13000,
      "Bed Cover": 13000,
      "Boneka": 15000,
      "Gordyn": 16000
    },
    "CUCI & LIPAT": {
      "P.Dewasa": 4500,
      "P.Anak": 5500,
      "P.Dalam": 7000,
      "P.Bayi": 7000,
      "Hijab Tipis": 7000,
      "Jaket": 6000,
      "Jumper": 6000,
      "Suwiter.T": 6000,
      "Handuk": 6000,
      "Sajadah": 6000,
      "Seprai+Sb": 10000,
      "Selimut": 11000,
      "Sleeping Bag": 12000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 4500,
      "P.Anak": 5500,
      "P.Bayi": 7000,
      "Hijab Tipis": 7000,
      "Seprai+Sb": 6000
    }
  },
  "REGULER-3H": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 5500,
      "P.Anak": 6500,
      "P.Dalam": 8000,
      "P.Bayi": 8000,
      "Hijab Tipis": 8000
    },
    "CUCI & LIPAT": {
      "P.Dewasa": 4500,
      "P.Anak": 5500,
      "P.Dalam": 7000,
      "P.Bayi": 7000,
      "Hijab Tipis": 7000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 4500,
      "P.Anak": 5500,
      "P.Bayi": 7000,
      "Hijab Tipis": 7000
    }
  },
  "EKSPRESS-1H": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 7000,
      "P.Anak": 8000,
      "P.Dalam": 10000,
      "P.Bayi": 10000,
      "Hijab Tipis": 10000,
      "Jaket": 9000,
      "Jumper": 9000,
      "Suwiter.T": 9000,
      "Handuk": 8000,
      "Sajadah": 7000,
      "Seprai+Sb": 13000,
      "Selimut": 15000,
      "Sleeping Bag": 16000
    },
    "CUCI & LIPAT": {
      "P.Dewasa": 6000,
      "P.Anak": 7000,
      "P.Dalam": 8000,
      "P.Bayi": 8000,
      "Hijab Tipis": 8000,
      "Jaket": 8000,
      "Jumper": 8000,
      "Suwiter.T": 8000,
      "Handuk": 7000,
      "Sajadah": 7000,
      "Seprai+Sb": 11000,
      "Selimut": 12000,
      "Sleeping Bag": 13000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 6000,
      "P.Anak": 7000,
      "P.Bayi": 8000,
      "Hijab Tipis": 8000,
      "Seprai+Sb": 7000
    }
  },
  "KILAT-8J": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 11000,
      "P.Anak": 14000,
      "Hijab Tipis": 16000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 9000,
      "P.Anak": 11000,
      "Hijab Tipis": 14000
    }
  }
};

// ================= DATA SATUAN =================
const dataSatuan = {
  "Selimut": 15000,
  "Handuk": 10000,
  "Seprai": 11000,
  "Boneka": 15000
};

// ================= VAR GLOBAL =================
let selectedPaket = "";
let manualTanggal = false;

// ================= INISIALISASI =================
window.addEventListener('load', ()=>{
  const tglMasuk = document.getElementById('tglMasuk');
  const tglJadi = document.getElementById('tglJadi');
  if(tglMasuk && !tglMasuk.value) tglMasuk.value = new Date().toISOString().split('T')[0];

  document.getElementById('addKiloBtn').addEventListener('click', addKilo);
  document.getElementById('addSatuanBtn').addEventListener('click', addSatuan);
  document.getElementById('buatNotaBtn').addEventListener('click', cetakNota);
  ['ongkir','hutangSebelumnya','saldo'].forEach(id=>{
    document.getElementById(id).addEventListener('input', hitungTotal);
  });

  document.querySelectorAll('.paket-btn').forEach(el=>{
    el.addEventListener('click', ()=>{
      updatePaket(el);
      updateHargaSemuaKiloan();
      updateTanggalEstimasi(el.innerText);
      manualTanggal = false;
    });
  });

  tglMasuk.addEventListener('change', ()=>{ cekPaketOtomatis(); });
  tglJadi.addEventListener('change', ()=>{
    manualTanggal = true;
    cekPaketOtomatis();
  });
});

// ================= PAKET =================
function paketKeyFromText(text){
  if(!text) return "";
  text = text.toUpperCase();
  if(text.includes("REGULER-2H")) return "REGULER-2H";
  if(text.includes("REGULER-3H")) return "REGULER-3H";
  if(text.includes("EKSPRESS") || text.includes("CLING")) return "EKSPRESS-1H";
  if(text.includes("KILAT")) return "KILAT-8J";
  return "";
}

function updatePaket(el){
  document.querySelectorAll('.paket-btn').forEach(b=>b.classList.remove('active'));
  if(el) el.classList.add('active');
  selectedPaket = el ? el.innerText : "REGULER";
  updateHargaSemuaKiloan();
}

// ================= TANGGAL OTOMATIS =================
function updateTanggalEstimasi(paketText){
  const tglMasukEl = document.getElementById('tglMasuk');
  const tglJadiEl = document.getElementById('tglJadi');
  if(!tglMasukEl || !tglJadiEl) return;
  const masuk = new Date(tglMasukEl.value);
  if(isNaN(masuk)) return;

  let estimasi = new Date(masuk);
  paketText = paketText.toUpperCase();
  if(paketText.includes("CLING") || paketText.includes("EKSPRESS")) estimasi.setDate(masuk.getDate() + 1);
  else if(paketText.includes("REGULER-2H")) estimasi.setDate(masuk.getDate() + 2);
  else if(paketText.includes("REGULER-3H")) estimasi.setDate(masuk.getDate() + 3);
  else if(paketText.includes("KILAT")) estimasi.setHours(masuk.getHours()+8);

  tglJadiEl.value = estimasi.toISOString().split('T')[0];
}

// ================= CEK PAKET OTOMATIS =================
function cekPaketOtomatis(){
  if(manualTanggal){
    const tglMasuk = new Date(document.getElementById('tglMasuk').value);
    const tglJadi = new Date(document.getElementById('tglJadi').value);
    if(isNaN(tglMasuk) || isNaN(tglJadi)) return;

    let diff = Math.ceil((tglJadi - tglMasuk)/ (1000*60*60*24));
    if(diff < 0) diff = 0; // jika tanggal estimasi sebelum masuk

    document.querySelectorAll('.paket-btn').forEach(b => b.classList.remove('active'));

    if(diff <= 0){ // hari sama dengan masuk
      const el = document.getElementById('cling') || document.querySelector('.paket-btn[data-paket*="CLING"], .paket-btn[data-paket*="EKSPRESS"]');
      if(el) { el.classList.add('active'); selectedPaket = el.innerText; }
    } else if(diff == 1){
      const el = document.getElementById('cling') || document.querySelector('.paket-btn[data-paket*="CLING"], .paket-btn[data-paket*="EKSPRESS"]');
      if(el) { el.classList.add('active'); selectedPaket = el.innerText; }
    } else if(diff == 2){
      const el = document.getElementById('hemat2') || document.querySelector('.paket-btn[data-paket*="REGULER-2H"]');
      if(el) { el.classList.add('active'); selectedPaket = el.innerText; }
    } else { // diff >=3
      const el = document.getElementById('hemat3') || document.querySelector('.paket-btn[data-paket*="REGULER-3H"]');
      if(el) { el.classList.add('active'); selectedPaket = el.innerText; }
    }
  }
  updateHargaSemuaKiloan();
}

// ================= KILOAN =================
function addKilo(){
  const tbody = document.querySelector('#tabelKiloan tbody');
  if(!tbody) return;

  const tr = document.createElement('tr');
  const paketKey = paketKeyFromText(selectedPaket || "REGULER-2H");

  let kategoriOptions = '<option value="">-- Pilih Kategori --</option>';
  if(dataPaket[paketKey]){
    for(let kat in dataPaket[paketKey]){
      kategoriOptions += `<option value="${kat}">${kat}</option>`;
    }
  }

  tr.innerHTML = `
    <td><select onchange="updateJenis(this)">${kategoriOptions}</select></td>
    <td><select onchange="updateHarga(this)"><option value="">-- Pilih Jenis --</option></select></td>
    <td><input type="number" min="0" oninput="updateTotalKilo(this)"></td>
    <td><input type="number" readonly></td>
    <td><input type="number" readonly></td>
    <td><button onclick="this.closest('tr').remove(); hitungTotal()">Hapus</button></td>
  `;

  tbody.appendChild(tr);
  const kategoriSelect = tr.querySelector('td:nth-child(1) select');
  if(kategoriSelect.options.length > 1){
    kategoriSelect.value = kategoriSelect.options[1].value;
    updateJenis(kategoriSelect);
  }
}

function updateJenis(el){
  const tr = el.closest('tr');
  const jenisSelect = tr.querySelector('td:nth-child(2) select');
  const kategori = el.value;
  const paketKey = paketKeyFromText(selectedPaket || "REGULER-2H");
  jenisSelect.innerHTML = '<option value="">-- Pilih Jenis --</option>';
  if(paketKey && kategori && dataPaket[paketKey][kategori]){
    for(let j in dataPaket[paketKey][kategori]){
      jenisSelect.innerHTML += `<option value="${j}">${j}</option>`;
    }
    const firstJenis = Object.keys(dataPaket[paketKey][kategori])[0];
    if(firstJenis) { jenisSelect.value = firstJenis; updateHarga(jenisSelect); }
  }
}

function updateHarga(el){
  const tr = el.closest('tr');
  const kategori = tr.querySelector('td:nth-child(1) select').value;
  const jenis = el.value;
  const paketKey = paketKeyFromText(selectedPaket || "REGULER-2H");
  const harga = paketKey && kategori && jenis ? dataPaket[paketKey][kategori][jenis] : 0;
  tr.querySelector('td:nth-child(4) input').value = harga;
  updateTotalKilo(tr.querySelector('td:nth-child(3) input'));
}

function updateTotalKilo(el){
  const tr = el.closest('tr');
  const harga = Number(tr.querySelector('td:nth-child(4) input').value) || 0;
  const kg = Number(el.value) || 0;
  tr.querySelector('td:nth-child(5) input').value = kg*harga || '';
  hitungTotal();
}

function updateHargaSemuaKiloan(){
  document.querySelectorAll('#tabelKiloan tbody tr').forEach(tr=>{
    const jenisSelect = tr.querySelector('td:nth-child(2) select');
    updateHarga(jenisSelect);
  });
}

// ================= SATUAN =================
function addSatuan(){
  const tbody = document.querySelector('#tabelSatuan tbody');
  if(!tbody) return;
  const tr = document.createElement('tr');
  let options = '<option value="">-- Pilih Jenis --</option>';
  for(let j in dataSatuan) options += `<option value="${j}">${j}</option>`;

  tr.innerHTML = `
    <td><select onchange="updateHargaSatuan(this)">${options}</select></td>
    <td><input type="number" min="1" value="1" oninput="updateTotalSatuan(this)"></td>
    <td><input type="number" readonly></td>
    <td><input type="number" readonly></td>
    <td><button onclick="this.closest('tr').remove(); hitungTotal()">Hapus</button></td>
  `;
  tbody.appendChild(tr);
}

function updateHargaSatuan(el){
  const tr = el.closest('tr');
  const j = el.value;
  tr.querySelector('td:nth-child(3) input').value = j && dataSatuan[j]? dataSatuan[j] : '';
  updateTotalSatuan(tr.querySelector('td:nth-child(2) input'));
}

function updateTotalSatuan(el){
  const tr = el.closest('tr');
  const harga = Number(tr.querySelector('td:nth-child(3) input').value) || 0;
  const qty = Number(el.value) || 0;
  tr.querySelector('td:nth-child(4) input').value = qty*harga || '';
  hitungTotal();
}

// ================= TOTAL =================
function hitungTotal(){
  let total = 0;
  document.querySelectorAll('#tabelKiloan tbody tr').forEach(tr=>{ total += Number(tr.querySelector('td:nth-child(5) input').value)||0; });
  document.querySelectorAll('#tabelSatuan tbody tr').forEach(tr=>{ total += Number(tr.querySelector('td:nth-child(4) input').value)||0; });
  const ongkir = Number(document.getElementById('ongkir').value)||0;
  const hutang = Number(document.getElementById('hutangSebelumnya').value)||0;
  const saldo = Number(document.getElementById('saldo').value)||0;
  const totalHarga = total + ongkir + hutang;
  document.getElementById('total').value = totalHarga;
  document.getElementById('sisa').value = totalHarga - saldo;
}

// ================= NOTA =================
function formatRibuan(x){ return Number(x).toLocaleString('id-ID'); }

// ================= NOTA =================
function cetakNota(){
  hitungTotal();
  let lines = [];
  lines.push("NUR LAUNDRY");
  lines.push("Karangjati RT. 05");
  lines.push("Telp 085878116420");
  lines.push("--------------------------------");

  const nama = document.getElementById('nama').value.trim();
  if(nama) lines.push(`Pelanggan  : ${nama}`);

  const tglMasuk = document.getElementById('tglMasuk').value;
  if(tglMasuk) lines.push(`Tgl Masuk  : ${tglMasuk}`);

  const tglJadi = document.getElementById('tglJadi').value;
  if(tglJadi) lines.push(`Est Selesai: ${tglJadi}`);

  const paket = selectedPaket || "";
  if(paket) lines.push(`paket      : ${paket}`);

  lines.push("--------------------------------");

  // ----------- KILOAN -----------  
  const kiloRows = document.querySelectorAll('#tabelKiloan tbody tr');
  if(kiloRows.length > 0){
    let hasKiloan = false;
    let lastKategori = "";
    let kiloLines = [];
    kiloRows.forEach(tr=>{
      const kategori = tr.querySelector('td:nth-child(1) select').value;
      const jenis = tr.querySelector('td:nth-child(2) select').value;
      const kg = tr.querySelector('td:nth-child(3) input').value || 0;
      const harga = Number(tr.querySelector('td:nth-child(4) input').value) || 0;
      const total = Number(tr.querySelector('td:nth-child(5) input').value) || 0;

      if(total>0){ // hanya tampilkan yang ada harga
        hasKiloan = true;
        if(kategori && kategori !== lastKategori){
          kiloLines.push(`-${kategori}`);
          lastKategori = kategori;
        }
        if(jenis){
          kiloLines.push(`${jenis.padEnd(11)} ${kg}kg  ${formatRibuan(harga).padEnd(7)} ${formatRibuan(total)}`);
        }
      }
    });
    if(hasKiloan){
      lines.push("KILOAN");
      lines.push("Jenis       Kg   Harga   Total");
      lines.push(...kiloLines);
      lines.push("--------------------------------");
    }
  }

  // ----------- SATUAN -----------  
  const satuRows = document.querySelectorAll('#tabelSatuan tbody tr');
  if(satuRows.length > 0){
    let hasSatuan = false;
    let satuLines = [];
    satuRows.forEach(tr=>{
      const item = tr.querySelector('td:nth-child(1) select').value;
      const qty = tr.querySelector('td:nth-child(2) input').value || 0;
      const harga = Number(tr.querySelector('td:nth-child(3) input').value) || 0;
      const total = Number(tr.querySelector('td:nth-child(4) input').value) || 0;

      if(total>0){
        hasSatuan = true;
        satuLines.push(`${item.padEnd(12)} ${qty.toString().padEnd(4)} ${formatRibuan(harga).padEnd(7)} ${formatRibuan(total)}`);
      }
    });
    if(hasSatuan){
      lines.push("SATUAN");
      lines.push("Item        Pot   Harga   Total");
      lines.push(...satuLines);
      lines.push("--------------------------------");
    }
  }

  // ----------- BIAYA LAIN -----------  
  const totalHarga = Number(document.getElementById('total').value)||0;
  const kurang = Number(document.getElementById('sisa').value)||0;
  if(totalHarga>0){
    lines.push(`Total Harga  : ${formatRibuan(totalHarga)}`);
    lines.push(`Kurang       : ${formatRibuan(kurang)}`);
  }

  lines.push("--------------------------------");
  lines.push("Setiap pengambilan dimohon");
  lines.push("disertai nota.");
  lines.push("Terimakasih");

  document.getElementById('notatexs').value = lines.join('\n');
}

// ================= COPY NOTA =================
document.getElementById('copyBtn')?.addEventListener('click', ()=>{
  const notatexs = document.getElementById('notatexs');
  if(notatexs){
    notatexs.select();
    notatexs.setSelectionRange(0, 99999); // mobile
    navigator.clipboard.writeText(notatexs.value)
      .then(()=>alert('Nota berhasil disalin!'))
      .catch(()=>alert('Gagal menyalin nota'));
  }
});
