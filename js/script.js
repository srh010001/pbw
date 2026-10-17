/* ==================================================
   script.js - Logika Utama Aplikasi SITTA
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. AUTENTIKASI DAN LOGOUT
    // ==================================================

    /**
     * Memeriksa status login pengguna.
     * Pengguna yang belum login tidak boleh membuka halaman internal.
     */
    function checkAuth() {
        const isLoggedIn =
            sessionStorage.getItem('isLoggedIn') === 'true';

        const currentPage =
            window.location.pathname.split('/').pop();

        if (currentPage !== 'index.html' && !isLoggedIn) {
            window.location.href = 'index.html';
        } else if (currentPage === 'index.html' && isLoggedIn) {
            window.location.href = 'dashboard.html';
        }
    }

    // Periksa autentikasi ketika halaman dimuat.
    checkAuth();

    // Proses logout.
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('loggedInUser');

            alert('Anda telah berhasil logout.');
            window.location.href = 'index.html';
        });
    }


    // ==================================================
    // 2. LOGIN - index.html
    // ==================================================

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document
                .getElementById('email')
                .value.trim()
                .toLowerCase();

            const passwordInput = document
                .getElementById('password')
                .value;

            // Ambil akun tambahan dari localStorage.
            const penggunaTersimpan = JSON.parse(
                localStorage.getItem('dataPengguna') || '[]'
            );

            // Salin data pengguna bawaan dari data.js.
            const semuaPengguna = [...dataPengguna];

            // Gabungkan akun yang tersimpan tanpa duplikasi email.
            penggunaTersimpan.forEach((p) => {
                const sudahAda = semuaPengguna.some(
                    (u) =>
                        u.email.toLowerCase() ===
                        p.email.toLowerCase()
                );

                if (!sudahAda) {
                    semuaPengguna.push(p);
                }
            });

            // Cari akun berdasarkan email dan password.
            const user = semuaPengguna.find(
                (p) =>
                    p.email.toLowerCase() === emailInput &&
                    p.password === passwordInput
            );

            if (user) {
                // Simpan status login dan informasi pengguna.
                sessionStorage.setItem('isLoggedIn', 'true');

                sessionStorage.setItem(
                    'loggedInUser',
                    JSON.stringify(user)
                );

                alert(
                    `Login Berhasil! Selamat datang, ${user.nama}.`
                );

                window.location.href = 'dashboard.html';
            } else {
                alert('Email atau password yang Anda masukkan salah.');
            }
        });

        // ----------------------------------------------
        // Modal lupa password dan pendaftaran
        // ----------------------------------------------

        const forgotModal =
            document.getElementById('forgot-modal');

        const registerModal =
            document.getElementById('register-modal');

        const forgotBtn =
            document.getElementById('forgot-password-btn');

        const registerBtn =
            document.getElementById('register-btn');

        const closeBtns =
            document.querySelectorAll('.close-btn');

        // Buka modal lupa password.
        if (forgotBtn && forgotModal) {
            forgotBtn.addEventListener('click', () => {
                forgotModal.style.display = 'block';
            });
        }

        // Buka modal pendaftaran.
        if (registerBtn && registerModal) {
            registerBtn.addEventListener('click', () => {
                registerModal.style.display = 'block';
            });
        }

        // Tutup modal melalui tombol tutup.
        closeBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                const modal = document.getElementById(modalId);

                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Tutup modal ketika area di luar modal diklik.
        window.addEventListener('click', (event) => {
            if (event.target === forgotModal) {
                forgotModal.style.display = 'none';
            }

            if (event.target === registerModal) {
                registerModal.style.display = 'none';
            }
        });
    }


    // ==================================================
    // 3. PENDAFTARAN AKUN DAN PENYIMPANAN
    // ==================================================

    const registerForm =
        document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ambil data dari formulir pendaftaran.
            const nama = document
                .getElementById('register-nama')
                .value.trim();

            const role = document
                .getElementById('register-role')
                .value.trim();

            const lokasi = document
                .getElementById('register-lokasi')
                .value.trim();

            const email = document
                .getElementById('register-email')
                .value.trim()
                .toLowerCase();

            const password = document
                .getElementById('register-password')
                .value;

            const konfirmasi = document
                .getElementById('register-konfirmasi')
                .value;

            // Validasi password: minimal 8 karakter,
            // mengandung setidaknya satu huruf dan satu angka.
            const polaPassword =
                /^(?=.*[A-Za-z])(?=.*[0-9]).{8,}$/;

            if (!polaPassword.test(password)) {
                alert(
                    'Password minimal 8 karakter dan harus ' +
                    'mengandung huruf serta angka!'
                );
                return;
            }

            // Periksa kecocokan password.
            if (password !== konfirmasi) {
                alert('Konfirmasi password tidak cocok!');
                return;
            }

            // Ambil akun yang tersimpan di localStorage.
            const penggunaTersimpan = JSON.parse(
                localStorage.getItem('dataPengguna') || '[]'
            );

            // Gabungkan data pengguna bawaan dan akun tersimpan.
            const semuaPengguna = [...dataPengguna];

            penggunaTersimpan.forEach((p) => {
                const sudahAda = semuaPengguna.some(
                    (u) =>
                        u.email.toLowerCase() ===
                        p.email.toLowerCase()
                );

                if (!sudahAda) {
                    semuaPengguna.push(p);
                }
            });

            // Periksa apakah email sudah digunakan.
            const emailAda = semuaPengguna.some(
                (p) => p.email.toLowerCase() === email
            );

            if (emailAda) {
                alert(
                    'Email sudah terdaftar. Gunakan email lain.'
                );
                return;
            }

            // Buat objek akun baru.
            const penggunaBaru = {
                id: Date.now(),
                nama: nama,
                email: email,
                password: password,
                role: role,
                lokasi: lokasi
            };

            // Tambahkan akun baru ke daftar pengguna.
            semuaPengguna.push(penggunaBaru);

            // Simpan seluruh data pengguna ke localStorage.
            localStorage.setItem(
                'dataPengguna',
                JSON.stringify(semuaPengguna)
            );

            alert(
                `Pendaftaran berhasil! Akun ${nama} telah tersimpan. ` +
                'Silakan login.'
            );

            // Kosongkan formulir setelah berhasil.
            registerForm.reset();

            // Tutup modal pendaftaran.
            const modal =
                document.getElementById('register-modal');

            if (modal) {
                modal.style.display = 'none';
            }
        });
    }


    // ==================================================
    // 4. DASHBOARD - INFORMASI PENGGUNA
    // ==================================================

    const greetingMessage =
        document.getElementById('greeting-message');

    const userInfo =
        document.getElementById('user-info');

    if (greetingMessage && userInfo) {
        // Ambil data pengguna yang sedang login.
        const user = JSON.parse(
            sessionStorage.getItem('loggedInUser') || 'null'
        );

        // Tentukan ucapan berdasarkan waktu.
        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) {
            greeting = 'Selamat pagi';
        } else if (hour < 15) {
            greeting = 'Selamat siang';
        } else if (hour < 18) {
            greeting = 'Selamat sore';
        } else {
            greeting = 'Selamat malam';
        }

        // Tampilkan ucapan dan nama pengguna.
        greetingMessage.textContent = user
            ? `${greeting}, ${user.nama}`
            : `${greeting}, Pengguna`;

        // Format ini dipertahankan sesuai permintaan.
        userInfo.textContent = user
            ? `${user.nama} (${user.role} - ${user.lokasi})`
            : 'Pengguna SITTA';
    }


    // ==================================================
    // 5. TRACKING PENGIRIMAN - tracking.html
    // ==================================================

    const trackingForm =
        document.getElementById('tracking-form');

    const trackingResult =
        document.getElementById('tracking-result');

    if (trackingForm) {
        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nomorDO = document
                .getElementById('nomor-do')
                .value.trim();

            // Cari data pengiriman berdasarkan nomor DO.
            const data = dataTracking[nomorDO];

            if (data) {
                // Tampilkan informasi penerima dan pengiriman.
                document.getElementById(
                    'nama-penerima'
                ).textContent = `Nama Penerima: ${data.nama}`;

                document.getElementById(
                    'nomor-do-display'
                ).textContent = data.nomorDO;

                const statusElement = document.getElementById(
                    'status-pengiriman'
                );

                statusElement.textContent = data.status;

                statusElement.className =
                    `status-badge ${data.status.replace(/\s/g, '')}`;

                document.getElementById(
                    'ekspedisi-detail'
                ).textContent = data.ekspedisi;

                document.getElementById(
                    'tanggal-kirim-detail'
                ).textContent = data.tanggalKirim;

                document.getElementById(
                    'paket-detail'
                ).textContent = data.paket;

                document.getElementById(
                    'total-detail'
                ).textContent = data.total;

                // Tampilkan riwayat perjalanan paket.
                const perjalananList =
                    document.getElementById('perjalanan-list');

                perjalananList.innerHTML = '';

                // Urutkan agar perjalanan terbaru tampil lebih dahulu.
                const sortedPerjalanan =
                    [...data.perjalanan].reverse();

                sortedPerjalanan.forEach((p) => {
                    const li = document.createElement('li');

                    li.innerHTML =
                        `<strong>${p.waktu}</strong>: ${p.keterangan}`;

                    perjalananList.appendChild(li);
                });

                trackingResult.style.display = 'block';
            } else {
                // Tampilkan pesan jika nomor DO tidak ditemukan.
                trackingResult.style.display = 'none';

                alert(
                    `Nomor DO ${nomorDO} tidak ditemukan ` +
                    'dalam sistem tracking.'
                );
            }
        });
    }


    // ==================================================
    // 6. STOK BAHAN AJAR - stok.html
    // ==================================================

    const stokTableBody =
        document.getElementById('stok-table-body');

    const addStockBtn =
        document.getElementById('add-stock-btn');

    const addStockFormSection =
        document.getElementById('add-stock-form-section');

    const newStockForm =
        document.getElementById('new-stock-form');

    const cancelAddBtn =
        document.getElementById('cancel-add-btn');


    /**
     * Menampilkan dataBahanAjar ke dalam tabel stok.
     */
    function renderStokTable() {
        if (!stokTableBody) return;

        // Kosongkan isi tabel sebelum menampilkan data terbaru.
        stokTableBody.innerHTML = '';

        dataBahanAjar.forEach((item, index) => {
            const row = stokTableBody.insertRow();

            // Kolom cover bahan ajar.
            const cellCover = row.insertCell();

            cellCover.innerHTML =
                `<img src="${item.cover}" ` +
                `alt="Cover ${item.namaBarang}" ` +
                `onerror="this.onerror=null;this.src='assets/placeholder.jpg';" ` +
                `title="${item.namaBarang}">`;

            // Kolom informasi bahan ajar.
            row.insertCell().textContent = item.kodeLokasi;
            row.insertCell().textContent = item.kodeBarang;
            row.insertCell().textContent = item.namaBarang;
            row.insertCell().textContent = item.jenisBarang;
            row.insertCell().textContent = item.edisi;

            // Kolom jumlah stok.
            const cellStok = row.insertCell();
            cellStok.textContent = item.stok;

            // Beri tanda jika stok kurang dari 200.
            if (item.stok < 200) {
                cellStok.style.backgroundColor = '#ffdddd';
                cellStok.style.fontWeight = 'bold';
            }

            // Kolom aksi untuk mengedit bahan ajar.
            const cellAksi = row.insertCell();

            const editButton =
                document.createElement('button');

            editButton.textContent = 'Edit';
            editButton.className = 'primary-button';
            editButton.style.padding = '8px 12px';
            editButton.style.fontSize = '0.9em';
            editButton.style.marginRight = '5px';

            editButton.setAttribute('data-index', index);

            editButton.addEventListener('click', (e) => {
                const itemIndex = parseInt(
                    e.currentTarget.getAttribute('data-index'),
                    10
                );

                openEditModal(itemIndex);
            });

            cellAksi.appendChild(editButton);
        });
    }

    // Tampilkan tabel stok jika elemen tersedia.
    if (stokTableBody) {
        renderStokTable();
    }


    // ==================================================
    // 7. EDIT BAHAN AJAR
    // ==================================================

    /**
     * Membuka modal edit dan mengisi formulir
     * dengan data bahan ajar yang dipilih.
     *
     * @param {number} index Indeks bahan ajar.
     */
    function openEditModal(index) {
        const item = dataBahanAjar[index];

        if (!item) return;

        document.getElementById('editIndex').value = index;

        document.getElementById(
            'editKodeLokasi'
        ).value = item.kodeLokasi;

        document.getElementById(
            'editKodeBarang'
        ).value = item.kodeBarang;

        document.getElementById(
            'editNamaBarang'
        ).value = item.namaBarang;

        document.getElementById(
            'editJenisBarang'
        ).value = item.jenisBarang;

        document.getElementById(
            'editEdisi'
        ).value = item.edisi;

        document.getElementById(
            'editStok'
        ).value = item.stok;

        document.getElementById(
            'edit-stock-modal'
        ).style.display = 'block';
    }


    // Tutup modal edit.
    const closeEditModalBtn =
        document.getElementById('close-edit-modal');

    if (closeEditModalBtn) {
        closeEditModalBtn.addEventListener('click', () => {
            document.getElementById(
                'edit-stock-modal'
            ).style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            const modal =
                document.getElementById('edit-stock-modal');

            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }


    // Proses penyimpanan perubahan bahan ajar.
    const editStockForm =
        document.getElementById('edit-stock-form');

    if (editStockForm) {
        editStockForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const index = Number(
                document.getElementById('editIndex').value
            );

            const item = dataBahanAjar[index];

            if (!item) {
                alert('Data bahan ajar tidak ditemukan.');
                return;
            }

            item.kodeLokasi = document
                .getElementById('editKodeLokasi')
                .value.toUpperCase();

            item.kodeBarang = document
                .getElementById('editKodeBarang')
                .value.toUpperCase();

            item.namaBarang = document
                .getElementById('editNamaBarang')
                .value.trim();

            item.jenisBarang = document
                .getElementById('editJenisBarang')
                .value.toUpperCase();

            item.edisi = document
                .getElementById('editEdisi')
                .value;

            item.stok = parseInt(
                document.getElementById('editStok').value,
                10
            );

            const fileInput =
                document.getElementById('editCover');

            // Perbarui tampilan setelah perubahan selesai.
            const processEditSubmit = () => {
                renderStokTable();

                document.getElementById(
                    'edit-stock-modal'
                ).style.display = 'none';

                alert(
                    `Bahan Ajar "${item.namaBarang}" ` +
                    'berhasil diperbarui!'
                );
            };

            // Jika pengguna mengunggah cover baru.
            if (
                fileInput &&
                fileInput.files &&
                fileInput.files[0]
            ) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    item.cover = event.target.result;
                    processEditSubmit();
                };

                reader.readAsDataURL(fileInput.files[0]);
            } else {
                // Pertahankan cover lama jika tidak diganti.
                processEditSubmit();
            }
        });
    }


    // ==================================================
    // 8. TAMBAH STOK BARU
    // ==================================================

    // Tampilkan formulir tambah stok.
    if (addStockBtn) {
        addStockBtn.addEventListener('click', () => {
            if (addStockFormSection) {
                addStockFormSection.style.display = 'block';
            }

            addStockBtn.style.display = 'none';
        });
    }

    // Batalkan penambahan stok.
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', () => {
            if (addStockFormSection) {
                addStockFormSection.style.display = 'none';
            }

            if (addStockBtn) {
                addStockBtn.style.display = 'block';
            }

            if (newStockForm) {
                newStockForm.reset();
            }
        });
    }


    // Proses formulir tambah stok baru.
    if (newStockForm) {
        newStockForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const namaBarangInput = document
                .getElementById('namaBarangNew')
                .value.trim();

            const fileInput =
                document.getElementById('coverNew');

            // Membuat objek bahan ajar baru.
            const processSubmit = (coverUrl) => {
                const newStock = {
                    kodeLokasi: document
                        .getElementById('kodeLokasiNew')
                        .value.toUpperCase(),

                    kodeBarang: document
                        .getElementById('kodeBarangNew')
                        .value.toUpperCase(),

                    namaBarang: namaBarangInput,

                    jenisBarang: document
                        .getElementById('jenisBarangNew')
                        .value.toUpperCase(),

                    edisi: document
                        .getElementById('edisiNew')
                        .value,

                    stok: parseInt(
                        document.getElementById('stokNew').value,
                        10
                    ),

                    cover: coverUrl
                };

                // Tambahkan data ke tabel.
                dataBahanAjar.push(newStock);
                renderStokTable();

                // Reset formulir dan tampilkan tombol tambah.
                newStockForm.reset();

                if (addStockFormSection) {
                    addStockFormSection.style.display = 'none';
                }

                if (addStockBtn) {
                    addStockBtn.style.display = 'block';
                }

                alert(
                    `Bahan Ajar "${newStock.namaBarang}" ` +
                    'berhasil ditambahkan!'
                );
            };

            // Baca file cover jika pengguna memilih gambar.
            if (
                fileInput &&
                fileInput.files &&
                fileInput.files[0]
            ) {
                const reader = new FileReader();

                reader.onload = (event) => {
                    processSubmit(event.target.result);
                };

                reader.readAsDataURL(fileInput.files[0]);
            } else {
                // Buat jalur gambar otomatis jika tidak ada unggahan.
                const generatedCoverPath =
                    'assets/' +
                    namaBarangInput
                        .toLowerCase()
                        .replace(/\s/g, '_')
                        .replace(/[^a-z0-9_]/g, '') +
                    '.jpg';

                processSubmit(generatedCoverPath);
            }
        });
    }

});