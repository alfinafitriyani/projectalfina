const hari = new Date().getDay();
let namahari;

switch (hari) {
  case 0:
    namahari = 'Minggu';
    break;
  case 1:
    namahari = 'Senin';
    break;
  case 2:
    namahari = 'Selasa';
    break;
  case 3:
    namahari = 'Rabu';
    break;
  case 4:
    namahari = 'Kamis';
    break;
  case 5:
    namahari = 'Jumat';
    break;
  case 6:
    namahari = 'Sabtu';
    break;
  default:
    namahari = 'Hari tidak valid';
    break;
}

console.log(`Hari ini adalah hari ${namahari}`);