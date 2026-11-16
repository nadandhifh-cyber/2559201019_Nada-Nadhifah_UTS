// Penanda bahwa JavaScript aktif (dipakai CSS untuk menu hamburger)
document.documentElement.classList.add("js");

// 1. Menu hamburger (bonus 3 poin)
const tombolMenu = document.getElementById("tombolMenu");
const menuUtama = document.getElementById("menuUtama");
if (tombolMenu && menuUtama) {
  tombolMenu.hidden = false;
  tombolMenu.addEventListener("click", function () {
    const terbuka = menuUtama.classList.toggle("buka");
    tombolMenu.setAttribute("aria-expanded", terbuka);
  });
}

// 2. Validasi formulir tambahan (bonus 3 poin)
const form = document.getElementById("formKontak");
if (form) {
  form.noValidate = true; // pesan kesalahan kita tampilkan sendiri
  const sukses = document.getElementById("sukses");

  function pesanGalat(el) {
    const v = el.validity;
    if (v.valueMissing) return "Kolom ini wajib diisi.";
    if (v.typeMismatch) return "Format email belum benar, contoh: nama@email.com.";
    if (v.patternMismatch) return "Isi nomor HP dengan 10 sampai 13 angka.";
    if (v.tooShort) return "Pesan minimal " + el.minLength + " karakter.";
    return "";
  }

  function cek(el) {
    const teks = pesanGalat(el);
    document.getElementById("galat-" + el.id).textContent = teks;
    el.setAttribute("aria-invalid", teks !== "");
    return teks === "";
  }

  const kolom = form.querySelectorAll("input, select, textarea");
  kolom.forEach(function (el) {
    el.addEventListener("blur", function () { cek(el); });
    el.addEventListener("input", function () {
      if (el.getAttribute("aria-invalid") === "true") cek(el);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;
    kolom.forEach(function (el) { if (!cek(el)) valid = false; });
    sukses.hidden = !valid;
    if (valid) form.reset();
  });
}

// 3. Fitur dinamis katalog: cari, filter, urut (bonus 4 poin)
const daftar = document.getElementById("daftarMenu");
if (daftar) {
  const menu = [
    { gambar: "kopi-susu", nama: "Kopi Susu Ndip", deskripsi: "Espresso, susu segar, dan gula aren dalam satu gelas.", harga: 18000, kategori: "minuman", alt: "Segelas kopi susu gula aren dengan es" },
    { gambar: "americano", nama: "Americano", deskripsi: "Espresso double dengan air panas, tanpa gula.", harga: 15000, kategori: "minuman", alt: "Secangkir americano panas" },
    { gambar: "roti-bakar", nama: "Roti Bakar Coklat Keju", deskripsi: "Roti tebal dibakar dengan coklat dan keju.", harga: 14000, kategori: "makanan", alt: "Roti bakar dengan topping coklat dan keju" },
    { gambar: "nasi-goreng", nama: "Nasi Goreng Ndip", deskripsi: "Nasi goreng kampung dengan telur dan kerupuk.", harga: 25000, kategori: "makanan", alt: "Sepiring nasi goreng dengan telur mata sapi" },
    { gambar: "es-teh", nama: "Es Teh Manis", deskripsi: "Teh seduh segar dengan gula secukupnya.", harga: 4000, kategori: "minuman", alt: "Segelas es teh manis" },
    { gambar: "kentang", nama: "Kentang Goreng", deskripsi: "Kentang goreng renyah dengan saus sambal.", harga: 12000, kategori: "makanan", alt: "Semangkuk kentang goreng" }
  ];

  const filter = document.getElementById("filter");
  const inputCari = document.getElementById("cari");
  const pilihKategori = document.getElementById("kategori");
  const pilihUrut = document.getElementById("urut");
  const kosong = document.getElementById("kosong");
  filter.hidden = false;

  function rupiah(angka) { return "Rp" + angka.toLocaleString("id-ID"); }

  function buatKartu(item) {
    const kartu = document.createElement("article");
    kartu.className = "kartu";
    kartu.innerHTML =
      '<img src="img/' + item.gambar + '.svg" alt="' + item.alt + '" width="640" height="420">' +
      '<div class="kartu-isi"><h3>' + item.nama + "</h3><p>" + item.deskripsi +
      '</p><p class="harga">' + rupiah(item.harga) + "</p></div>";
    return kartu;
  }

  function tampilkan() {
    const kata = inputCari.value.trim().toLowerCase();
    let hasil = menu.filter(function (m) {
      const cocokNama = m.nama.toLowerCase().includes(kata);
      const cocokKategori = pilihKategori.value === "semua" || m.kategori === pilihKategori.value;
      return cocokNama && cocokKategori;
    });
    if (pilihUrut.value === "murah") hasil.sort(function (a, b) { return a.harga - b.harga; });
    if (pilihUrut.value === "mahal") hasil.sort(function (a, b) { return b.harga - a.harga; });

    daftar.innerHTML = "";
    hasil.forEach(function (m) { daftar.appendChild(buatKartu(m)); });
    kosong.hidden = hasil.length > 0;
  }

  inputCari.addEventListener("input", tampilkan);
  pilihKategori.addEventListener("change", tampilkan);
  pilihUrut.addEventListener("change", tampilkan);
  tampilkan();
}
