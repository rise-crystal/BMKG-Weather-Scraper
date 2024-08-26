# BMKG-Weather-Scraper
Kode ini mengambil data prakiraan cuaca dari file XML BMKG berdasarkan provinsi yang dipilih, kemudian memparsing dan menampilkan informasi cuaca untuk area tertentu yang sesuai dengan query. Jika area tidak ditemukan, kode ini akan menampilkan pesan kesalahan atau daftar area yang tersedia.

# BMKG-Weather-Scraper

BMKG-Weather-Scraper adalah sebuah skrip Node.js yang digunakan untuk mengambil dan memparsing data prakiraan cuaca dari Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) Indonesia. Skrip ini memungkinkan Anda untuk memilih data cuaca dari berbagai provinsi di Indonesia dan memfilter hasil berdasarkan nama area yang diinginkan.

## Fitur

- Mengambil data prakiraan cuaca dari file XML yang disediakan oleh BMKG.
- Mendukung pencarian area berdasarkan nama dalam bahasa Indonesia (id_ID).
- Menampilkan informasi cuaca, termasuk deskripsi, latitude, longitude, dan kondisi cuaca.
- Memiliki fitur untuk menampilkan daftar area yang tersedia jika area yang dicari tidak ditemukan.

## Cara Penggunaan

1. Install dependencies:

   ```bash
   npm install axios xml2js
