// ================= DATA PAKET =================
const dataPaket = {
  "REGULER-2H": {
    "CUCI & SETRIKA": {
      "Pakaian Dewasa": 5500,
      "Pakaian Anak-anak": 6500,
      "Pakaian Dalam": 8000,
      "Pakaian Bayi": 8000,
      "Hijab Tipis": 8000,
      "Jaket Jeans Tebal": 7000,
      "Jumper Tebal": 7000,
      "Sweater Tebal": 7000,
      "Handuk": 7000,
      "Sajadah": 7000,
      "Seprai/Sarung Bantal": 11000,
      "Selimut": 12000,
      "Sleeping Bag": 13000,
      "Bed Cover": 13000,
      "Boneka": 15000,
      "Gordyn": 16000
    },
    "CUCI & LIPAT": {
      "Pakaian Dewasa": 4500,
      "Pakaian Anak Kecil": 5500,
      "Pakaian Dalam": 7000,
      "Pakaian Bayi": 7000,
      "Hijab Tipis": 7000,
      "Jaket Jeans Tebal": 6000,
      "Jaket/Jumper Tebal": 6000,
      "Handuk": 6000,
      "Sajadah": 6000,
      "Seprai/Sarung Bantal": 10000,
      "Selimut": 11000,
      "Sleeping Bag": 12000
    },
    "SETRIKA SAJA": {
      "Pakaian Dewasa": 4500,
      "Pakaian Anak-anak": 5500,
      "Pakaian Bayi": 7000,
      "Hijab Tipis": 7000,
      "Seprai/Sarung Bantal": 6000
    }
  },
  "REGULER-3H": {
    "CUCI & SETRIKA": {
      "Pakaian Dewasa": 5500,
      "Pakaian Anak-anak": 6500,
      "Pakaian Dalam": 8000,
      "Pakaian Bayi": 8000,
      "Hijab Tipis": 8000
    },
    "CUCI & LIPAT": {
      "Pakaian Dewasa": 4500,
      "Pakaian Anak Kecil": 5500,
      "Pakaian Dalam": 7000,
      "Pakaian Bayi": 7000,
      "Hijab Tipis": 7000
    },
    "SETRIKA SAJA": {
      "Pakaian Dewasa": 4500,
      "Pakaian Anak-anak": 5500,
      "Pakaian Bayi": 7000,
      "Hijab Tipis": 7000
    }
  },
  "EKSPRESS-1H": {
    "CUCI & SETRIKA": {
      "Pakaian Dewasa": 7000,
      "Pakaian Anak-anak": 8000,
      "Pakaian Dalam": 10000,
      "Pakaian Bayi": 10000,
      "Hijab Tipis": 10000,
      "Jaket Jeans Tebal": 9000,
      "Jumper Tebal": 9000,
      "Sweater Tebal": 9000,
      "Handuk": 8000,
      "Sajadah": 7000,
      "Seprai/Sarung Bantal": 13000,
      "Selimut": 15000,
      "Sleeping Bag": 16000
    },
    "CUCI & LIPAT": {
      "Pakaian Dewasa": 6000,
      "Pakaian Anak Kecil": 7000,
      "Pakaian Dalam": 8000,
      "Pakaian Bayi": 8000,
      "Hijab Tipis": 8000,
      "Jaket Jeans Tebal": 8000,
      "Jaket/Jumper Tebal": 8000,
      "Handuk": 7000,
      "Sajadah": 7000,
      "Seprai/Sarung Bantal": 11000,
      "Selimut": 12000,
      "Sleeping Bag": 13000
    },
    "SETRIKA SAJA": {
      "Pakaian Dewasa": 6000,
      "Pakaian Anak-anak": 7000,
      "Pakaian Bayi": 8000,
      "Hijab Tipis": 8000,
      "Seprai/Sarung Bantal": 7000
    }
  },
  "KILAT-8J": {
    "CUCI & SETRIKA": {
      "Pakaian Dewasa": 11000,
      "Pakaian Anak-anak": 14000,
      "Hijab Tipis": 16000
    },
    "SETRIKA SAJA": {
      "Pakaian Dewasa": 9000,
      "Pakaian Anak-anak": 11000,
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

  // ----------------- INI BAGIAN BARU -----------------
  tglMasuk.addEventListener('change', ()=>{
    cekPaketOtomatis();  // otomatis tetap cek paket walau tgl masuk berubah
  });

  tglJadi.addEventListener('change', ()=>{
    manualTanggal = true;
    cekPaketOtomatis();  // pastikan tombol paket menyesuaikan saat manual
  });
  // ----------------------------------------------------
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

// ================= TANGGAL OTOMATIS / CEK PAKET =================
function cekPaketOtomatis(){
  const tglMasukEl = document.getElementById('tglMasuk');
  const tglJadiEl = document.getElementById('tglJadi');
  if(!tglMasukEl || !tglJadiEl) return;

  const masuk = new Date(tglMasukEl.value);
  const estimasi = new Date(tglJadiEl.value);
  if(isNaN(masuk) || isNaN(estimasi)) return;

  const diffDays = Math.round((estimasi - masuk)/(1000*60*60*24));

  // reset semua tombol
  document.querySelectorAll('.paket-btn').forEach(b=>b.classList.remove('active'));

  let btn = null;
  if(diffDays <= 0) btn = document.getElementById('kilatBtn');      // hari sama
  else if(diffDays === 1) btn = document.getElementById('cling');    // +1 hari
  else if(diffDays === 2) btn = document.getElementById('hemat2');   // +2 hari
  else if(diffDays >= 3) btn = document.getElementById('hemat3');    // +3 hari atau lebih

  if(btn) {
    btn.classList.add('active');
    selectedPaket = btn.innerText;
    updateHargaSemuaKiloan();
  }
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
    <td>
      <select onchange="updateJenis(this)">${kategoriOptions}</select>
    </td>
    <td>
      <select onchange="updateHarga(this)"><option value="">-- Pilih Jenis --</option></select>
    </td>
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

function cetakNota(){
  hitungTotal(); // pastikan total terbaru
  let lines = [];
  lines.push("NUR LAUNDRY");
  lines.push("Karangjati RT. 05");
  lines.push("Telp 085878116420");
  lines.push("--------------------------------");

  const nama = document.getElementById('nama').value.trim();
  if(nama) lines.push(`Pelanggan  : ${nama}`);

  const kasir = document.getElementById('kasir').value.trim();
  if(kasir) lines.push(`Kasir      : ${kasir}`);

  const tglMasuk = document.getElementById('tglMasuk').value;
  if(tglMasuk) lines.push(`Tgl Masuk  : ${tglMasuk}`);

  const tglJadi = document.getElementById('tglJadi').value;
  if(tglJadi) lines.push(`Est Selesai: ${tglJadi}`);

  if(selectedPaket) lines.push(`Paket      : ${selectedPaket}`);

  const alamat = document.getElementById('alamat').value.trim();
  if(alamat) lines.push(`Alamat/Telp: ${alamat}`);

  lines.push("--------------------------------");

  // ----------- KILOAN -----------
  const kiloRows = document.querySelectorAll('#tabelKiloan tbody tr');
  if(kiloRows.length > 0 && Array.from(kiloRows).some(tr=>tr.querySelector('td:nth-child(2) select').value)){
    lines.push("KILOAN");
    lines.push("Jenis           Kg   Harga   Total");
    kiloRows.forEach(tr=>{
      const jenis = tr.querySelector('td:nth-child(2) select').value;
      const kg = tr.querySelector('td:nth-child(3) input').value || 0;
      const harga = Number(tr.querySelector('td:nth-child(4) input').value) || 0;
      const total = Number(tr.querySelector('td:nth-child(5) input').value) || 0;
      if(jenis){
        lines.push(
          jenis.padEnd(15) + 
          `${kg}kg`.padEnd(6) + 
          formatRibuan(harga).padEnd(8) + 
          formatRibuan(total)
        );
      }
    });
    lines.push("--------------------------------");
  }

  // ----------- SATUAN -----------
  const satuRows = document.querySelectorAll('#tabelSatuan tbody tr');
  if(satuRows.length > 0 && Array.from(satuRows).some(tr=>tr.querySelector('td:nth-child(1) select').value)){
    lines.push("SATUAN");
    lines.push("Item           Pot   Harga   Total");
    satuRows.forEach(tr=>{
      const jenis = tr.querySelector('td:nth-child(1) select').value;
      const qty = tr.querySelector('td:nth-child(2) input').value || 0;
      const harga = Number(tr.querySelector('td:nth-child(3) input').value) || 0;
      const total = Number(tr.querySelector('td:nth-child(4) input').value) || 0;
      if(jenis){
        lines.push(
          jenis.padEnd(15) + 
          `${qty}`.padEnd(6) + 
          formatRibuan(harga).padEnd(8) + 
          formatRibuan(total)
        );
      }
    });
    lines.push("--------------------------------");
  }

  // ----------- BIAYA & LAINNYA -----------
  const ongkir = Number(document.getElementById('ongkir').value) || 0;
  const hutang = Number(document.getElementById('hutangSebelumnya').value) || 0;
  const totalHarga = Number(document.getElementById('total').value) || 0;
  const saldo = Number(document.getElementById('saldo').value) || 0;
  const sisa = totalHarga - saldo;
  const parfum = document.getElementById('parfum').value.trim();
  const catatan = document.getElementById('keterangan').value.trim();

  if(ongkir) lines.push(`Biaya Ongkir : ${formatRibuan(ongkir)}`);
  if(hutang) lines.push(`BB Sebelumnya: ${formatRibuan(hutang)}`);
  if(saldo) lines.push(`Saldo/DP     : ${formatRibuan(saldo)}`);
  if(totalHarga) lines.push(`Total Harga  : ${formatRibuan(totalHarga)}`);
  if(sisa) lines.push(`Kurang       : ${formatRibuan(sisa)}`);
  if(parfum) lines.push(`Parfum       : ${parfum}`);
  if(catatan) lines.push(`Catatan      : ${catatan}`);

  lines.push("--------------------------------");
  lines.push("Setiap pengambilan dimohon");
  lines.push("disertai nota.");
  lines.push("Terimakasih");

  document.getElementById('notatexs').value = lines.join('\n');
}
