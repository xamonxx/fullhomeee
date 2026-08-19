/**
 * Editorial copy per portfolio category.
 *
 * Each category page needs its own substance, not a heading swapped into a shared
 * template — seven near-identical pages read as thin content and Google tends to
 * leave them out of the index. Titles, intros and the detail lists below are
 * written per product type and describe what FULLHOME ID actually builds.
 *
 * Keyed by the slug that `slugify(categoryLabel)` produces in portfolio-taxonomy.
 */
export interface CategoryCopy {
  /** Page <h1>. Leads with the term people search for. */
  heading: string;
  /** <title>, before the brand template is appended. */
  seoTitle: string;
  seoDescription: string;
  /** Opening paragraph shown under the heading. */
  intro: string;
  /** Concrete specifics — materials, fittings, what the work covers. */
  details: string[];
  keywords: string[];
}

export const categoryCopy: Record<string, CategoryCopy> = {
  wardrobe: {
    heading: "Wardrobe Custom",
    seoTitle: "Wardrobe Custom Bandung — Lemari Pakaian Built-in",
    seoDescription:
      "Portofolio wardrobe custom FULLHOME ID: lemari pakaian built-in, sliding door, dan vanity dengan finishing HPL & Duco. Dokumentasi nyata dari klien Bandung & Jabodetabek.",
    intro:
      "Lemari pakaian dibuat menyesuaikan tinggi plafon dan ceruk dinding, sehingga tidak ada ruang mati di antara lemari dan langit-langit. Pembagian gantungan, rak lipat, dan laci disesuaikan dengan isi lemari penghuni — bukan ukuran standar pabrik.",
    details: [
      "Pintu swing, sliding, atau kombinasi sesuai lebar bukaan kamar",
      "Finishing HPL, Duco, atau kombinasi kaca dan cermin",
      "Sistem fitting soft-close dan rel laci full extension",
      "Opsi meja rias (vanity) terintegrasi dalam satu bidang",
    ],
    keywords: [
      "wardrobe custom bandung",
      "lemari pakaian built in",
      "lemari sliding door custom",
      "harga wardrobe custom",
    ],
  },

  "kitchen-set": {
    heading: "Kitchen Set Custom",
    seoTitle: "Kitchen Set Custom Bandung — Minimalis & Semi Klasik",
    seoDescription:
      "Portofolio kitchen set custom FULLHOME ID: dapur minimalis, semi klasik, dan island. Material HPL, Duco, dan top table granit. Dokumentasi nyata proyek Bandung & Soreang.",
    intro:
      "Kitchen set dirancang mengikuti alur memasak — jarak antara kompor, sink, dan kulkas diatur agar pergerakan tidak berputar. Tata letak menyesuaikan bentuk dapur, baik lurus, L, U, maupun dengan island.",
    details: [
      "Gaya minimalis modern hingga semi klasik dengan profil pintu",
      "Top table granit, marmer, atau solid surface",
      "Kabinet atas dengan lampu bawah untuk area kerja",
      "Penyesuaian bukaan untuk kompor tanam, oven, dan kulkas",
    ],
    keywords: [
      "kitchen set custom bandung",
      "kitchen set minimalis",
      "kitchen set semi klasik",
      "jasa kitchen set soreang",
    ],
  },

  "lemari-bawah-tangga": {
    heading: "Lemari Bawah Tangga",
    seoTitle: "Lemari Bawah Tangga Custom Bandung — Storage Ruang Sisa",
    seoDescription:
      "Portofolio lemari bawah tangga custom FULLHOME ID. Mengubah ruang sisa di bawah tangga menjadi storage rapi: laci tarik, rak buku, hingga area kerja.",
    intro:
      "Ruang di bawah tangga hampir selalu terbuang karena bentuknya menyudut dan tingginya tidak seragam. Setiap unit dibuat mengikuti kemiringan tangga, dengan pembagian yang menyesuaikan tinggi bidang di tiap segmen.",
    details: [
      "Laci tarik untuk segmen rendah yang sulit dijangkau",
      "Rak terbuka atau pintu tanpa handle untuk tampilan bersih",
      "Opsi area kerja, rak buku, atau storage tertutup",
      "Finishing menyatu dengan warna dinding atau lantai",
    ],
    keywords: [
      "lemari bawah tangga custom",
      "storage bawah tangga",
      "rak bawah tangga minimalis",
    ],
  },

  "backdrop-tv": {
    heading: "Backdrop TV",
    seoTitle: "Backdrop TV Custom Bandung — Panel Kayu & Rak Ambalan",
    seoDescription:
      "Portofolio backdrop TV custom FULLHOME ID: panel kayu slat, rak ambalan, dan credenza dengan lampu tersembunyi. Dokumentasi nyata ruang keluarga klien.",
    intro:
      "Backdrop TV menyatukan dinding media dengan penyimpanan, sehingga kabel dan perangkat tidak terlihat. Panel dirancang selebar bidang dinding agar proporsinya seimbang dengan ukuran televisi.",
    details: [
      "Panel kayu slat vertikal atau bidang rata dengan tekstur",
      "Jalur kabel tersembunyi di balik panel",
      "Rak ambalan gantung dan credenza bawah",
      "Lampu LED tersembunyi untuk pencahayaan tidak langsung",
    ],
    keywords: [
      "backdrop tv custom bandung",
      "panel tv kayu minimalis",
      "credenza tv custom",
    ],
  },

  bedroom: {
    heading: "Interior Bedroom",
    seoTitle: "Interior Kamar Tidur Custom Bandung — Set Kamar Menyeluruh",
    seoDescription:
      "Portofolio interior kamar tidur FULLHOME ID: headboard, nakas, wardrobe, dan drop ceiling dalam satu perancangan menyeluruh untuk kamar utama maupun anak.",
    intro:
      "Kamar tidur dikerjakan sebagai satu kesatuan, bukan perabot terpisah yang kebetulan ditempatkan bersama. Headboard, wardrobe, nakas, dan pencahayaan dirancang dalam satu skema material agar warnanya konsisten.",
    details: [
      "Headboard berlapis kain atau panel kayu",
      "Drop ceiling dengan hidden lamp di area ranjang",
      "Wardrobe dan meja rias menyatu dengan dinding kamar",
      "Skema warna hangat yang menenangkan untuk area istirahat",
    ],
    keywords: [
      "interior kamar tidur bandung",
      "set kamar tidur custom",
      "headboard custom",
    ],
  },

  "interior-toko": {
    heading: "Interior Toko",
    seoTitle: "Interior Toko & Display Custom Bandung — Rak Etalase",
    seoDescription:
      "Portofolio interior toko FULLHOME ID: rak display, etalase, dan meja kasir custom yang dirancang untuk alur pengunjung dan penataan produk.",
    intro:
      "Interior toko dirancang dari alur pengunjung: apa yang terlihat pertama dari pintu, di mana produk unggulan diletakkan, dan di mana kasir sebaiknya berdiri. Rak dibuat modular agar penataan bisa diubah mengikuti stok.",
    details: [
      "Rak display dengan pencahayaan pada tiap tingkat",
      "Meja kasir dengan storage dan jalur kabel tersembunyi",
      "Material tahan gores untuk area dengan lalu lintas tinggi",
      "Penyesuaian dengan identitas visual dan warna brand",
    ],
    keywords: [
      "interior toko bandung",
      "rak display toko custom",
      "desain etalase toko",
    ],
  },

  apartemen: {
    heading: "Interior Apartemen",
    seoTitle: "Interior Apartemen Custom Bandung & Jakarta — Unit Compact",
    seoDescription:
      "Portofolio interior apartemen FULLHOME ID: penataan unit studio hingga dua kamar dengan furnitur multifungsi dan storage yang memanfaatkan tinggi ruang.",
    intro:
      "Unit apartemen menuntut setiap sentimeter bekerja lebih dari satu fungsi. Furnitur dibuat ramping dan memanjang ke atas untuk memanfaatkan tinggi ruang, tanpa membuat unit terasa penuh.",
    details: [
      "Furnitur multifungsi untuk unit studio dan satu kamar",
      "Storage vertikal hingga mendekati plafon",
      "Pengerjaan modular agar mudah dibawa lewat lift",
      "Koordinasi jadwal dengan aturan pengelola gedung",
    ],
    keywords: [
      "interior apartemen bandung",
      "desain apartemen studio",
      "furnitur apartemen custom",
    ],
  },
};

export function getCategoryCopy(slug: string): CategoryCopy | undefined {
  return categoryCopy[slug];
}
