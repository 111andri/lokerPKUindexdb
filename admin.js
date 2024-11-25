// Fungsi untuk menampilkan section yang dipilih
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        section.classList.add("hidden"); // Sembunyikan semua section
    });
    document.getElementById(sectionId).classList.remove("hidden"); // Tampilkan section yang dipilih
}

// Fungsi untuk menambahkan perusahaan
function addPerusahaan() {
    const namaPerusahaan =
        document.getElementById("namaPerusahaan").value;
    const industri = document.getElementById("industri").value;
    const deskripsi = document.getElementById("deskripsi").value;
    const alamat = document.getElementById("alamat").value;

    if (namaPerusahaan && industri && deskripsi && alamat) {
        const newPerusahaan = {
            id_perusahaan: Date.now(), // Menggunakan timestamp sebagai ID sementara
            nama_perusahaan: namaPerusahaan,
            industri: industri,
            deskripsi: deskripsi,
            alamat: alamat,
        };

        const transaction = db.transaction(
            ["perusahaan"],
            "readwrite"
        );
        const perusahaanStore =
            transaction.objectStore("perusahaan");
        const request = perusahaanStore.add(newPerusahaan);

        request.onsuccess = function () {
            alert("Perusahaan berhasil ditambahkan.");
            clearForm(); // Kosongkan form setelah berhasil menambah
            displayPerusahaanData(); // Tampilkan data setelah penambahan
            populatePerusahaanSelect(); // Perbarui select perusahaan
        };

        request.onerror = function () {
            alert("Terjadi kesalahan saat menambahkan perusahaan.");
        };
    } else {
        alert("Silakan lengkapi semua field.");
    }
}

// Fungsi untuk mengosongkan form
function clearForm() {
    document.getElementById("namaPerusahaan").value = "";
    document.getElementById("industri").value = "";
    document.getElementById("deskripsi").value = "";
    document.getElementById("alamat").value = "";
    document.getElementById("judulLowongan").value = "";
    document.getElementById("lokasi").value = "";
    document.getElementById("selectPerusahaan").value = "";
}



// Fungsi untuk menampilkan data perusahaan dari IndexedDB
function displayPerusahaanData() {
    const perusahaanTableBody = document
        .getElementById("perusahaanTable")
        .getElementsByTagName("tbody")[0];
    perusahaanTableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan data

    const transaction = db.transaction(["perusahaan"], "readonly");
    const perusahaanStore = transaction.objectStore("perusahaan");
    const request = perusahaanStore.getAll();

    request.onsuccess = function (event) {
        const perusahaanData = event.target.result;
        perusahaanData.forEach((perusahaan) => {
            const row = perusahaanTableBody.insertRow();
            row.insertCell(0).innerText = perusahaan.id_perusahaan;
            row.insertCell(1).innerText =
                perusahaan.nama_perusahaan;
            row.insertCell(2).innerText = perusahaan.industri;
            row.insertCell(3).innerText = perusahaan.deskripsi;
            row.insertCell(4).innerText = perusahaan.alamat;
            row.insertCell(
                5
            ).innerHTML = `
            <button class="button" onclick="openEditPerusahaanModal(${perusahaan.id_perusahaan})">Edit</button>
            <button class="button" onclick="deletePerusahaan(${perusahaan.id_perusahaan})">Hapus</button>`;
        });
    };
}

function openEditPerusahaanModal(id) {
const transaction = db.transaction(["perusahaan"], "readonly");
const perusahaanStore = transaction.objectStore("perusahaan");
const request = perusahaanStore.get(id);

request.onsuccess = function (event) {
const perusahaan = event.target.result;
if (perusahaan) {
document.getElementById("editIdPerusahaan").value = perusahaan.id_perusahaan;
document.getElementById("editNamaPerusahaan").value = perusahaan.nama_perusahaan;
document.getElementById("editIndustri").value = perusahaan.industri;
document.getElementById("editDeskripsi").value = perusahaan.deskripsi;
document.getElementById("editAlamat").value = perusahaan.alamat;
document.getElementById("editPerusahaanModal").style.display = "block";
} else {
alert("Perusahaan tidak ditemukan.");
}
};

request.onerror = function () {
alert("Terjadi kesalahan saat mengambil data perusahaan.");
};
}

function closeEditPerusahaanModal() {
document.getElementById("editPerusahaanModal").style.display = "none";
}

function updatePerusahaan() {
const id = parseInt(document.getElementById("editIdPerusahaan").value);
const namaPerusahaan = document.getElementById("editNamaPerusahaan").value;
const industri = document.getElementById("editIndustri").value;
const deskripsi = document.getElementById("editDeskripsi").value;
const alamat = document.getElementById("editAlamat").value;

const updatedPerusahaan = {
id_perusahaan: id,
nama_perusahaan: namaPerusahaan,
industri: industri,
deskripsi: deskripsi,
alamat: alamat,
};

const transaction = db.transaction(["perusahaan"], "readwrite");
const perusahaanStore = transaction.objectStore("perusahaan");
const request = perusahaanStore.put(updatedPerusahaan);

request.onsuccess = function () {
alert("Perusahaan berhasil diperbarui.");
closeEditPerusahaanModal();
displayPerusahaanData(); // Perbarui tampilan data perusahaan
};

request.onerror = function () {
alert("Terjadi kesalahan saat memperbarui perusahaan.");
};
}

// Fungsi untuk menghapus perusahaan
function deletePerusahaan(id) {
if (confirm("Apakah Anda yakin ingin menghapus perusahaan ini?")) {
const transaction = db.transaction(["perusahaan"], "readwrite");
const perusahaanStore = transaction.objectStore("perusahaan");
const request = perusahaanStore.delete(id);

request.onsuccess = function () {
alert("Perusahaan berhasil dihapus.");
displayPerusahaanData(); // Tampilkan data setelah penghapusan
populatePerusahaanSelect(); // Perbarui select perusahaan
};

request.onerror = function () {
alert("Terjadi kesalahan saat menghapus perusahaan.");
};
}
}


// Fungsi untuk mengisi elemen select dengan data perusahaan
function populatePerusahaanSelect() {
    const selectPerusahaan =
        document.getElementById("selectPerusahaan");
    selectPerusahaan.innerHTML =
        '<option value="">Pilih Perusahaan</option>'; // Reset select

    const transaction = db.transaction(["perusahaan"], "readonly");
    const perusahaanStore = transaction.objectStore("perusahaan");
    const request = perusahaanStore.getAll();

    request.onsuccess = function (event) {
        const perusahaanData = event.target.result;
        perusahaanData.forEach((perusahaan) => {
            const option = document.createElement("option");
            option.value = perusahaan.id_perusahaan;
            option.textContent = perusahaan.nama_perusahaan;
            selectPerusahaan.appendChild(option);
        });
    };
}

// Fungsi untuk menambahkan lowongan
function addLowongan() {
    const idPerusahaan =
        document.getElementById("selectPerusahaan").value;
    const judulLowongan =
        document.getElementById("judulLowongan").value;
    const lokasi = document.getElementById("lokasi").value;

    if (idPerusahaan && judulLowongan && lokasi) {
        const newLowongan = {
            id_lowongan: Date.now(), // Menggunakan timestamp sebagai ID sementara
            id_perusahaan: idPerusahaan,
            judul: judulLowongan,
            lokasi: lokasi,
        };

        const transaction = db.transaction(
            ["lowongan"],
            "readwrite"
        );
        const lowonganStore = transaction.objectStore("lowongan");
        const request = lowonganStore.add(newLowongan);

        request.onsuccess = function () {
            alert("Lowongan berhasil ditambahkan.");
            clearForm(); // Kosongkan form setelah berhasil menambah
            displayLowonganData(); // Tampilkan data setelah penambahan
        };

        request.onerror = function () {
            alert("Terjadi kesalahan saat menambahkan lowongan.");
        };
    } else {
        alert("Silakan lengkapi semua field.");
    }
}

// Fungsi untuk menampilkan data lowongan dari IndexedDB
function displayLowonganData() {
const lowonganTableBody = document.getElementById("lowonganTable").getElementsByTagName("tbody")[0];
lowonganTableBody.innerHTML = "";

const transaction = db.transaction(["lowongan"], "readonly");
const lowonganStore = transaction.objectStore("lowongan");
const request = lowonganStore.getAll();

request.onsuccess = function(event) {
const lowonganData = event.target.result;

// Get all companies for reference
const perusahaanTransaction = db.transaction(["perusahaan"], "readonly");
const perusahaanStore = perusahaanTransaction.objectStore("perusahaan");
const perusahaanRequest = perusahaanStore.getAll();

perusahaanRequest.onsuccess = function(event) {
const perusahaanData = event.target.result;
const perusahaanMap = {};

perusahaanData.forEach(perusahaan => {
    perusahaanMap[perusahaan.id_perusahaan] = perusahaan.nama_perusahaan;
});

lowonganData.forEach(lowongan => {
    const row = lowonganTableBody.insertRow();
    row.insertCell(0).innerText = lowongan.id_lowongan;
    row.insertCell(1).innerText = lowongan.judul;
    row.insertCell(2).innerText = perusahaanMap[lowongan.id_perusahaan] || "Tidak Diketahui";
    row.insertCell(3).innerText = lowongan.lokasi;
    row.insertCell(4).innerHTML = `
        <button class="button" onclick="editLowongan(${lowongan.id_lowongan})">Edit</button>
        <button class="button" onclick="deleteLowongan(${lowongan.id_lowongan})">Hapus</button>
    `;
});
};
};
}


// Function to open edit modal and populate data
function editLowongan(id) {
const transaction = db.transaction(["lowongan", "perusahaan"], "readonly");
const lowonganStore = transaction.objectStore("lowongan");
const perusahaanStore = transaction.objectStore("perusahaan");

const request = lowonganStore.get(id);

request.onsuccess = function(event) {
const lowongan = event.target.result;
if (lowongan) {
// Get company details
const perusahaanRequest = perusahaanStore.get(parseInt(lowongan.id_perusahaan));
perusahaanRequest.onsuccess = function(event) {
    const perusahaan = event.target.result;
    
    // Populate form fields
    document.getElementById("editLowonganId").value = lowongan.id_lowongan;
    document.getElementById("editPerusahaan").value = perusahaan ? perusahaan.nama_perusahaan : "";
    document.getElementById("editJudulLowongan").value = lowongan.judul;
    document.getElementById("editLokasi").value = lowongan.lokasi;
    
    // Show modal
    document.getElementById("editLowonganModal").classList.add("show");
};
}
};
}

// Function to handle form submission
document.getElementById("editLowonganForm").onsubmit = function(e) {
e.preventDefault();

const id = parseInt(document.getElementById("editLowonganId").value);
const judulLowongan = document.getElementById("editJudulLowongan").value;

const transaction = db.transaction(["lowongan"], "readwrite");
const lowonganStore = transaction.objectStore("lowongan");
const request = lowonganStore.get(id);

request.onsuccess = function(event) {
const lowongan = event.target.result;
if (lowongan) {
lowongan.judul = judulLowongan;

const updateRequest = lowonganStore.put(lowongan);

updateRequest.onsuccess = function() {
    alert("Lowongan berhasil diperbarui");
    closeEditModal();
    displayLowonganData();
};

updateRequest.onerror = function() {
    alert("Terjadi kesalahan saat memperbarui lowongan");
};
}
};
};

// Function to close modal
function closeEditModal() {
document.getElementById("editLowonganModal").classList.remove("show");
}

// Close modal when clicking on X or outside the modal
document.querySelector(".close").onclick = closeEditModal;
window.onclick = function(event) {
const modal = document.getElementById("editLowonganModal");
if (event.target == modal) {
closeEditModal();
}
};

// Fungsi untuk menghapus lowongan
function deleteLowongan(id) {
if (confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) {
const transaction = db.transaction(["lowongan"], "readwrite");
const lowonganStore = transaction.objectStore("lowongan");
const request = lowonganStore.delete(id);

request.onsuccess = function () {
alert("Lowongan berhasil dihapus.");
displayLowonganData(); // Tampilkan data setelah penghapusan
};

request.onerror = function () {
alert("Terjadi kesalahan saat menghapus lowongan.");
};
}
}


// pelamar
// Fungsi untuk menambahkan pelamar
function addPelamar() {
    const namaLengkap =
        document.getElementById("namaLengkap").value;
    const emailPelamar =
        document.getElementById("emailPelamar").value;

    const no_hp = document.getElementById("no_hp").value;

    if (namaLengkap && emailPelamar) {
        const newPelamar = {
            id_pelamar: Date.now(), // Menggunakan timestamp sebagai ID sementara
            nama_lengkap: namaLengkap,
            email: emailPelamar,
            no_hp: no_hp
        };

        const transaction = db.transaction(
            ["pelamar"],
            "readwrite"
        );
        const pelamarStore = transaction.objectStore("pelamar");
        const request = pelamarStore.add(newPelamar);

        request.onsuccess = function () {
            alert("Pelamar berhasil ditambahkan.");
            clearPelamarForm(); // Kosongkan form setelah berhasil menambah
            displayPelamarData(); // Tampilkan data setelah penambahan
        };

        request.onerror = function () {
            alert("Terjadi kesalahan saat menambahkan pelamar.");
        };
    } else {
        alert("Silakan lengkapi semua field.");
    }
}

// Fungsi untuk mengosongkan form pelamar
function clearPelamarForm() {
    document.getElementById("namaLengkap").value = "";
    document.getElementById("emailPelamar").value = "";
}

// Fungsi untuk menampilkan data pelamar dari IndexedDB
function displayPelamarData() {
    const pelamarTableBody = document
        .getElementById("pelamarTable")
        .getElementsByTagName("tbody")[0];
    pelamarTableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan data

    const transaction = db.transaction(["pelamar"], "readonly");
    const pelamarStore = transaction.objectStore("pelamar");
    const request = pelamarStore.getAll();

    request.onsuccess = function (event) {
        const pelamarData = event.target.result;
        pelamarData.forEach((pelamar) => {
            const row = pelamarTableBody.insertRow();
            row.insertCell(0).innerText = pelamar.id_pelamar;
            row.insertCell(1).innerText = pelamar.nama_lengkap;
            row.insertCell(2).innerText = pelamar.email;
            row.insertCell(3).innerText = pelamar.no_hp;
            row.insertCell(
                4
            ).innerHTML = `
            <button class="button" onclick="openEditPelamarModal(${pelamar.id_pelamar})">Edit</button>
            <button class="button" onclick="deletePelamar(${pelamar.id_pelamar})">Hapus</button>`;
        });
    };
}

function openEditPelamarModal(id_pelamar) {
const transaction = db.transaction(["pelamar"], "readonly");
const pelamarStore = transaction.objectStore("pelamar");
const request = pelamarStore.get(id_pelamar);

request.onsuccess = function (event) {
const pelamar = event.target.result;
if (pelamar) {
document.getElementById("editIdPelamar").value = pelamar.id_pelamar;
document.getElementById("editNamaLengkap").value = pelamar.nama_lengkap;
document.getElementById("editEmail").value = pelamar.email;
document.getElementById("editNoHp").value = pelamar.no_hp;
document.getElementById("editPelamarModal").style.display = "block";
} else {
alert("Pelamar tidak ditemukan.");
}
};

request.onerror = function () {
alert("Terjadi kesalahan saat mengambil data pelamar.");
};
}

function closeEditPelamarModal() {
document.getElementById("editPelamarModal").style.display = "none";
}

function updatePelamar() {
const id = parseInt(document.getElementById("editIdPelamar").value);
const namaLengkap = document.getElementById("editNamaLengkap").value;
const email = document.getElementById("editEmail").value;
const noHp = document.getElementById("editNoHp").value;

const updatedPelamar = {
id_pelamar: id,
nama_lengkap: namaLengkap,
email: email,
no_hp: noHp,
};

const transaction = db.transaction(["pelamar"], "readwrite");
const pelamarStore = transaction.objectStore("pelamar");
const request = pelamarStore.put(updatedPelamar);

request.onsuccess = function () {
alert("Pelamar berhasil diperbarui.");
updateLamaranPelamar(id, updatedPelamar); // Update lamaran yang terkait
closeEditPelamarModal();
displayPelamarData(); // Perbarui tampilan data pelamar
};

request.onerror = function () {
alert("Terjadi kesalahan saat memperbarui pelamar.");
};
}

function updateLamaranPelamar(idPelamar, updatedPelamar) {
const transaction = db.transaction(["lamaran"], "readwrite");
const lamaranStore = transaction.objectStore("lamaran");
const request = lamaranStore.index("id_pelamar").openCursor(IDBKeyRange.only(idPelamar));

request.onsuccess = function (event) {
const cursor = event.target.result;
if (cursor) {
const lamaran = cursor.value;
lamaran.no_hp = updatedPelamar.no_hp; // Update no_hp di lamaran
lamaranStore.put(lamaran); // Simpan perubahan
cursor.continue(); // Lanjutkan ke lamaran berikutnya
}
};

request.onerror = function () {
alert("Terjadi kesalahan saat memperbarui lamaran.");
};
}

// Fungsi untuk menghapus pelamar
function deletePelamar(id) {
if (confirm("Apakah Anda yakin ingin menghapus pelamar ini?")) {
const transaction = db.transaction(["pelamar"], "readwrite");
const pelamarStore = transaction.objectStore("pelamar");
const request = pelamarStore.delete(id);

request.onsuccess = function () {
alert("Pelamar berhasil dihapus.");
displayPelamarData(); // Tampilkan data setelah penghapusan
};

request.onerror = function () {
alert("Terjadi kesalahan saat menghapus pelamar.");
};
}
}
// end pelamar

// lamaran

// Fungsi untuk menampilkan data lamaran dari IndexedDB
function displayLamaran() {
    const lamaranTableBody = document
        .getElementById("lamaranTable")
        .getElementsByTagName("tbody")[0];
    lamaranTableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan data

    const transaction = db.transaction(
        ["lamaran", "lowongan", "perusahaan", "pelamar"],
        "readonly"
    );
    const lamaranStore = transaction.objectStore("lamaran");
    const lowonganStore = transaction.objectStore("lowongan");
    const perusahaanStore = transaction.objectStore("perusahaan");
    const pelamarStore = transaction.objectStore("pelamar");

    const request = lamaranStore.getAll();

    request.onsuccess = function (event) {
        const lamaranData = event.target.result;

        // Ambil semua data lowongan, perusahaan, dan pelamar
        const lowonganRequest = lowonganStore.getAll();
        const perusahaanRequest = perusahaanStore.getAll();
        const pelamarRequest = pelamarStore.getAll();

        lowonganRequest.onsuccess = function (lowonganEvent) {
            const lowonganData = lowonganEvent.target.result;
            const lowonganMap = {};
            lowonganData.forEach((lowongan) => {
                lowonganMap[lowongan.id_lowongan] = lowongan;
            });

            perusahaanRequest.onsuccess = function (
                perusahaanEvent
            ) {
                const perusahaanData =
                    perusahaanEvent.target.result;
                const perusahaanMap = {};
                perusahaanData.forEach((perusahaan) => {
                    perusahaanMap[perusahaan.id_perusahaan] =
                        perusahaan;
                });

                pelamarRequest.onsuccess = function (pelamarEvent) {
                    const pelamarData = pelamarEvent.target.result;
                    const pelamarMap = {};
                    pelamarData.forEach((pelamar) => {
                        pelamarMap[pelamar.id_pelamar] = pelamar;
                    });

                    // Tampilkan data lamaran
                    lamaranData.forEach((lamaran) => {
                        const lowongan =
                            lowonganMap[lamaran.id_lowongan] || {};
                        const perusahaan =
                            perusahaanMap[lowongan.id_perusahaan] ||
                            {};
                        const pelamar =
                            pelamarMap[lamaran.id_pelamar] || {};

                        const row = lamaranTableBody.insertRow();
                        row.insertCell(0).innerText =
                            lamaran.id_lamaran;
                        row.insertCell(1).innerText =
                            lowongan.judul || "Tidak Diketahui";
                        row.insertCell(2).innerText =
                            perusahaan.nama_perusahaan ||
                            "Tidak Diketahui";
                        row.insertCell(3).innerText =
                            perusahaan.alamat || "Tidak Diketahui";
                        row.insertCell(4).innerText =
                            pelamar.nama_lengkap ||
                            "Tidak Diketahui";
                        row.insertCell(5).innerText =
                            pelamar.no_hp ||
                            "Tidak Diketahui";
                        row.insertCell(6).innerText =
                            lamaran.syarat;
                        row.insertCell(7).innerText =
                            lamaran.status || "Belum Diproses";
                        // Tambahkan tombol aksi untuk memperbarui status
                        const actionCell = row.insertCell(8);
                        actionCell.innerHTML = `
<button class="button" onclick="updateStatusLamaran(${lamaran.id_lamaran}, 'Diterima')">Terima</button>
<button class="button" onclick="updateStatusLamaran(${lamaran.id_lamaran}, 'Ditolak')">Tolak</button>
<button class="button" onclick="deleteLamaran(${lamaran.id_lamaran})">Hapus</button>
`;
                    });
                };
            };
        };
    };
}

// Fungsi untuk memperbarui status lamaran
function updateStatusLamaran(idLamaran, statusBaru) {
    const transaction = db.transaction(["lamaran"], "readwrite");
    const lamaranStore = transaction.objectStore("lamaran");

    // Ambil lamaran berdasarkan ID
    const request = lamaranStore.get(idLamaran);

    request.onsuccess = function (event) {
        const lamaran = event.target.result;

        if (lamaran) {
            lamaran.status = statusBaru; // Update status lamaran
            const updateRequest = lamaranStore.put(lamaran);

            updateRequest.onsuccess = function () {
                alert(
                    `Status lamaran berhasil diperbarui menjadi "${statusBaru}".`
                );
                displayLamaran(); // Refresh tabel lamaran
            };

            updateRequest.onerror = function () {
                alert(
                    "Terjadi kesalahan saat memperbarui status lamaran."
                );
            };
        } else {
            alert("Lamaran tidak ditemukan.");
        }
    };

    request.onerror = function () {
        alert("Terjadi kesalahan saat mengambil data lamaran.");
    };
}

// Fungsi untuk menghapus lamaran
function deleteLamaran(id) {
if (confirm("Apakah Anda yakin ingin menghapus lamaran ini?")) {
const transaction = db.transaction(["lamaran"], "readwrite");
const lamaranStore = transaction.objectStore("lamaran");
const request = lamaranStore.delete(id);

request.onsuccess = function () {
alert("Lamaran berhasil dihapus.");
displayLamaran(); // Perbarui tabel setelah penghapusan
};

request.onerror = function () {
alert("Terjadi kesalahan saat menghapus lamaran.");
};
}
}

// end lamaran

// user

// Fungsi untuk menambahkan user
function addUser() {
    const namaUser = document.getElementById("namaUser ").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const status = document.getElementById("statusUser ").value;

    if (namaUser && username && password) {
        const newUser = {
            id_user: Date.now(), // Menggunakan timestamp sebagai ID sementara
            nama_user: namaUser,
            username: username,
            password: password, // Pastikan untuk mengenkripsi password di aplikasi nyata
            status: status,
        };

        const transaction = db.transaction(["user"], "readwrite");
        const userStore = transaction.objectStore("user");
        const request = userStore.add(newUser);

        request.onsuccess = function () {
            alert("User  berhasil ditambahkan.");
            clearUserForm(); // Kosongkan form setelah berhasil menambah
            displayUserData(); // Tampilkan data setelah penambahan
        };

        request.onerror = function () {
            alert("Terjadi kesalahan saat menambahkan user.");
        };
    } else {
        alert("Silakan lengkapi semua field.");
    }
}

// Fungsi untuk mengosongkan form user
function clearUserForm() {
    document.getElementById("namaUser ").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("statusUser ").value = ""; // Set default status
}

// Fungsi untuk menampilkan data user dari IndexedDB
function displayUserData() {
    const userTableBody = document
        .getElementById("userTable")
        .getElementsByTagName("tbody")[0];
    userTableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan data

    const transaction = db.transaction(["user"], "readonly");
    const userStore = transaction.objectStore("user");
    const request = userStore.getAll();

    request.onsuccess = function (event) {
        const userData = event.target.result;
        userData.forEach((user) => {
            const row = userTableBody.insertRow();
            row.insertCell(0).innerText = user.id_user;
            row.insertCell(1).innerText = user.nama_user;
            row.insertCell(2).innerText = user.username;
            row.insertCell(3).innerText = user.password; // Pastikan untuk tidak menampilkan password di aplikasi nyata
            row.insertCell(4).innerText = user.status;
            row.insertCell(
                5
            ).innerHTML = `
            <button class="button" onclick="openEditUserModal (${user.id_user})">Edit</button>
            <button class="button" onclick="deleteUser (${user.id_user})">Hapus</button>
            `;
        });
    };
}

function openEditUserModal(id) {
const transaction = db.transaction(["user"], "readonly");
const userStore = transaction.objectStore("user");
const request = userStore.get(id);

request.onsuccess = function (event) {
const user = event.target.result;
if (user) {
document.getElementById("editIdUser ").value = user.id_user;
document.getElementById("editNamaUser ").value = user.nama_user;
document.getElementById("editUsername").value = user.username;
document.getElementById("editPassword").value = user.password; // Pastikan untuk tidak menampilkan password di aplikasi nyata
document.getElementById("editStatusUser ").value = user.status;
document.getElementById("editUser Modal").style.display = "block";
} else {
alert("User  tidak ditemukan.");
}
};

request.onerror = function () {
alert("Terjadi kesalahan saat mengambil data user.");
};
}

function closeEditUserModal() {
document.getElementById("editUser Modal").style.display = "none";
}

function updateUser () {
const id = parseInt(document.getElementById("editIdUser ").value);
const namaUser  = document.getElementById("editNamaUser ").value;
const username = document.getElementById("editUsername").value;
const password = document.getElementById("editPassword").value; // Pastikan untuk mengenkripsi password di aplikasi nyata
const status = document.getElementById("editStatusUser ").value;

const updatedUser  = {
id_user: id,
nama_user: namaUser ,
username: username,
password: password,
status: status,
};

const transaction = db.transaction(["user"], "readwrite");
const userStore = transaction.objectStore("user");
const request = userStore.put(updatedUser );

request.onsuccess = function () {
alert("User  berhasil diperbarui.");
closeEditUserModal();
displayUserData(); // Perbarui tampilan data user
};

request.onerror = function () {
alert("Terjadi kesalahan saat memperbarui user.");
};
}

// Fungsi untuk menghapus user
function deleteUser(id) {
    if(confirm("Apakah anda yankin menghapus user ini?")) {
    const transaction = db.transaction(["user"], "readwrite");
    const userStore = transaction.objectStore("user");
    const request = userStore.delete(id);

    request.onsuccess = function () {
        alert("User  berhasil dihapus.");
        displayUserData();
    };

    request.onerror = function () {
        alert("Terjadi kesalahan saat menghapus user.");
    };

}
}

// end user

// Inisialisasi database dan ambil data saat halaman dimuat
let db;
const request = indexedDB.open("PortalKerjaPekanbaru", 1);

request.onsuccess = function (event) {
    db = event.target.result;
    displayPerusahaanData(); // Tampilkan data perusahaan setelah koneksi berhasil
    populatePerusahaanSelect(); // Isi select dengan data perusahaan
    displayLowonganData(); // Tampilkan data lowongan
    displayPelamarData(); //Tampil pelamar
    displayUserData(); // Tampilkan data setelah penghapusan
    displayLamaran();
};

request.onerror = function (event) {
    console.error(
        "Terjadi kesalahan saat membuka database:",
        event.target.errorCode
    );
};

request.onupgradeneeded = function (event) {
    db = event.target.result;

    // Membuat tabel `Lowongan` jika belum ada
    if (!db.objectStoreNames.contains("lowongan")) {
        const lowonganStore = db.createObjectStore("lowongan", {
            keyPath: "id_lowongan",
            autoIncrement: true,
        });
        lowonganStore.createIndex("judul", "judul", {
            unique: false,
        });
        lowonganStore.createIndex(
            "id_perusahaan",
            "id_perusahaan",
            { unique: false }
        );
        lowonganStore.createIndex("lokasi", "lokasi", {
            unique: false,
        });
    }

    // Membuat tabel `Perusahaan` jika belum ada
    if (!db.objectStoreNames.contains("perusahaan")) {
        const perusahaanStore = db.createObjectStore("perusahaan", {
            keyPath: "id_perusahaan",
            autoIncrement: true,
        });
        perusahaanStore.createIndex(
            "nama_perusahaan",
            "nama_perusahaan",
            { unique: true }
        );
        perusahaanStore.createIndex("industri", "industri", {
            unique: false,
        });
        perusahaanStore.createIndex("deskripsi", "deskripsi", {
            unique: false,
        });
        perusahaanStore.createIndex("alamat", "alamat", {
            unique: false,
        });
    }

    // Membuat tabel `Pelamar` jika belum ada
    if (!db.objectStoreNames.contains("pelamar")) {
        const pelamarStore = db.createObjectStore("pelamar", {
            keyPath: "id_pelamar",
            autoIncrement: true,
        });
        pelamarStore.createIndex("nama_lengkap", "nama_lengkap", {
            unique: false,
        });
        pelamarStore.createIndex("email", "email", {
            unique: true,
        });
        pelamarStore.createIndex("no_hp", "no_hp", {
            unique: true,
        });
    }

    // Membuat tabel `Lamaran` jika belum ada
    if (!db.objectStoreNames.contains("lamaran")) {
        const lamaranStore = db.createObjectStore("lamaran", {
            keyPath: "id_lamaran",
            autoIncrement: true,
        });
        lamaranStore.createIndex("id_lowongan", "id_lowongan", {
            unique: false,
        });
        lamaranStore.createIndex("id_pelamar", "id_pelamar", {
            unique: false,
        });
        lamaranStore.createIndex("syarat", "syarat", {
            unique: false,
        });

        lamaranStore.createIndex("status", "status", {
            unique: false,
        });
    }

    // Membuat tabel `User ` jika belum ada
    if (!db.objectStoreNames.contains("user")) {
        const wawancaraStore = db.createObjectStore("user", {
            keyPath: "id_user",
            autoIncrement: true,
        });
        wawancaraStore.createIndex("nama_user", "nama_user", {
            unique: false,
        });
        wawancaraStore.createIndex("username", "username", {
            unique: false,
        });
        wawancaraStore.createIndex("password", "password", {
            unique: false,
        });
        wawancaraStore.createIndex("status", "status", {
            unique: false,
        });
    }

    console.log("Skema database berhasil dibuat atau diperbarui.");
};
