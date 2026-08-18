import { COMMERCE, SITE } from '#/lib/brand'

/**
 * Yasal sayfalar tek bir şablondan (LegalPageLayout) render edilir.
 * Doğrulanmamış şirket bilgileri SITE üzerinden gelir; boş oldukları sürece
 * künyede hiç görünmezler — burada asla uydurulmaz.
 */

export type LegalSection = { heading: string; body: Array<string> }

export type LegalPage = {
  slug: string
  title: string
  intro: string
  sections: Array<LegalSection>
}

/**
 * Satıcı künyesi. Doğrulanmamış alanlar BOŞ bırakılır ve listeye hiç
 * girmez — canlı bir ticari sayfada yer tutucu metin göstermeyiz.
 * Eksik kalanlar mevzuat açısından hâlâ tamamlanmalıdır.
 */
const SELLER_BLOCK = [
  `Unvan: ${SITE.legalName}`,
  `Adres: ${SITE.fullAddress}`,
  `E-posta: ${SITE.email}`,
  `Telefon: ${SITE.phone}`,
  SITE.mersis ? `MERSİS No: ${SITE.mersis}` : null,
  SITE.taxOffice && SITE.taxNumber
    ? `Vergi Dairesi / No: ${SITE.taxOffice} / ${SITE.taxNumber}`
    : null,
].filter((line): line is string => line !== null)

export const LEGAL_PAGES: Array<LegalPage> = [
  {
    slug: 'gizlilik',
    title: 'Gizlilik Politikası',
    intro:
      'Bu politika, luzayn.com üzerinden topladığımız kişisel verilerin hangi amaçlarla işlendiğini ve nasıl korunduğunu açıklar.',
    sections: [
      {
        heading: 'Veri sorumlusu',
        body: SELLER_BLOCK,
      },
      {
        heading: 'Toplanan veriler',
        body: [
          'Sipariş sürecinde: ad, soyad, e-posta, telefon, teslimat ve fatura adresi, T.C. kimlik numarası (fatura ve ödeme mevzuatı gereği).',
          'İletişim formunda: ad, e-posta, telefon (isteğe bağlı) ve mesaj içeriği.',
          'Teknik olarak: IP adresi, tarayıcı bilgisi ve sitede gezinme kayıtları.',
          'Ödeme kartı bilgileri tarafımızca görülmez ve saklanmaz; ödeme, iyzico altyapısı üzerinden alınır.',
        ],
      },
      {
        heading: 'İşleme amaçları',
        body: [
          'Siparişin oluşturulması, ödemenin alınması, faturalandırma ve teslimatın sağlanması.',
          'İletişim taleplerinin yanıtlanması.',
          'Yasal saklama ve bilgi verme yükümlülüklerinin yerine getirilmesi.',
        ],
      },
      {
        heading: 'Aktarım',
        body: [
          'Veriler yalnızca hizmetin sağlanması için gerekli olan ölçüde; ödeme kuruluşu (iyzico), kargo firması, muhasebe ve e-posta altyapısı sağlayıcılarıyla paylaşılır.',
          'Yasal olarak yetkili kamu kurumlarının talepleri saklıdır.',
        ],
      },
      {
        heading: 'Saklama süresi',
        body: [
          'Sipariş ve fatura verileri, ilgili mevzuatın öngördüğü süre boyunca saklanır.',
          'İletişim formu kayıtları, talebin sonuçlanmasının ardından makul bir süre içinde silinir.',
        ],
      },
      {
        heading: 'Haklarınız',
        body: [
          `6698 sayılı KVKK kapsamındaki haklarınızı kullanmak için ${SITE.email} adresine yazabilirsiniz. Ayrıntı için KVKK Aydınlatma Metni sayfasına bakın.`,
        ],
      },
    ],
  },
  {
    slug: 'kullanim-kosullari',
    title: 'Kullanım Koşulları',
    intro: 'luzayn.com’u kullanarak aşağıdaki koşulları kabul etmiş olursunuz.',
    sections: [
      {
        heading: 'Sitenin amacı',
        body: [
          'Bu site, takviye edici gıda ürünlerinin tanıtımı ve satışı için kullanılır.',
          'Sitedeki içerikler bilgilendirme amaçlıdır; tıbbi tavsiye, teşhis veya tedavi yerine geçmez. Sağlığınızla ilgili kararlar için hekiminize danışın.',
        ],
      },
      {
        heading: 'İçerik ve fikri mülkiyet',
        body: [
          'Sitedeki metin, görsel, video ve tasarım unsurları üzerindeki haklar saklıdır; izinsiz kopyalanamaz ve çoğaltılamaz.',
        ],
      },
      {
        heading: 'Ürün bilgileri',
        body: [
          'Ürün açıklamalarındaki bileşen ve miktar bilgileri ambalaj üzerindeki bilgilere dayanır. Ambalaj bilgisi ile site bilgisi arasında farklılık olması hâlinde ambalaj esas alınır.',
          'Fiyatlar ve stok durumu önceden bildirilmeksizin değiştirilebilir. Sipariş anında geçerli olan fiyat uygulanır.',
        ],
      },
      {
        heading: 'Sorumluluk',
        body: [
          'Ürünler tavsiye edilen porsiyonda kullanılmak üzere sunulur. Tavsiye edilen porsiyonun aşılması veya ambalajdaki uyarılara uyulmaması hâlinde doğabilecek sonuçlardan kullanıcı sorumludur.',
        ],
      },
    ],
  },
  {
    slug: 'mesafeli-satis',
    title: 'Mesafeli Satış Sözleşmesi',
    intro:
      '6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenlenmiştir.',
    sections: [
      {
        heading: 'Satıcı bilgileri',
        body: SELLER_BLOCK,
      },
      {
        heading: 'Sözleşmenin konusu',
        body: [
          'İşbu sözleşme, alıcının luzayn.com üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerini düzenler.',
          'Siparişe konu ürünlerin adı, adedi, satış fiyatı ve teslimat bilgileri sipariş özetinde ve fatura üzerinde yer alır.',
        ],
      },
      {
        heading: 'Ödeme',
        body: [
          'Ödeme, Shopify ödeme sayfası üzerinden iyzico altyapısıyla kredi/banka kartı ile alınır. Kart bilgileri satıcı tarafından görülmez ve saklanmaz.',
        ],
      },
      {
        heading: 'Teslimat',
        body: [
          `Kargo ücreti, seçilen teslimat yöntemine göre ödeme adımında hesaplanır ve sipariş özetinde gösterilir. Yurt içi standart teslimat ücreti ${COMMERCE.standardShippingFee} TL'dir.`,
          'Ürün, sipariş onayının ardından anlaşmalı kargo firmasına teslim edilir. Teslimat süresi kargo firmasının bölgeye göre değişen takvimine bağlıdır.',
        ],
      },
      {
        heading: 'Cayma hakkı',
        body: [
          `Alıcı, teslimattan itibaren ${COMMERCE.returnDays} gün içinde hiçbir gerekçe göstermeksizin cayma hakkını kullanabilir.`,
          'Cayma hakkı, ambalajı açılmamış, kullanılmamış ve yeniden satılabilir durumdaki ürünler için geçerlidir.',
          'Mesafeli Sözleşmeler Yönetmeliği’nin 15. maddesi uyarınca, tesliminden sonra ambalajı açılmış olan ve sağlık ile hijyen açısından iadesi uygun olmayan ürünlerde cayma hakkı kullanılamaz.',
          `Cayma bildirimi ${SITE.email} adresine yapılabilir.`,
        ],
      },
      {
        heading: 'Uyuşmazlık',
        body: [
          'Uyuşmazlıklarda, Ticaret Bakanlığı’nca ilan edilen parasal sınırlar çerçevesinde alıcının yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.',
        ],
      },
    ],
  },
  {
    slug: 'kvkk',
    title: 'KVKK Aydınlatma Metni',
    intro:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 10. maddesi kapsamında hazırlanmıştır.',
    sections: [
      {
        heading: 'Veri sorumlusunun kimliği',
        body: SELLER_BLOCK,
      },
      {
        heading: 'İşleme amacı ve hukuki sebep',
        body: [
          'Kişisel verileriniz; sözleşmenin kurulması ve ifası (KVKK m.5/2-c), hukuki yükümlülüğün yerine getirilmesi (m.5/2-ç) ve meşru menfaat (m.5/2-f) hukuki sebeplerine dayanılarak işlenir.',
          'Pazarlama amaçlı iletişim yalnızca açık rızanız bulunması hâlinde yapılır.',
        ],
      },
      {
        heading: 'Toplama yöntemi',
        body: [
          'Veriler; sipariş formu, iletişim formu ve site kullanımınız sırasında elektronik ortamda otomatik ve kısmen otomatik yollarla toplanır.',
        ],
      },
      {
        heading: 'İlgili kişinin hakları',
        body: [
          'Kanun’un 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, işlenme amacını öğrenme, düzeltilmesini veya silinmesini isteme, aktarıldığı üçüncü kişileri bilme ve zararın giderilmesini talep etme haklarına sahipsiniz.',
          `Başvurularınızı ${SITE.email} adresine iletebilirsiniz. Başvurular en geç 30 gün içinde sonuçlandırılır.`,
        ],
      },
    ],
  },
  {
    slug: 'cerez-politikasi',
    title: 'Çerez Politikası',
    intro:
      'Bu politika, luzayn.com’da kullanılan çerezleri ve tercihlerinizi nasıl yönetebileceğinizi açıklar.',
    sections: [
      {
        heading: 'Kullanılan çerezler',
        body: [
          'Zorunlu çerezler: sepetinizin ve oturumunuzun çalışması için gereklidir; devre dışı bırakılamaz.',
          'Tercih çerezleri: dil ve görünüm gibi seçimlerinizi hatırlar.',
          'Analitik çerezler: sitenin nasıl kullanıldığını anlamamıza yardımcı olur ve yalnızca onayınızla çalışır.',
        ],
      },
      {
        heading: 'Sepet verisi',
        body: [
          'Sepetiniz tarayıcınızın yerel depolamasında (localStorage) tutulur; sunucuya gönderilmez. Tarayıcı verilerinizi temizlediğinizde sepet de silinir.',
        ],
      },
      {
        heading: 'Tercihlerinizi yönetme',
        body: [
          'Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezleri engellemeniz hâlinde sepet ve ödeme adımları çalışmayabilir.',
        ],
      },
    ],
  },
  {
    slug: 'kargo-ve-teslimat',
    title: 'Kargo ve Teslimat',
    intro:
      'Siparişinizin hazırlanması ve size ulaşması hakkında bilmeniz gerekenler.',
    sections: [
      {
        heading: 'Hazırlama süresi',
        body: [
          'Saat 15:00’e kadar verilen ve ödemesi onaylanan siparişler aynı iş günü içinde hazırlanır. Hafta sonu ve resmî tatillerde verilen siparişler takip eden ilk iş gününde işleme alınır.',
        ],
      },
      {
        heading: 'Kargo ücreti',
        body: [
          `Yurt içi standart teslimat ücreti ${COMMERCE.standardShippingFee} TL'dir. Hızlı teslimat seçeneği farklı ücretlendirilir.`,
          'Geçerli kargo ücreti, teslimat adresiniz ve seçtiğiniz yöntem belirlendikten sonra ödeme adımında gösterilir.',
        ],
      },
      {
        heading: 'Teslimat',
        body: [
          'Teslimat, anlaşmalı kargo firması aracılığıyla belirttiğiniz adrese yapılır. Teslimat süresi bölgeye göre değişir.',
          'Teslim alırken paketi kargo görevlisinin yanında kontrol edin. Hasarlı paketlerde tutanak tutturarak teslim almayın ve bizimle iletişime geçin.',
        ],
      },
      {
        heading: 'İade',
        body: [
          `Ambalajı açılmamış ürünler için ${COMMERCE.returnDays} gün içinde iade hakkınız vardır. Ambalajı açılmış takviye edici gıdalar, hijyen gerekçesiyle iade kapsamı dışındadır.`,
          `İade talebiniz için ${SITE.email} adresine sipariş numaranızla yazın.`,
        ],
      },
    ],
  },
  {
    slug: 'siparis-takibi',
    title: 'Sipariş Takibi',
    intro: 'Siparişinizin durumunu nasıl öğrenebileceğinizi anlatır.',
    sections: [
      {
        heading: 'Sipariş referansınız',
        body: [
          'Ödeme tamamlandığında ekranda ve e-postanızda bir sipariş referansı görürsünüz. Tüm yazışmalarda bu referansı belirtin.',
        ],
      },
      {
        heading: 'Kargo takip numarası',
        body: [
          'Siparişiniz kargoya verildiğinde takip numarası e-posta ile iletilir. Numarayı kargo firmasının sitesinde sorgulayabilirsiniz.',
        ],
      },
      {
        heading: 'Yardım',
        body: [
          `Siparişinizle ilgili her konuda ${SITE.email} adresinden veya iletişim sayfasındaki formdan bize ulaşabilirsiniz.`,
        ],
      },
    ],
  },
]

export const LEGAL_BY_SLUG = Object.fromEntries(
  LEGAL_PAGES.map((p) => [p.slug, p]),
) as Record<string, LegalPage>
