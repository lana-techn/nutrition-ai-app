# AI Nutrition App

![Aplikasi Nutrisi AI](https://via.placeholder.com/800x200.png?text=AI+Nutrition+App)

AI Nutrition App adalah aplikasi cerdas yang membantu Anda mencapai tujuan kesehatan melalui nutrisi yang lebih baik. Ambil foto makanan Anda untuk analisis nutrisi instan, dapatkan rekomendasi makanan yang dipersonalisasi, dan ajukan pertanyaan langsung ke ahli gizi AI kami.

[![Lisensi](https://img.shields.io/badge/lisensi-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status Build](https://img.shields.io/travis/com/nama_pengguna/nama_repo.svg)](https://travis-ci.com/nama_pengguna/nama_repo)
[![Versi Rilis](https://img.shields.io/github/v/release/nama_pengguna/nama_repo)](https://github.com/nama_pengguna/nama_repo/releases)

---

## 📜 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Tumpukan Teknologi](#️-tumpukan-teknologi)
- [🏁 Memulai](#-memulai)
  - [Prasyarat](#prasyarat)
  - [Instalasi & Menjalankan](#instalasi--menjalankan)
- [🚀 Deployment](#-deployment)
- [🤝 Berkontribusi](#-berkontribusi)
- [📄 Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

Proyek ini adalah aplikasi web modern yang dibangun dengan arsitektur monorepo, memisahkan backend dan frontend untuk pengembangan yang lebih terkelola. Backend dibangun menggunakan framework **Encore** untuk skalabilitas dan kemudahan pengembangan, sementara frontend menggunakan **React** dan **Vite** untuk antarmuka yang cepat dan responsif.

Tujuan utama aplikasi ini adalah menyediakan alat bantu nutrisi yang mudah diakses dan didukung oleh AI untuk membantu pengguna membuat pilihan makanan yang lebih sehat setiap hari.

---

## ✨ Fitur Utama

*   **Analisis Makanan via AI:** Ambil foto makanan Anda, dan AI akan menganalisis kandungan nutrisinya.
*   **Chat dengan Ahli Gizi AI:** Dapatkan jawaban instan untuk pertanyaan nutrisi Anda kapan saja.
*   **Rekomendasi Personal:** Terima rekomendasi makanan dan resep harian yang disesuaikan dengan profil dan tujuan Anda.
*   **Blog Nutrisi:** Jelajahi artikel dan tips terbaru seputar gaya hidup sehat.

---

## 🛠️ Tumpukan Teknologi

Aplikasi ini dibangun menggunakan teknologi modern berikut:

*   **Monorepo:** Dikelola menggunakan **Bun Workspaces**.
*   **Backend:**
    *   Framework: **Encore**
    *   Bahasa: **TypeScript**
*   **Frontend:**
    *   Framework: **React** & **Vite**
    *   Bahasa: **TypeScript**
    *   Styling: **Tailwind CSS**
    *   Komponen UI: **shadcn/ui** (menggunakan Radix UI & CVA)
    *   Manajemen Data Server: **TanStack React Query**
    *   Routing: **React Router**

---

## 🏁 Memulai

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah di bawah ini.

### Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:

1.  **Encore CLI:** Diperlukan untuk menjalankan backend. Instal sesuai sistem operasi Anda:
    *   **macOS:** `brew install encoredev/tap/encore`
    *   **Linux:** `curl -L https://encore.dev/install.sh | bash`
    *   **Windows:** `iwr https://encore.dev/install.ps1 | iex`

2.  **Bun:** Digunakan sebagai package manager.
    ```sh
    npm install -g bun
    ```

### Instalasi & Menjalankan

Proyek ini terdiri dari backend dan frontend yang dijalankan secara terpisah dalam mode pengembangan.

1.  **Clone repositori ini:**
    ```sh
    git clone https://github.com/nama_pengguna/nama_repo.git
    cd nama_repo
    ```

2.  **Instal dependensi di seluruh workspace:**
    ```sh
    bun install
    ```

3.  **Jalankan Backend:**
    *   Masuk ke direktori backend dan jalankan server Encore.
    ```sh
    cd backend
    encore run
    ```
    *   Backend akan berjalan di URL yang ditampilkan di terminal (biasanya `http://localhost:4000`).

4.  **Jalankan Frontend:**
    *   Buka terminal baru, masuk ke direktori frontend, dan jalankan server Vite.
    ```sh
    cd frontend
    bunx vite dev
    ```
    *   Frontend akan tersedia di `http://localhost:5173` (atau port lain yang tersedia).

---

## 🚀 Deployment

Aplikasi ini dapat di-deploy dengan mudah ke **Encore Cloud**.

1.  **Login ke akun Encore Anda:**
    ```sh
    encore auth login
    ```
2.  **Tambahkan remote Git Encore:**
    ```sh
    git remote add encore encore://nutrition-ai-app-c452
    ```
3.  **Deploy dengan Git Push:**
    ```sh
    git push encore
    ```
Untuk instruksi lebih lanjut, termasuk integrasi dengan GitHub, lihat `DEVELOPMENT.md`.

---

## 🤝 Berkontribusi

Kontribusi sangat kami hargai. Jika Anda ingin membantu, silakan fork repositori ini dan buat pull request.

1.  Fork repositori ini.
2.  Buat Branch baru (`git checkout -b fitur/FiturKeren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`).
4.  Push ke Branch (`git push origin fitur/FiturKeren`).
5.  Buka Pull Request.

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
