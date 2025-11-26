export async function getMenuRiskGroups(menu) {
  const client = getClient();
  if (!client) return null; // Gemini disabled

  try {
    const prompt = `
Kamu adalah asisten informasi umum tentang makanan dan minuman.
Kamu BUKAN dokter dan jawabanmu hanyalah informasi umum, bukan diagnosis.

Berikut informasi menu:

Nama: ${menu.name}
Kategori: ${menu.category}
Kalori (perkiraan): ${menu.calories}
Bahan: ${menu.ingredients.join(', ')}
Deskripsi: ${menu.description || '(tidak ada deskripsi)'}

Tugasmu:
1. Sebutkan beberapa kondisi kesehatan umum (misalnya: diabetes, hipertensi, kolesterol tinggi, maag/GERD, gangguan ginjal, alergi tertentu) yang secara UMUM perlu lebih berhati-hati terhadap menu seperti ini, jika memang relevan.
2. Untuk setiap kondisi, jelaskan singkat alasannya dalam 1 kalimat.
3. Jika menurutmu tidak ada perhatian khusus yang jelas, kamu boleh mengembalikan array kosong untuk sensitive_groups.
4. Pastikan untuk tidak memberikan diagnosis atau pengobatan 
5. Pastikan untuk tidak menyuruh mengganti obat ataupun menghentikan pengobatan 
6. Pastikan untuk selalu isi field "disclaimer" 

Format jawaban:
BALAS HANYA DENGAN JSON MURNI, dengan struktur:

{
  "sensitive_groups": [
    {
      "condition": "nama kondisi (contoh: diabetes)",
      "reason": "penjelasan singkat dalam bahasa Indonesia"
    }
  ],
  "disclaimer": "kalimat yang menjelaskan bahwa ini hanyalah informasi umum dan bukan nasihat dokter"
}
`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text?.trim();
    if (!rawText) return null;

    try {
      const parsed = JSON.parse(rawText);

      if (!Array.isArray(parsed.sensitive_groups)) {
        parsed.sensitive_groups = [];
      }
      if (!parsed.disclaimer) {
        parsed.disclaimer =
          'Informasi ini bersifat umum dan tidak bersifat menggantikan saran dokter atau profesional medis.';
      }

      return parsed;
    } catch (jsonErr) {
      console.error('Gemini getMenuRiskGroups JSON parse error:', jsonErr.message);
      console.error('Raw Gemini output:', rawText);
      return null;
    }
  } catch (err) {
    console.error('Gemini getMenuRiskGroups error:', err.message);
    return null;
  }
}
