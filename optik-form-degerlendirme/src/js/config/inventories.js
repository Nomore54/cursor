/**
 * Inventory Configuration
 * Contains all inventory definitions and related data
 */

export const inventories = {
    vark: {
        questions: Array(8),
        styles: {
            V: "Görsel",
            A: "İşitsel",
            R: "Okuma/Yazma",
            K: "Kinestetik"
        },
        details: {
            V: {
                title: "Görsel Öğrenme",
                desc: "Bilgiyi görsel materyallerle (şemalar, haritalar, grafikler, resimler) gördüğünüzde daha iyi anlıyorsunuz. Soyut kavramları görselleştirmek sizin için önemlidir.",
                oneriler: [
                    "Ders notlarınızı renkli kalemlerle düzenleyin ve önemli yerlerin altını çizin.",
                    "Karmaşık konuları anlamak için zihin haritaları veya kavram haritaları oluşturun.",
                    "Konuyla ilgili videoları, belgeselleri ve eğitici animasyonları izleyin.",
                    "Formülleri veya anahtar kelimeleri post-it'lere yazıp sık gördüğünüz yerlere asın."
                ]
            },
            A: {
                title: "İşitsel Öğrenme",
                desc: "Bilgiyi dinleyerek ve konuşarak daha etkili işliyorsunuz. Tartışmalar, sesli anlatımlar ve tekrarlar öğrenme sürecinizin temelini oluşturur.",
                oneriler: [
                    "Dersleri ses kaydına alıp daha sonra tekrar dinleyin.",
                    "Konuları bir arkadaşınızla tartışın veya kendi kendinize sesli olarak anlatın.",
                    "Çalışırken aklınızda kalması için anahtar kelimeleri veya formülleri ritmik bir şekilde tekrar edin.",
                    "Sessiz bir ortamda çalışmak yerine, konsantrasyonunuzu artırıyorsa hafif bir enstrümantal müzik dinleyebilirsiniz."
                ]
            },
            R: {
                title: "Okuma/Yazma ile Öğrenme",
                desc: "Yazılı metinler sizin için en güçlü öğrenme aracıdır. Okumak, not almak ve listeler oluşturmak bilgiyi organize etmenize ve hatırlamanıza yardımcı olur.",
                oneriler: [
                    "Derslerde ve okumalarınızda bol bol detaylı not tutun.",
                    "Okuduğunuz bir bölümün özetini kendi cümlelerinizle yazın.",
                    "Anahtar kavramları ve tanımlarını listeleyin.",
                    "Testlere hazırlanırken kendi soru-cevap kartlarınızı hazırlayın."
                ]
            },
            K: {
                title: "Kinestetik Öğrenme",
                desc: "En iyi yaparak ve deneyimleyerek öğreniyorsunuz. Fiziksel olarak sürece dahil olmak, soyut bilgileri somutlaştırmanızı sağlar.",
                oneriler: [
                    "Ders çalışırken kısa ve sık molalar vererek hareket edin.",
                    "Konuları canlandırma (role-playing) veya drama yoluyla öğrenmeyi deneyin.",
                    "Laboratuvar çalışmaları, maket yapımı gibi uygulamalı projelere katılın.",
                    "Soyut bir kavramı öğrenirken onu temsil eden fiziksel nesneler kullanın (örneğin, matematik problemi için fasulye taneleri)."
                ]
            }
        }
    },
    
    workHabits: {
        questions: Array(20),
        categories: {
            "Planlama ve Organizasyon": [1, 2, 4, 11, 16, 20],
            "Dikkat ve Çalışma Ortamı": [3, 5, 12, 13],
            "Aktif Öğrenme Yöntemleri": [6, 7, 8, 14, 15, 18],
            "İstikrar ve Motivasyon": [9, 10, 17, 19]
        },
        reverseQuestions: [3, 5, 9],
        categoryDetails: {
            "Planlama ve Organizasyon": {
                iyi: "Planlama ve organize olma konusunda başarılısınız. Bu, hedeflerinize ulaşmanızı kolaylaştırır.",
                orta: "Planlama yapıyorsunuz ancak bazen uymakta zorlanıyorsunuz. Planlarınızı daha gerçekçi hale getirmeyi deneyin.",
                zayif: "Plansızlık, zaman yönetimi sorunlarına ve strese yol açabilir. Küçük adımlarla başlayarak haftalık planlar yapmayı deneyin."
            },
            "Dikkat ve Çalışma Ortamı": {
                iyi: "Çalışma ortamınızı ve dikkatinizi yönetme konusunda çok iyisiniz. Bu, verimliliğinizi en üst düzeye çıkarır.",
                orta: "Dikkatiniz zaman zaman dağılabiliyor. Pomodoro tekniği gibi kısa molalı çalışma seansları size yardımcı olabilir.",
                zayif: "Dikkat dağıtıcılar öğrenmenizi olumsuz etkiliyor. Çalışmaya başlamadan önce telefonunuzu sessize alın ve çalışma alanınızı sadece ders için kullanın."
            },
            "Aktif Öğrenme Yöntemleri": {
                iyi: "Öğrenme sürecine aktif olarak katılıyorsunuz. Not almak, soru sormak gibi yöntemler bilgiyi kalıcı hale getirir.",
                orta: "Aktif öğrenme yöntemlerini bazen kullanıyorsunuz. Anlamadığınız yerleri sormaktan ve konuları kendi cümlelerinizle özetlemekten çekinmeyin.",
                zayif: "Daha çok pasif bir dinleyici olabilirsiniz. Derste not tutarak, konuları tekrar ederken kendi kendinize anlatarak sürece daha fazla dahil olun."
            },
            "İstikrar ve Motivasyon": {
                iyi: "İstikrarlı ve motive bir şekilde çalışıyorsunuz. Bu, uzun vadeli başarı için en önemli anahtardır.",
                orta: "Motivasyonunuz zaman zaman düşebiliyor. Kendinize küçük hedefler koymak ve başardığınızda kendinizi ödüllendirmek motivasyonunuzu artırabilir.",
                zayif: "Erteleme eğiliminiz ve motivasyon eksikliğiniz olabilir. Çalışma hedeflerinizi daha küçük ve yönetilebilir parçalara bölün."
            }
        }
    },
    
    holland: {
        questions: generateHollandQuestions(),
        types: {
            R: {
                title: "Gerçekçi",
                keywords: "Pratik, Bağımsız, Fiziksel, Mekanik",
                desc: "Aletler, makineler ve hayvanlarla çalışmayı, genellikle açık havada olmayı tercih ederler. Problem çözmede somut ve pratik yaklaşımları vardır.",
                jobs: "Mühendislik (Makine, Elektrik, İnşaat), Ziraat, Ormancılık, Polislik, Pilotluk, Beden Eğitimi Öğretmenliği, Teknisyenlik",
                majors: "Mühendislik Fakülteleri, Ziraat Fakültesi, Spor Bilimleri Fakültesi, Meslek Yüksekokulları (Teknik Programlar)"
            },
            I: {
                title: "Araştırmacı",
                keywords: "Analitik, Meraklı, Gözlemci, Bilimsel",
                desc: "Fikirlerle çalışmayı, problem çözmeyi ve karmaşık konuları anlamayı severler. Gözlem yapma, araştırma ve analiz etme yetenekleri güçlüdür.",
                jobs: "Tıp, Biyoloji, Kimya, Fizik, Eczacılık, Yazılım Geliştirme, Akademisyenlik, Pazar Araştırmacısı, Bilim İnsanı",
                majors: "Tıp Fakültesi, Fen-Edebiyat Fakülteleri (Temel Bilimler), Eczacılık, Mühendislik (Bilgisayar, Yazılım)"
            },
            A: {
                title: "Artistik (Sanatçı)",
                keywords: "Yaratıcı, Sezgisel, Bağımsız, İdealist",
                desc: "Yapılandırılmamış ortamlarda sanatsal ifade ve yaratıcılık yoluyla çalışmayı severler. Hayal güçleri geniştir ve kendilerini özgün yollarla ifade ederler.",
                jobs: "Grafik Tasarım, Mimarlık, Müzik, Tiyatro, Yazarlık, Resim Öğretmenliği, Fotoğrafçılık, Moda Tasarımı",
                majors: "Güzel Sanatlar Fakültesi, Mimarlık Fakültesi, İletişim Fakültesi (Radyo-TV-Sinema, Görsel İletişim Tasarımı)"
            },
            S: {
                title: "Sosyal",
                keywords: "Yardımsever, İşbirlikçi, Empatik, Sabırlı",
                desc: "İnsanlarla çalışmayı, onlara yardım etmeyi, eğitmeyi ve sorunlarını çözmeyi severler. İletişim becerileri güçlüdür.",
                jobs: "Psikoloji, PDR, Öğretmenlik, Sosyal Hizmetler, Hemşirelik, Halkla İlişkiler, İnsan Kaynakları",
                majors: "Eğitim Fakültesi, Psikoloji, PDR, Sosyal Hizmetler, Hemşirelik, İletişim Fakültesi"
            },
            E: {
                title: "Girişimci",
                keywords: "Hırslı, Dışa Dönük, İkna Edici, Enerjik",
                desc: "İnsanları yönetmeyi, ikna etmeyi ve örgütsel hedeflere ulaşmayı severler. Liderlik ve konuşma becerileri gelişmiştir.",
                jobs: "İşletme, Pazarlama, Yöneticilik, Avukatlık, Siyaset Bilimi, Turizm İşletmeciliği, Emlakçılık, Satış",
                majors: "İktisadi ve İdari Bilimler Fakültesi (İşletme, İktisat), Hukuk Fakültesi, Siyasal Bilgiler Fakültesi, Turizm Fakültesi"
            },
            C: {
                title: "Gelenekçi (Düzenli)",
                keywords: "Düzenli, Dikkatli, Sorumlu, Pratik",
                desc: "Verilerle çalışmayı, bilgileri düzenlemeyi ve belirli kurallara uymayı severler. Detaylara dikkat ederler ve organize ortamlarda başarılıdırlar.",
                jobs: "Muhasebe, Bankacılık, Finans, Kütüphanecilik, Sekreterlik, Veri Analistliği, Aktüerya",
                majors: "İİBF (Maliye, Ekonometri), Bankacılık ve Sigortacılık, Kütüphanecilik, Tıbbi Sekreterlik"
            }
        }
    }
};

/**
 * Generate Holland questions array
 * @returns {Array} Array of Holland question objects
 */
function generateHollandQuestions() {
    const types = ['R', 'I', 'A', 'S', 'E', 'C'];
    const questions = [];
    
    // 15 rounds of 6 questions (one for each type)
    for (let round = 0; round < 15; round++) {
        for (const type of types) {
            questions.push({ type });
        }
    }
    
    return questions;
}

/**
 * Answer mappings for different inventories
 */
export const answerMappings = {
    vark: { 'A': 'V', 'B': 'A', 'C': 'R', 'D': 'K' },
    holland: { 'A': 1, 'B': 0 },
    habits: { 'A': 3, 'B': 2, 'C': 1 }
};