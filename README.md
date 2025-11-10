# Nutrition AI

[**Lihat Langsung**](https://nutrition-ai-app-six.vercel.app/)

Nutrition AI adalah aplikasi nutrisi cerdas yang dirancang untuk membantu Anda mencapai tujuan kesehatan melalui rekomendasi makanan yang dipersonalisasi, pelacakan makanan, dan pembuatan rencana makan. Dibangun dengan Next.js dan didukung oleh Google Generative AI, aplikasi ini menawarkan pengalaman yang mulus dan interaktif untuk mengelola diet dan nutrisi Anda.

## Fitur

- **Dasbor:** Dasbor yang dipersonalisasi untuk melacak kemajuan nutrisi Anda.
- **Perencana Makanan:** Buat dan kelola rencana makan mingguan Anda.
- **Rekomendasi Makanan:** Dapatkan rekomendasi makanan yang dipersonalisasi berdasarkan preferensi dan tujuan diet Anda.
- **Pencarian Jurnal:** Cari dan catat makanan yang Anda konsumsi.
- **Analisis Makanan:** Analisis mendalam tentang makanan yang Anda konsumsi.
- **Resep:** Jelajahi dan simpan resep sehat.
- **Obrolan:** Asisten obrolan yang didukung AI untuk menjawab pertanyaan nutrisi Anda.
- **Blog:** Artikel dan kiat tentang nutrisi dan hidup sehat.
- **Otentikasi Pengguna:** Pendaftaran dan login pengguna yang aman.

## Teknologi yang Digunakan

- **Framework:** [Next.js](https://nextjs.org/)
- **Otentikasi:** [Clerk](https://clerk.com/)
- **AI:** [Google Generative AI](https://ai.google/)
- **Basis Data:** [Neon](https://neon.tech/) (PostgreSQL)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI:** [Radix UI](https://www.radix-ui.com/)

## Memulai

Untuk menjalankan aplikasi ini secara lokal, ikuti langkah-langkah berikut:

1. **Kloning Repositori**

   ```bash
   git clone https://github.com/nama-pengguna-anda/nutrition-ai-nextjs.git
   cd nutrition-ai-nextjs
   ```

2. **Instal Dependensi**

   ```bash
   pnpm install
   ```

3. **Siapkan Variabel Lingkungan**

   Salin berkas `.env.example` ke `.env` dan isi variabel yang diperlukan:

   ```bash
   cp .env.example .env
   ```

   Anda harus mengisi variabel berikut di berkas `.env`:

   - `DATABASE_URL`: URL koneksi basis data Neon Anda.
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Kunci Clerk yang dapat dipublikasikan.
   - `CLERK_SECRET_KEY`: Kunci rahasia Clerk Anda.
   - `GEMINI_API_KEY`: Kunci API Google Generative AI Anda.

4. **Jalankan Aplikasi**

   ```bash
   pnpm dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di peramban Anda untuk melihat aplikasi.

## Basis Data

Aplikasi ini menggunakan Neon (PostgreSQL) untuk basis datanya. Untuk menyiapkan skema dan data awal, jalankan perintah berikut:

```bash
pnpm db:schema
pnpm db:seed
pnpm db:migrate:clerk
```

## Deployment

Cara termudah untuk men-deploy aplikasi Next.js Anda adalah dengan menggunakan [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dari para pembuat Next.js.

Lihat [dokumentasi deployment Next.js](https://nextjs.org/docs/app/building-your-application/deploying) kami untuk detail lebih lanjut.

## Kontributor

- [maulana-tech](https://github.com/maulana-tech)
