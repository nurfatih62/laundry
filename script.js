// ========================================
// NUR LAUNDRY - Kasir Digital
// Format Nota untuk Struk Thermal 57mm
// TANPA EMOJI - 32 Karakter per baris
// ========================================

// ================= DATA PAKET =================
const dataPaket = {
  "REGULER-2H": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 5500, "P.Anak": 6500, "P.Dalam": 8000, "P.Bayi": 8000,
      "Hijab Tipis": 8000, "Jaket": 7000, "Jumper": 7000, "Suwiter.T": 7000,
      "Handuk": 7000, "Sajadah": 7000, "Seprai+Sb": 11000, "Selimut": 12000,
      "Sleeping Bag": 13000, "Bed Cover": 13000, "Boneka": 15000, "Gordyn": 16000
    },
    "CUCI & LIPAT": {
      "P.Dewasa": 4500, "P.Anak": 5500, "P.Dalam": 7000, "P.Bayi": 7000,
      "Hijab Tipis": 7000, "Jaket": 6000, "Jumper": 6000, "Suwiter.T": 6000,
      "Handuk": 6000, "Sajadah": 6000, "Seprai+Sb": 10000, "Selimut": 11000,
      "Sleeping Bag": 12000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 4500, "P.Anak": 5500, "P.Bayi": 7000,
      "Hijab Tipis": 7000, "Seprai+Sb": 6000
    }
  },
  "REGULER-3H": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 5500, "P.Anak": 6500, "P.Dalam": 8000,
      "P.Bayi": 8000, "Hijab Tipis": 8000
    },
    "CUCI & LIPAT": {
      "P.Dewasa": 4500, "P.Anak": 5500, "P.Dalam": 7000,
      "P.Bayi": 7000, "Hijab Tipis": 7000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 4500, "P.Anak": 5500, "P.Bayi": 7000, "Hijab Tipis": 7000
    }
  },
  "EKSPRESS-1H": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 7000, "P.Anak": 8000, "P.Dalam": 10000, "P.Bayi": 10000,
      "Hijab Tipis": 10000, "Jaket": 9000, "Jumper": 9000, "Suwiter.T": 9000,
      "Handuk": 8000, "Sajadah": 7000, "Seprai+Sb": 13000, "Selimut": 15000,
      "Sleeping Bag": 16000
    },
    "CUCI & LIPAT": {
      "P.Dewasa": 6000, "P.Anak": 7000, "P.Dalam": 8000, "P.Bayi": 8000,
      "Hijab Tipis": 8000, "Jaket": 8000, "Jumper": 8000, "Suwiter.T": 8000,
      "Handuk": 7000, "Sajadah": 7000, "Seprai+Sb": 11000, "Selimut": 12000,
      "Sleeping Bag": 13000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 6000, "P.Anak": 7000, "P.Bayi": 8000,
      "Hijab Tipis": 8000, "Seprai+Sb": 7000
    }
  },
  "KILAT-8J": {
    "CUCI & SETRIKA": {
      "P.Dewasa": 11000, "P.Anak": 14000, "Hijab Tipis": 16000
    },
    "SETRIKA SAJA": {
      "P.Dewasa": 9000, "P.Anak": 11000, "Hijab Tipis": 14000
    }
  }
};

// ================= DATA SATUAN =================
const dataSatuan = {
  "Selimut": 15000,
  "Handuk": 10000,
  "Seprai": 11000,
  "Boneka S": 15000,
  "Boneka M": 25000,
  "Boneka L": 35000,
  "Bed Cover": 25000,
  "Karpet": 30000,
  "Gordyn": 20000,
  "Jas": 15000,
  "Gaun": 25000
};

// ================= GLOBAL STATE =================
let selectedPaket = "REGULER-2H";
let manualTanggal = false;

// ================= HELPER FUNCTIONS =================
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

function formatRibuan(num) {
  return Number(num || 0).toLocaleString('id-ID');
}

function getPaketKey(text) {
  if (!text) return "REGULER-2H";
  text = text.toUpperCase();
  if (text.includes("KILAT")) return "KILAT-8J";
  if (text.includes("EKSPRESS") || text.includes("1H")) return "EKSPRESS-1H";
  if (text.includes("3H")) return "REGULER-3H";
  return "REGULER-2H";
}

function showAlert(type, message) {
  const alert = $('copyStatus');
  alert.textContent = message;
  alert.className = 'alert ' + type;
  setTimeout(() => alert.className = 'alert hidden', 3000);
}

function padEnd(str, len) {
  str = String(str || '');
  if (str.length >= len) return str.substring(0, len);
  return str + ' '.repeat(len - str.length);
}

function padStart(str, len) {
  str = String(str || '');
  if (str.length >= len) return str.substring(0, len);
  return ' '.repeat(len - str.length) + str;
}

// ================= TOGGLE SECTION =================
function toggleSection(sectionId) {
  const section = $(sectionId);
  if (section) section.classList.toggle('collapsed');
}

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  if ($('tglMasuk')) $('tglMasuk').value = today;

  $('addKiloBtn').addEventListener('click', addKiloan);
  $('addSatuanBtn').addEventListener('click', addSatuan);
  $('buatNotaBtn').addEventListener('click', buatNota);
  $('copyBtn').addEventListener('click', copyNota);
  $('shareBtn').addEventListener('click', shareNota);
  $('resetBtn').addEventListener('click', resetForm);

  ['ongkir', 'hutangSebelumnya', 'saldo'].forEach(function(id) {
    $(id).addEventListener('input', hitungTotal);
  });

  $$('.paket-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      selectPaket(btn);
    });
  });

  $('tglMasuk').addEventListener('change', function() {
    if (!manualTanggal) updateEstimasi();
  });

  $('tglJadi').addEventListener('change', function() {
    manualTanggal = true;
  });

  updateEstimasi();
  addKiloan();
  hitungTotal();
});

// ================= PAKET SELECTION =================
function selectPaket(btn) {
  $$('.paket-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  selectedPaket = btn.dataset.paket || "REGULER-2H";
  
  var jamJadi = $('jamJadi');
  if (selectedPaket === "KILAT-8J") {
    jamJadi.classList.remove('hidden');
  } else {
    jamJadi.classList.add('hidden');
  }
  
  manualTanggal = false;
  updateEstimasi();
  refreshAllKiloan();
}

// ================= UPDATE ESTIMASI =================
function updateEstimasi() {
  var tglMasukVal = $('tglMasuk').value;
  if (!tglMasukVal) return;
  
  var tglMasuk = new Date(tglMasukVal);
  if (isNaN(tglMasuk)) return;

  var est = new Date(tglMasuk);
  var paket = selectedPaket.toUpperCase();

  if (paket.includes("KILAT")) {
    var now = new Date();
    est = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    $('jamJadi').value = est.toTimeString().slice(0, 5);
    $('jamJadi').classList.remove('hidden');
  } else if (paket.includes("EKSPRESS") || paket.includes("1H")) {
    est.setDate(tglMasuk.getDate() + 1);
  } else if (paket.includes("3H")) {
    est.setDate(tglMasuk.getDate() + 3);
  } else {
    est.setDate(tglMasuk.getDate() + 2);
  }

  $('tglJadi').value = est.toISOString().split('T')[0];
}

// ================= KILOAN FUNCTIONS =================
function addKiloan() {
  var list = $('listKiloan');
  var paketKey = getPaketKey(selectedPaket);
  var data = dataPaket[paketKey] || {};

  var kategoriOpts = '<option value="">-- Kategori --</option>';
  for (var kat in data) {
    kategoriOpts += '<option value="' + kat + '">' + kat + '</option>';
  }

  var card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = 
    '<button type="button" class="btn-remove" onclick="removeItem(this)">×</button>' +
    '<div class="item-card-header">' +
      '<select class="sel-kategori" onchange="onKategoriChange(this)">' + kategoriOpts + '</select>' +
      '<select class="sel-jenis" onchange="onJenisChange(this)"><option value="">-- Jenis --</option></select>' +
    '</div>' +
    '<div class="item-card-body">' +
      '<div class="field">' +
        '<label>Kg</label>' +
        '<input type="number" class="inp-kg" inputmode="decimal" step="0.1" min="0" placeholder="0" oninput="calcKilo(this)">' +
      '</div>' +
      '<div class="field">' +
        '<label>Harga/Kg</label>' +
        '<input type="number" class="inp-harga" readonly>' +
      '</div>' +
      '<div class="field">' +
        '<label>Subtotal</label>' +
        '<input type="number" class="inp-total" readonly>' +
      '</div>' +
    '</div>';

  list.appendChild(card);

  var katSel = card.querySelector('.sel-kategori');
  if (katSel.options.length > 1) {
    katSel.value = katSel.options[1].value;
    onKategoriChange(katSel);
  }
}

function onKategoriChange(el) {
  var card = el.closest('.item-card');
  var jenisSel = card.querySelector('.sel-jenis');
  var kategori = el.value;
  var paketKey = getPaketKey(selectedPaket);
  var jenisData = (dataPaket[paketKey] && dataPaket[paketKey][kategori]) ? dataPaket[paketKey][kategori] : {};

  var opts = '<option value="">-- Jenis --</option>';
  for (var j in jenisData) {
    opts += '<option value="' + j + '">' + j + '</option>';
  }
  jenisSel.innerHTML = opts;

  if (jenisSel.options.length > 1) {
    jenisSel.value = jenisSel.options[1].value;
    onJenisChange(jenisSel);
  }
}

function onJenisChange(el) {
  var card = el.closest('.item-card');
  var kategori = card.querySelector('.sel-kategori').value;
  var jenis = el.value;
  var paketKey = getPaketKey(selectedPaket);
  var harga = 0;
  
  if (dataPaket[paketKey] && dataPaket[paketKey][kategori] && dataPaket[paketKey][kategori][jenis]) {
    harga = dataPaket[paketKey][kategori][jenis];
  }

  card.querySelector('.inp-harga').value = harga;
  calcKilo(card.querySelector('.inp-kg'));
}

function calcKilo(el) {
  var card = el.closest('.item-card');
  var kg = parseFloat(el.value) || 0;
  var harga = parseFloat(card.querySelector('.inp-harga').value) || 0;
  card.querySelector('.inp-total').value = Math.round(kg * harga);
  hitungTotal();
}

function refreshAllKiloan() {
  var paketKey = getPaketKey(selectedPaket);
  var data = dataPaket[paketKey] || {};

  $$('#listKiloan .item-card').forEach(function(card) {
    var katSel = card.querySelector('.sel-kategori');
    var jenisSel = card.querySelector('.sel-jenis');
    var currentKat = katSel.value;
    var currentJenis = jenisSel.value;

    var katOpts = '<option value="">-- Kategori --</option>';
    for (var kat in data) {
      var sel = kat === currentKat ? 'selected' : '';
      katOpts += '<option value="' + kat + '" ' + sel + '>' + kat + '</option>';
    }
    katSel.innerHTML = katOpts;

    if (data[currentKat]) {
      var jenisOpts = '<option value="">-- Jenis --</option>';
      for (var j in data[currentKat]) {
        var sel2 = j === currentJenis ? 'selected' : '';
        jenisOpts += '<option value="' + j + '" ' + sel2 + '>' + j + '</option>';
      }
      jenisSel.innerHTML = jenisOpts;

      if (data[currentKat][currentJenis]) {
        card.querySelector('.inp-harga').value = data[currentKat][currentJenis];
        calcKilo(card.querySelector('.inp-kg'));
      }
    } else {
      jenisSel.innerHTML = '<option value="">-- Jenis --</option>';
      card.querySelector('.inp-harga').value = '';
      card.querySelector('.inp-total').value = '';
    }
  });
  
  hitungTotal();
}

// ================= SATUAN FUNCTIONS =================
function addSatuan() {
  var list = $('listSatuan');

  var opts = '<option value="">-- Pilih Jenis --</option>';
  for (var j in dataSatuan) {
    opts += '<option value="' + j + '">' + j + '</option>';
  }

  var card = document.createElement('div');
  card.className = 'item-card';
  card.innerHTML = 
    '<button type="button" class="btn-remove" onclick="removeItem(this)">×</button>' +
    '<div class="item-card-header">' +
      '<select class="sel-jenis-satuan" onchange="onSatuanChange(this)">' + opts + '</select>' +
    '</div>' +
    '<div class="item-card-body">' +
      '<div class="field">' +
        '<label>Qty</label>' +
        '<input type="number" class="inp-qty" inputmode="numeric" min="1" value="1" oninput="calcSatuan(this)">' +
      '</div>' +
      '<div class="field">' +
        '<label>Harga</label>' +
        '<input type="number" class="inp-harga-satuan" readonly>' +
      '</div>' +
      '<div class="field">' +
        '<label>Subtotal</label>' +
        '<input type="number" class="inp-total-satuan" readonly>' +
      '</div>' +
    '</div>';

  list.appendChild(card);
}

function onSatuanChange(el) {
  var card = el.closest('.item-card');
  var jenis = el.value;
  var harga = dataSatuan[jenis] || 0;

  card.querySelector('.inp-harga-satuan').value = harga;
  calcSatuan(card.querySelector('.inp-qty'));
}

function calcSatuan(el) {
  var card = el.closest('.item-card');
  var qty = parseInt(el.value) || 0;
  var harga = parseFloat(card.querySelector('.inp-harga-satuan').value) || 0;
  card.querySelector('.inp-total-satuan').value = Math.round(qty * harga);
  hitungTotal();
}

// ================= REMOVE ITEM =================
function removeItem(btn) {
  btn.closest('.item-card').remove();
  hitungTotal();
}

// ================= HITUNG TOTAL =================
function hitungTotal() {
  var subtotal = 0;

  $$('#listKiloan .inp-total').forEach(function(inp) {
    subtotal += parseFloat(inp.value) || 0;
  });

  $$('#listSatuan .inp-total-satuan').forEach(function(inp) {
    subtotal += parseFloat(inp.value) || 0;
  });

  var ongkir = parseFloat($('ongkir').value) || 0;
  var hutang = parseFloat($('hutangSebelumnya').value) || 0;
  var saldo = parseFloat($('saldo').value) || 0;

  var total = subtotal + ongkir + hutang;
  var sisa = total - saldo;

  $('total').value = total;
  $('sisa').value = sisa;

  $('displayTotal').textContent = 'Rp ' + formatRibuan(total);
  $('displaySisa').textContent = 'Rp ' + formatRibuan(Math.max(0, sisa));
}

// ================= BUAT NOTA (FORMAT STRUK 57MM - 32 CHAR) =================
function buatNota() {
  var nama = $('nama').value.trim();
  if (!nama) {
    $('nama').classList.add('shake');
    $('nama').focus();
    setTimeout(function() {
      $('nama').classList.remove('shake');
    }, 500);
    showAlert('error', 'Nama pelanggan wajib diisi!');
    return;
  }

  hitungTotal();

  var LINE = "--------------------------------";
  var lines = [];

  // === HEADER ===
  lines.push("        NUR LAUNDRY");
  lines.push("      Karangjati RT. 05");
  lines.push("     Telp 085878116420");
  lines.push(LINE);

  // === DATA PELANGGAN ===
  lines.push("Pelanggan  : " + nama);

  var kasir = $('kasir').value.trim();
  if (kasir) lines.push("Kasir      : " + kasir);

  var tglMasuk = $('tglMasuk').value;
  if (tglMasuk) lines.push("Tgl Masuk  : " + tglMasuk);

  var tglJadi = $('tglJadi').value;
  var jamJadi = $('jamJadi').value;
  if (tglJadi) {
    var estStr = tglJadi;
    if (selectedPaket === "KILAT-8J" && jamJadi) {
      estStr += " " + jamJadi;
    }
    lines.push("Est Selesai: " + estStr);
  }

  if (selectedPaket) lines.push("Paket      : " + selectedPaket);

  var alamat = $('alamat').value.trim();
  if (alamat) lines.push("Alamat/Telp: " + alamat);

  lines.push(LINE);

  // === KILOAN ===
  var hasKilo = false;
  var kiloItems = [];

  $$('#listKiloan .item-card').forEach(function(card) {
    var total = parseFloat(card.querySelector('.inp-total').value) || 0;
    if (total > 0) {
      hasKilo = true;
      var kategori = card.querySelector('.sel-kategori').value;
      var jenis = card.querySelector('.sel-jenis').value;
      var kg = card.querySelector('.inp-kg').value;
      var harga = parseFloat(card.querySelector('.inp-harga').value) || 0;
      kiloItems.push({ 
        kategori: kategori, 
        jenis: jenis, 
        kg: kg, 
        harga: harga, 
        total: total 
      });
    }
  });

  if (hasKilo) {
    lines.push("KILOAN");
    lines.push("Jenis       Kg   Harga   Total");

    var lastKat = "";
    kiloItems.forEach(function(item) {
      if (item.kategori && item.kategori !== lastKat) {
        lines.push("-" + item.kategori);
        lastKat = item.kategori;
      }
      
      var jenisStr = padEnd(item.jenis, 11);
      var kgStr = padEnd(item.kg + "kg", 5);
      var hargaStr = padEnd(formatRibuan(item.harga), 8);
      var totalStr = formatRibuan(item.total);
      lines.push(jenisStr + kgStr + hargaStr + totalStr);
    });

    lines.push(LINE);
  }

  // === SATUAN ===
  var hasSatuan = false;
  var satuanItems = [];

  $$('#listSatuan .item-card').forEach(function(card) {
    var total = parseFloat(card.querySelector('.inp-total-satuan').value) || 0;
    if (total > 0) {
      hasSatuan = true;
      var jenis = card.querySelector('.sel-jenis-satuan').value;
      var qty = card.querySelector('.inp-qty').value;
      var harga = parseFloat(card.querySelector('.inp-harga-satuan').value) || 0;
      satuanItems.push({ 
        jenis: jenis, 
        qty: qty, 
        harga: harga, 
        total: total 
      });
    }
  });

  if (hasSatuan) {
    lines.push("SATUAN");
    lines.push("Item        Pot Harga   Total");

    satuanItems.forEach(function(item) {
      var itemStr = padEnd(item.jenis, 12);
      var qtyStr = padEnd(item.qty, 4);
      var hargaStr = padEnd(formatRibuan(item.harga), 8);
      var totalStr = formatRibuan(item.total);
      lines.push(itemStr + qtyStr + hargaStr + totalStr);
    });

    lines.push(LINE);
  }

  // === BIAYA & PEMBAYARAN ===
  var ongkir = parseFloat($('ongkir').value) || 0;
  var hutang = parseFloat($('hutangSebelumnya').value) || 0;
  var saldo = parseFloat($('saldo').value) || 0;
  var total = parseFloat($('total').value) || 0;
  var sisa = parseFloat($('sisa').value) || 0;

  if (ongkir > 0) lines.push("Biaya Ongkir : " + formatRibuan(ongkir));
  if (hutang > 0) lines.push("BB Sebelumnya: " + formatRibuan(hutang));
  if (saldo > 0) lines.push("Saldo/DP     : " + formatRibuan(saldo));

  lines.push("Total Harga  : " + formatRibuan(total));

  if (sisa > 0) {
    lines.push("Kurang       : " + formatRibuan(sisa));
  } else if (saldo > 0) {
    lines.push("Status       : LUNAS");
  }

  var parfum = $('parfum').value;
  if (parfum) lines.push("Parfum       : " + parfum);

  var catatan = $('keterangan').value.trim();
  if (catatan) lines.push("Catatan      : " + catatan);

  // === FOOTER ===
  lines.push(LINE);
  lines.push("Setiap pengambilan dimohon");
  lines.push("disertai nota.");
  lines.push("Terimakasih");

  $('notatexs').value = lines.join('\n');

  $('sectionNota').classList.remove('collapsed');
  setTimeout(function() {
    $('sectionNota').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  showAlert('success', 'Nota berhasil dibuat!');
}

// ================= COPY NOTA =================
function copyNota() {
  var text = $('notatexs').value;
  if (!text.trim()) {
    showAlert('error', 'Buat nota terlebih dahulu!');
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(function() {
        showAlert('success', 'Nota berhasil di-copy!');
      })
      .catch(function() {
        fallbackCopy();
      });
  } else {
    fallbackCopy();
  }
}

function fallbackCopy() {
  var textarea = $('notatexs');
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  try {
    document.execCommand('copy');
    showAlert('success', 'Nota berhasil di-copy!');
  } catch (e) {
    showAlert('error', 'Gagal copy, silakan copy manual');
  }
}

// ================= SHARE NOTA =================
function shareNota() {
  var text = $('notatexs').value;
  if (!text.trim()) {
    showAlert('error', 'Buat nota terlebih dahulu!');
    return;
  }

  if (navigator.share) {
    navigator.share({
      title: 'Nota NUR LAUNDRY',
      text: text
    }).catch(function() {
      openWhatsApp(text);
    });
  } else {
    openWhatsApp(text);
  }
}

function openWhatsApp(text) {
  var waUrl = "https://wa.me/?text=" + encodeURIComponent(text);
  window.open(waUrl, '_blank');
}

// ================= RESET FORM =================
function resetForm() {
  if (!confirm('Reset semua data?')) return;

  ['nama', 'alamat', 'kasir', 'keterangan', 'ongkir', 'hutangSebelumnya', 'saldo'].forEach(function(id) {
    $(id).value = '';
  });

  $('parfum').value = '';
  $('notatexs').value = '';

  $('tglMasuk').value = new Date().toISOString().split('T')[0];
  $('jamJadi').value = '';
  $('jamJadi').classList.add('hidden');

  $('listKiloan').innerHTML = '';
  $('listSatuan').innerHTML = '';

  manualTanggal = false;
  var defaultBtn = document.querySelector('.paket-btn[data-paket="REGULER-2H"]');
  if (defaultBtn) selectPaket(defaultBtn);

  addKiloan();
  hitungTotal();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  showAlert('success', 'Form berhasil di-reset!');
}
