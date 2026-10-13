# Branch Notes: Telefon ve bilgisayar arasında eşitleme (Firebase)

Bu rehber bir kez yapılır, yaklaşık 10 dakika sürer. Sonunda telefonda ve bilgisayarda aynı hesapla giriş yaparsınız ve haritalarınız, resimleriniz ve dosyalarınız iki cihazda da canlı olarak aynı olur.

**Kart bilgisi gerekmez.** Uygulama Firebase'in ücretsiz planında (Spark) çalışır. Resimler ve dosyalar da veritabanının içinde saklanır, bu yüzden kart isteyen "Storage" hizmeti kullanılmaz.

Ücretsiz planın sınırları kişisel kullanım için fazlasıyla yeterli:

| | Ücretsiz sınır |
| --- | --- |
| Toplam depolama | 1 GB |
| Okuma | Günde 50.000 |
| Yazma | Günde 20.000 |
| Tek bir haritanın boyutu | 1 MB (yaklaşık 150.000 kelime not) |
| Tek bir resim veya dosya | 15 MB |

Başlamadan önce uygulamanın GitHub Pages'te yayında olması gerekir (README.md'deki adımlar). Adresi şuna benzer: `https://kullaniciadiniz.github.io/branch-notes/`

---

## 1. Firebase projesi oluşturun

1. <https://console.firebase.google.com> adresine Google hesabınızla girin.
2. **Proje oluştur** (Create a project) düğmesine basın.
3. Bir ad verin, örneğin `branch-notes`.
4. Google Analytics sorulursa **kapatın**, gerekmiyor.
5. **Proje oluştur** deyin ve bitmesini bekleyin.

## 2. Web uygulaması ekleyin ve ayarları kopyalayın

1. Proje ana sayfasında **`</>`** (Web) simgesine basın.
2. Takma ad olarak `Branch Notes` yazın. "Firebase Hosting" kutusunu **işaretlemeyin**.
3. **Uygulamayı kaydet** (Register app) deyin.
4. Ekranda `const firebaseConfig = { ... };` şeklinde bir kod çıkar. **Süslü parantezlerin içindeki kısmı** kopyalayın (apiKey, authDomain, projectId… satırları).

Bu bilgiyi sonradan bulmak isterseniz: dişli simgesi → **Proje ayarları** → aşağıda **Uygulamalarınız** bölümü.

## 3. Giriş yöntemlerini açın

1. Sol menüden **Build → Authentication** bölümüne girin ve **Başlayın** (Get started) deyin.
2. **Sign-in method** sekmesinde:
   - **Google**'ı seçin, **Etkinleştir**'i açın, destek e-postası olarak kendi adresinizi seçip **Kaydet** deyin.
   - **E-posta/Şifre**'yi (Email/Password) seçin, ilk anahtarı açıp **Kaydet** deyin.

## 4. GitHub adresinize izin verin

1. Hâlâ Authentication içindeyken **Settings** sekmesine geçin.
2. **Authorized domains** bölümünde **Add domain** deyin.
3. Sadece şunu yazın: `kullaniciadiniz.github.io` (başında `https://`, sonunda `/branch-notes` olmadan).
4. **Add** deyin.

Bu adımı atlarsanız uygulama "This web address isn't allowed yet" der.

## 5. Veritabanını oluşturun ve kilitleyin

1. Sol menüden **Build → Firestore Database** bölümüne girin ve **Veritabanı oluştur** (Create database) deyin.
2. Konum olarak size yakın bir bölge seçin. Avrupa için `eur3 (europe-west)` uygundur. Bu sonradan değiştirilemez.
3. **Production mode** (Üretim modu) seçin ve oluşturun.
4. Oluşunca üstteki **Rules** (Kurallar) sekmesine geçin.
5. Oradaki her şeyi silin. Bu klasördeki `firestore.rules` dosyasının içeriğini yapıştırın:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

6. **Yayınla** (Publish) deyin.

Bu kural, herkesin yalnızca kendi haritalarını görebilmesini sağlar. Atlarsanız uygulama "Sync was refused" der.

## 6. Ayarları GitHub'a yapıştırın

1. GitHub'da deponuzu açın ve `firebase-config.js` dosyasına tıklayın.
2. Sağ üstteki kalem simgesiyle (Edit) düzenlemeye açın.
3. En alttaki satırı bulun:

   ```js
   window.BRANCH_NOTES_FIREBASE = null;
   ```

4. `null` yerine 2. adımda kopyaladığınız kısmı süslü parantezleriyle birlikte yapıştırın. Sonuç şöyle görünmeli:

   ```js
   window.BRANCH_NOTES_FIREBASE = {
     apiKey: "AIza...",
     authDomain: "branch-notes-xxxx.firebaseapp.com",
     projectId: "branch-notes-xxxx",
     storageBucket: "branch-notes-xxxx.firebasestorage.app",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```

5. **Commit changes** deyin.

Bu bilgiler gizli değildir, depoda görünmesinde sakınca yok. Verilerinizi giriş sistemi ve 5. adımdaki kural korur.

## 7. Giriş yapın

1. Bir dakika bekleyin, sonra uygulamanın adresini açın. Açıksa sayfayı yenileyin.
2. Sağ üstte **Sign in to sync** düğmesi çıkar.
3. **Continue with Google** ile ya da e-posta ve şifreyle giriş yapın. İlk kez e-postayla girecekseniz **Create account** deyin.
4. Bu cihazda daha önce oluşturduğunuz haritalar varsa üstte **Upload to my account** teklifi çıkar. Basarsanız haritalarınız hesabınıza taşınır.

**Telefonda:** Aynı adresi telefonun tarayıcısında açın ve **aynı hesapla** giriş yapın. Ana ekrana eklemek için:
- **Android (Chrome):** Menü → **Uygulamayı yükle** ya da **Ana ekrana ekle**.
- **iPhone (Safari):** Paylaş düğmesi → **Ana Ekrana Ekle**.

Ana ekrana eklenmiş uygulamada Google ile giriş penceresi açılmazsa e-posta ve şifreyle giriş yapın.

---

## Bilmeniz gerekenler

- **İnternetsiz çalışır.** Değişiklikler cihazda saklanır, internet gelince kendiliğinden gönderilir. Sağ üstteki durum yazısı bunu gösterir: "Synced" ya da "Offline · saved here".
- **Aynı haritayı iki cihazda aynı anda düzenlemeyin.** Son kaydedilen değişiklik diğerinin üzerine yazar. Farklı haritaları aynı anda düzenlemekte sakınca yok.
- **Çıkış yaparsanız** uygulama o cihazda giriş yapmadan önceki haritaları gösterir. Hesabınızdaki haritalar silinmez, tekrar girince geri gelir.
- **Claude'daki Branch Notes'tan taşımak için:** Claude'daki sürümde sol alttaki **Export** ile yedek alın. Bu uygulamada giriş yaptıktan sonra **Import** ile o dosyayı yükleyin. Haritalar, resimler ve dosyalar doğrudan hesabınıza gider.
- **Yedek:** Arada bir **Export** ile yedek almak yine iyi bir alışkanlıktır.

## Sorun giderme

| Uygulamanın mesajı | Ne yapmalı |
| --- | --- |
| This web address isn't allowed yet | 4. adım: GitHub adresinizi Authorized domains'e ekleyin. |
| This sign-in method is turned off | 3. adım: Google ve E-posta/Şifre girişini açın. |
| Sync was refused | 5. adım: Kuralları yapıştırıp Yayınla deyin. |
| Sync couldn't start… Check firebase-config.js | 6. adım: Yapıştırdığınız metinde eksik tırnak, virgül ya da parantez olabilir. |
| "Sign in to sync" düğmesi hiç çıkmıyor | Ayarlar henüz yüklenmemiş. Sayfayı yenileyin; olmazsa 6. adımı kontrol edin. |
| Your browser blocked the sign-in window | Tarayıcıda bu site için açılır pencerelere izin verin ya da e-postayla girin. |
