// ===== 1. Ambil elemen =====
const form = document.querySelector('#formDaftar');
const fields = form.querySelectorAll('input');
const password = document.querySelector('#password');
const repassword = document.querySelector('#repassword');
const tanggal = document.querySelector('#tanggal');
const tanggalLahir = document.querySelector('#tanggalLahir');
const statusForm = document.querySelector('#statusForm');

// ===== 2. Daftar pesan error =====
const pesan = {
  nama:         { kosong: 'Nama wajib diisi.', pendek: 'Nama minimal 3 huruf.' },
  email:        { kosong: 'Email wajib diisi.', format: 'Format email belum benar. Contoh: nama@domain.com' },
  password:     { kosong: 'Password wajib diisi.', pendek: 'Password minimal 8 karakter.' },
  repassword:   { kosong: 'Ketik ulang password kamu.', beda: 'Konfirmasi belum sama dengan password.' },
  hp:           { kosong: 'Nomor WhatsApp wajib diisi.', format: 'Nomor diawali 08 dan terdiri dari 10–13 digit.' },
  tanggal:      { kosong: 'Pilih tanggal kehadiran.', lampau: 'Tanggal paling cepat hari ini.' },
  tanggalLahir: { kosong: 'Tanggal lahir wajib diisi.', muda: 'Usia minimal 20 tahun.' },
};

// ===== 3. Tampilkan dan hapus error =====
function showError(input, teks) {
  input.classList.add('is-invalid');           // tampilan merah Bootstrap
  input.setAttribute('aria-invalid', 'true');
  input.dataset.pernahError = 'true';          // flag: field ini pernah error
  document.getElementById(input.id + '-error').textContent = teks;
  return false;
}

function clearError(input) {
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  document.getElementById(input.id + '-error').textContent = '';
  return true;
}

// ===== 4. Pengecekan field =====
function cekField(input) {
  const v = input.validity;
  const p = pesan[input.id];

  if (input.value.trim() === '') return showError(input, p.kosong);
  if (v.tooShort) return showError(input, p.pendek);
  if (v.typeMismatch || v.patternMismatch) return showError(input, p.format);
  if (v.rangeUnderflow) return showError(input, p.lampau);
  if (v.rangeOverflow) return showError(input, p.muda);
  if (input.id === 'repassword' && input.value !== password.value) {
    return showError(input, p.beda);
  }
  return clearError(input);
}

function semuaFieldValid() {
  let valid = true;
  for (const input of fields) {
    if (!cekField(input)) valid = false;
  }
  return valid;
}

// ===== 5. Batas tanggal =====
function formatTanggal(d) {
  const bulan = String(d.getMonth() + 1).padStart(2, '0');
  const tgl = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + bulan + '-' + tgl;
}

const sekarang = new Date();

// Tanggal kehadiran
tanggal.min = formatTanggal(sekarang);

// Tanggal lahir
const batasLahir = new Date(sekarang.getFullYear() - 20, sekarang.getMonth(), sekarang.getDate());
tanggalLahir.max = formatTanggal(batasLahir);

// ===== 6. Event: saat pindah field dan saat mengetik =====
function saatBlur(event) {
  cekField(event.target);
}

function saatInput(event) {
  const input = event.target;
  if (input.dataset.pernahError) cekField(input);
  if (input === password && repassword.dataset.pernahError) cekField(repassword);
}

for (const input of fields) {
  input.addEventListener('blur', saatBlur);
  input.addEventListener('input', saatInput);
}

// ===== 7. Event: saat form dikirim =====
function saatSubmit(event) {
  event.preventDefault();
  statusForm.className = '';        // sembunyikan pesan sukses sebelumnya
  statusForm.textContent = '';

  if (!semuaFieldValid()) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  statusForm.textContent = 'Pendaftaran berhasil! Sampai jumpa di workshop.';
  statusForm.className = 'alert alert-success mt-3';
  form.reset();

  for (const input of fields) {
    delete input.dataset.pernahError;   // mulai bersih untuk isian berikutnya
  }
}

form.addEventListener('submit', saatSubmit);