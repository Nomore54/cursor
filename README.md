# Optik Form Değerlendirme Aracı - Gelişmiş Versiyon

Bu proje, Sekonic optik form verilerini analiz ederek VARK öğrenme stilleri, çalışma alışkanlıkları ve Holland mesleki ilgi kodlarını değerlendiren bir web uygulamasıdır.

## Yeni Özellikler

### ✅ Tamamlanan Özellikler:
1. **Gemini API Key Girişi**: Ayarlar bölümünde elle API key girebileceğiniz alan eklendi
2. **Gelişmiş Ayarlar Modalı**: API key yönetimi ve optik form ayarları tek yerde

### 🚧 Devam Eden Geliştirmeler:
1. **Sınıf Raporu için Gemini Entegrasyonu**: Sınıf geneli için AI destekli analiz
2. **PDF Çıktısı**: Hem bireysel hem sınıf raporları için PDF oluşturma
3. **Kayıtlı Raporlar**: Verilerin saklanması ve yeniden yüklenmesi

## Dosya Yapısı

- `index.html` - Ana HTML dosyası (Gemini API key girişi eklendi)
- `app.js` - JavaScript kodu (geliştirme aşamasında)

## Özellikler

### Mevcut Özellikler:
- Sekonic `.txt` dosyalarını okuma
- VARK öğrenme stili analizi
- Çalışma alışkanlıkları değerlendirmesi
- Holland mesleki ilgi kodu hesaplama
- Bireysel ve sınıf raporları
- Özel optik form profilleri

### Yeni Eklenen:
- **Gemini API Key Yönetimi**: API key'inizi güvenli şekilde saklayın
- **Gelişmiş Ayarlar**: Tüm ayarlar tek bir modal içinde
- **Responsive Tasarım**: Mobil uyumlu arayüz

## Kurulum

1. Dosyaları web sunucusuna yükleyin
2. `index.html` dosyasını açın
3. Ayarlar butonuna tıklayarak Gemini API key'inizi girin
4. Optik form profilini seçin veya yeni profil oluşturun
5. `.txt` dosyanızı yükleyin

## API Key Alma

Google AI Studio'dan ücretsiz Gemini API key alabilirsiniz:
1. https://aistudio.google.com/ adresine gidin
2. "Get API key" butonuna tıklayın
3. Yeni API key oluşturun
4. Key'i kopyalayıp uygulamaya girin

## Güvenlik

- API key'ler sadece tarayıcınızda (localStorage) saklanır
- Hiçbir veri sunucuya gönderilmez
- Tüm işlemler istemci tarafında gerçekleşir

## Katkıda Bulunma

Bu proje açık kaynak kodludur. Geliştirmelere katkıda bulunmak için:
1. Projeyi fork edin
2. Yeni özellik dalı oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.