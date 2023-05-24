function tampil() {
    var nim = document.getElementById("nim").value;
    var nama = document.getElementById("nama").value;
    var MataKuliah = document.getElementById("MataKuliah").value;
    var NilaiAkhir = document.getElementById("NilaiAkhir").value;
    var Grade;
    var indeksNilai;
  
    if(NilaiAkhir >= 85 && NilaiAkhir <= 100) {
      Grade = "A";
     } else if (NilaiAkhir >= 79) {
     Grade = "A-";
     } else if (NilaiAkhir >= 74) {
     Grade = "B+";
     } else if (NilaiAkhir >= 69) {
     Grade = "B";
     } else if (NilaiAkhir >= 64) {
     Grade = "B-";
     } else if (NilaiAkhir >= 59) {
     Grade = "C+";
     } else if (NilaiAkhir >= 54) {
     Grade = "C";
     } else if (NilaiAkhir >= 41) {
     Grade = "D";
     } else {
     Grade = "E";
     }

     if(NilaiAkhir >= 85 && NilaiAkhir <= 100) {
      indeksNilai  = "4.00";
      } else if (NilaiAkhir >= 79) {
      indeksNilai  = "3.67";
      } else if (NilaiAkhir >= 74) {
      indeksNilai  = "3.33";
      } else if (NilaiAkhir >= 69) {
      indeksNilai = "3.00";
      } else if (NilaiAkhir >= 64) {
      indeksNilai  = "2.67";
      } else if (NilaiAkhir >= 59) {
      indeksNilai  = "2.33";
      } else if (NilaiAkhir >= 54) {
      indeksNilai  = "2.00";
      } else if (NilaiAkhir >= 41) {
      indeksNilai = "1.00";
      } else {
      indeksNilai = "0.00";
      }
    var data = "<tr> "+
      "<td>" + nim +"</td>"+
      "<td>" + nama + "</td>"+
      "<td>" + MataKuliah +"</td>"+
      "<td>" + NilaiAkhir + "</td>"+
      "<td>" + Grade +"</td>"+
      "<td>" + indeksNilai + "</td>"+
      "<td><button class='deleteButton' onclick='hapusData(this)'>Hapus</button></td>" +
 "</tr>";

    var hasilakhir = document.getElementById('nilaimahasiswa');
    hasilakhir.innerHTML +=data;
  }
  
  function hapusData(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }
  