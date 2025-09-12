# 📊 Optik Form Değerlendirme Aracı

Modern, modüler ve kullanıcı dostu bir optik form değerlendirme sistemi. VARK öğrenme stilleri, çalışma alışkanlıkları ve Holland mesleki ilgi envanterlerini analiz eder.

## ✨ Özellikler

### 🎯 Temel Özellikler
- **VARK Öğrenme Stili Analizi**: Görsel, İşitsel, Okuma/Yazma ve Kinestetik öğrenme stillerini değerlendirir
- **Çalışma Alışkanlıkları Değerlendirmesi**: 20 soruluk envanter ile öğrencilerin çalışma alışkanlıklarını analiz eder
- **Holland Mesleki İlgi Kodu**: 90 soruluk Holland testi ile mesleki ilgi alanlarını belirler
- **Yapay Zeka Destekli Değerlendirme**: Google Gemini AI entegrasyonu ile kişiselleştirilmiş geri bildirim

### 📈 Raporlama Özellikleri
- **Bireysel Öğrenci Raporları**: Her öğrenci için detaylı analiz ve öneriler
- **Sınıf Raporları**: Sınıf geneli için istatistiksel analizler
- **PDF Dışa Aktarma**: Raporları PDF formatında kaydetme
- **Rapor Saklama**: Analiz edilen verileri yerel depolama alanında saklama

### ⚙️ Teknik Özellikler
- **Özelleştirilebilir Optik Form Profilleri**: Farklı optik form formatları için profil oluşturma
- **Modüler Mimari**: ES6 modülleri ile organize edilmiş kod yapısı
- **Responsive Tasarım**: Mobil ve masaüstü cihazlarda uyumlu görünüm
- **Modern UI/UX**: Tailwind CSS ile geliştirilmiş kullanıcı arayüzü

## 🚀 Kurulum

### Gereksinimler
- Modern bir web tarayıcı (Chrome, Firefox, Safari, Edge)
- Node.js (opsiyonel, geliştirme sunucusu için)

### Adımlar

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/optik-form-degerlendirme.git
cd optik-form-degerlendirme
```

2. Bağımlılıkları yükleyin (opsiyonel):
```bash
npm install
```

3. Uygulamayı başlatın:

**Basit yöntem:** `public/index.html` dosyasını doğrudan tarayıcıda açın

**Geliştirme sunucusu ile:**
```bash
npm start
# veya
npm run dev
```

Uygulama varsayılan olarak http://localhost:3000 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
optik-form-degerlendirme/
├── public/
│   └── index.html              # Ana HTML dosyası
├── src/
│   ├── css/
│   │   └── styles.css          # Özel CSS stilleri
│   ├── js/
│   │   ├── config/
│   │   │   ├── inventories.js  # Envanter tanımlamaları
│   │   │   └── profiles.js     # Optik form profilleri
│   │   ├── modules/
│   │   │   ├── fileHandler.js  # Dosya işleme modülü
│   │   │   ├── reportGenerator.js # Rapor oluşturma modülü
│   │   │   ├── pdfExporter.js  # PDF dışa aktarma modülü
│   │   │   └── geminiIntegration.js # Gemini AI entegrasyonu
│   │   ├── utils/
│   │   │   ├── parser.js       # Dosya ayrıştırma araçları
│   │   │   ├── calculator.js   # Puan hesaplama araçları
│   │   │   └── storage.js      # Yerel depolama yönetimi
│   │   └── main.js             # Ana uygulama dosyası
├── package.json                # Proje bağımlılıkları
└── README.md                   # Bu dosya
```

## 🎯 Kullanım

### 1. Optik Form Verisi Yükleme

1. Uygulama açıldığında, optik form profilini seçin (varsayılan veya özel)
2. `.txt` formatındaki ham veri dosyasını yükleyin
3. Sistem otomatik olarak verileri ayrıştırıp analiz edecektir

### 2. Bireysel Rapor Görüntüleme

1. Öğrenci listesinden bir öğrenci seçin
2. VARK, Çalışma Alışkanlıkları ve Holland sonuçlarını inceleyin
3. "Geri Bildirim Oluştur" butonuna tıklayarak AI destekli değerlendirme alın
4. "PDF İndir" ile raporu kaydedin

### 3. Sınıf Raporu

1. "Sınıf Raporu" sekmesine geçin
2. Sınıf geneli istatistikleri ve dağılımları inceleyin
3. Güçlü ve geliştirilmesi gereken alanları belirleyin

### 4. Özel Profil Oluşturma

1. Ayarlar butonuna tıklayın
2. "Yeni" butonuyla yeni profil oluşturun
3. Optik formunuzdaki karakter pozisyonlarını girin
4. Profili kaydedin ve kullanmaya başlayın

## 🔧 Konfigürasyon

### Gemini AI API Anahtarı

Gemini AI özelliğini kullanmak için:

1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresinden API anahtarı alın
2. `src/js/modules/geminiIntegration.js` dosyasında API anahtarınızı ayarlayın
3. Veya uygulama ayarlarından API anahtarını girin

### Varsayılan Optik Form Formatı

Varsayılan Sekonic profili şu karakter pozisyonlarını kullanır:
- Ad Soyad: 16-35
- Holland: 62-151
- VARK: 189-196
- Çalışma Alışkanlıkları: 197-216

## 🤝 Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Dalınıza push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- Tailwind CSS ekibi
- jsPDF ve html2canvas geliştiricileri
- Google Gemini AI ekibi

## 📞 İletişim

Proje Sahibi - [@yourusername](https://twitter.com/yourusername)

Proje Linki: [https://github.com/yourusername/optik-form-degerlendirme](https://github.com/yourusername/optik-form-degerlendirme)

---

**Not:** Bu uygulama eğitim amaçlı geliştirilmiştir. Profesyonel kullanım için uygun testler ve doğrulamalar yapılmalıdır.