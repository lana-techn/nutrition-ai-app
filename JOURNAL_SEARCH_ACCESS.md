# Journal Search - Access Control

Fitur **Journal Search** telah dibatasi aksesnya hanya untuk user-user tertentu.

## 🔐 User yang Diizinkan

Hanya 5 user berikut yang dapat mengakses fitur Journal Search:

1. `user_33j1htPUTvfxU7GT9aLEBa3Jdrw`
2. `user_33jRLFL67lGvvGW90HxK8qy73AI`
3. `user_33jjI0TAsQ8korgVCkwN1HKv3St`
4. `user_33mZYk1iCMCQUZOLfWzYUgHpq3J`
5. `user_346GhNK5yThH2tqv4TmUAsgmG5e`

## ✅ Implementasi

### 1. Access Control Library (`src/lib/access-control.ts`)

Centralized configuration untuk whitelist user IDs:

```typescript
export const JOURNAL_SEARCH_ALLOWED_USERS = [
  'user_33j1htPUTvfxU7GT9aLEBa3Jdrw',
  'user_33jRLFL67lGvvGW90HxK8qy73AI',
  'user_33jjI0TAsQ8korgVCkwN1HKv3St',
  'user_33mZYk1iCMCQUZOLfWzYUgHpq3J',
  'user_346GhNK5yThH2tqv4TmUAsgmG5e',
];

export function hasJournalSearchAccess(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return JOURNAL_SEARCH_ALLOWED_USERS.includes(userId);
}
```

### 2. Page Level Protection (`src/app/(main)/journal-search/page.tsx`)

Halaman Journal Search melakukan 3 level check:

1. **Loading Check** - Tampilkan loading spinner saat Clerk sedang memuat data
2. **Authentication Check** - Redirect ke sign-in jika user belum login
3. **Authorization Check** - Tampilkan "Access Restricted" jika user tidak punya akses

### 3. Navigation Protection (`src/components/layout/ModernNavbar.tsx`)

Menu "Journal Search" di navbar (desktop & mobile) hanya muncul untuk user yang punya akses.

## 🎯 Behavior

### User Tanpa Akses

- ❌ Menu "Journal Search" **tidak muncul** di navbar
- ❌ Jika mencoba akses langsung via URL → Tampilkan halaman "Access Restricted"
- ✅ Diarahkan kembali ke Dashboard

### User dengan Akses

- ✅ Menu "Journal Search" **muncul** di navbar
- ✅ Dapat mengakses fitur penuh
- ✅ Dapat search, filter, dan view research papers

## 🔧 Menambah/Menghapus User

### Menambah User Baru

Edit file `src/lib/access-control.ts`:

```typescript
export const JOURNAL_SEARCH_ALLOWED_USERS = [
  'user_33j1htPUTvfxU7GT9aLEBa3Jdrw',
  'user_33jRLFL67lGvvGW90HxK8qy73AI',
  'user_33jjI0TAsQ8korgVCkwN1HKv3St',
  'user_33mZYk1iCMCQUZOLfWzYUgHpq3J',
  'user_346GhNK5yThH2tqv4TmUAsgmG5e',
  'user_NEW_USER_ID_HERE', // Tambahkan di sini
];
```

### Menghapus User

Hapus user ID dari array `JOURNAL_SEARCH_ALLOWED_USERS`.

### Cara Mendapatkan User ID

1. **Dari Clerk Dashboard:**
   - Login ke [Clerk Dashboard](https://dashboard.clerk.com)
   - Users → Pilih user → Copy User ID

2. **Dari Development Tools:**
   - User login ke aplikasi
   - Buka browser console:
   ```javascript
   // Di browser console
   console.log(window.Clerk?.user?.id);
   ```

3. **Dari Database (setelah sync):**
   ```bash
   psql $DATABASE_URL -c "SELECT id, clerk_id, name, email FROM users;"
   ```

## 🧪 Testing

### Test sebagai User dengan Akses

1. Login dengan salah satu dari 5 user yang diizinkan
2. Menu "Journal Search" muncul di navbar
3. Klik menu → Dapat akses halaman
4. Fitur search berfungsi normal

### Test sebagai User tanpa Akses

1. Login dengan user lain (bukan dari whitelist)
2. Menu "Journal Search" **tidak muncul** di navbar
3. Akses langsung via URL → Tampil "Access Restricted"
4. Ada tombol "Back to Dashboard"

### Test tanpa Login

1. Logout dari aplikasi
2. Menu "Journal Search" **tidak muncul**
3. Akses langsung via URL → Tampil "Authentication Required"
4. Ada tombol "Sign In"

## 📊 Monitoring

### Check Access dari Code

```typescript
import { hasJournalSearchAccess } from '@/lib/access-control';

// Check single user
const hasAccess = hasJournalSearchAccess('user_33j1htPUTvfxU7GT9aLEBa3Jdrw');
console.log(hasAccess); // true

// Get all allowed users
import { getAllowedJournalSearchUsers } from '@/lib/access-control';
const allowedUsers = getAllowedJournalSearchUsers();
console.log(allowedUsers); // Array of 5 user IDs
```

## 🔒 Security Notes

1. **Client-side & Server-side Protection:**
   - Client: Menu hidden + Page check
   - Best practice: Add API route protection juga

2. **User ID Public:**
   - Clerk user IDs tidak sensitive
   - Aman di-whitelist di client code
   - Tapi tetap lakukan check di server untuk production

3. **Future Enhancement:**
   - Consider moving whitelist ke database
   - Add admin panel untuk manage access
   - Add logging untuk audit trail

## 🚀 Production Deployment

Sebelum deploy:

1. ✅ Verifikasi whitelist user IDs benar
2. ✅ Test dengan user yang diizinkan
3. ✅ Test dengan user yang tidak diizinkan
4. ✅ Test direct URL access
5. ✅ Test pada mobile & desktop

## 📝 Related Files

- `src/lib/access-control.ts` - Access control logic
- `src/app/(main)/journal-search/page.tsx` - Protected page
- `src/components/layout/ModernNavbar.tsx` - Conditional menu rendering

---

**Last Updated:** 2025
**Feature Status:** ✅ Active & Tested
