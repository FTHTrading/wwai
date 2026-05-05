/**
 * src/lib/i18n/dictionary.ts
 * Core WWAI UI translations.
 *
 * Keys are English-based identifiers. Values are translation strings.
 * Non-English entries are demo-quality. Production requires reviewed language packs.
 */

export type DictionaryKey =
  | "askWWAI"
  | "findFood"
  | "findRide"
  | "hotelRoutes"
  | "findOffers"
  | "findBars"
  | "getBack"
  | "planRoute"
  | "registerBusiness"
  | "demoMode"
  | "safetyRoute"
  | "productionNotice"
  | "emergencyNotice"
  | "slogan"
  | "poweredBy"
  | "send"
  | "listening"
  | "speak"
  | "stop"
  | "playResponse"
  | "voiceNotConfigured"
  | "textModeOnly"
  | "voiceNotSupported"
  | "demoMultilingualNotice";

export type Dictionary = Record<DictionaryKey, string>;
export type TranslationMap = Record<string, Dictionary>;

const translations: TranslationMap = {
  en: {
    askWWAI:               "Ask WWAI",
    findFood:              "Find Food",
    findRide:              "Find a Ride",
    hotelRoutes:           "Hotel Routes",
    findOffers:            "Find Offers",
    findBars:              "Find Bars",
    getBack:               "Get Back to Hotel",
    planRoute:             "Plan a Route",
    registerBusiness:      "Register Your Business",
    demoMode:              "Demo mode",
    safetyRoute:           "Safety-informed demo route",
    productionNotice:      "Production requires live data",
    emergencyNotice:       "For emergencies, contact local emergency services immediately.",
    slogan:                "Not sure where to go? WhichWay AI knows.",
    poweredBy:             "Powered by TROPTIONS",
    send:                  "Send",
    listening:             "Listening…",
    speak:                 "Speak",
    stop:                  "Stop",
    playResponse:          "Play response",
    voiceNotConfigured:    "Voice not configured",
    textModeOnly:          "Text mode only",
    voiceNotSupported:     "Voice recording not supported in this browser",
    demoMultilingualNotice: "Demo multilingual mode. Production translations require reviewed language packs.",
  },
  es: {
    askWWAI:               "Pregunta a WWAI",
    findFood:              "Buscar comida",
    findRide:              "Buscar transporte",
    hotelRoutes:           "Rutas al hotel",
    findOffers:            "Buscar ofertas",
    findBars:              "Buscar bares",
    getBack:               "Volver al hotel",
    planRoute:             "Planificar ruta",
    registerBusiness:      "Registra tu negocio",
    demoMode:              "Modo demo",
    safetyRoute:           "Ruta de demostración informada por seguridad",
    productionNotice:      "La producción requiere datos en vivo",
    emergencyNotice:       "En caso de emergencia, contacta los servicios de emergencia locales de inmediato.",
    slogan:                "¿No sabes a dónde ir? WhichWay AI lo sabe.",
    poweredBy:             "Desarrollado por TROPTIONS",
    send:                  "Enviar",
    listening:             "Escuchando…",
    speak:                 "Hablar",
    stop:                  "Detener",
    playResponse:          "Reproducir respuesta",
    voiceNotConfigured:    "Voz no configurada",
    textModeOnly:          "Solo modo de texto",
    voiceNotSupported:     "Grabación de voz no compatible en este navegador",
    demoMultilingualNotice: "Modo multilingüe de demostración. La producción requiere paquetes de idiomas revisados.",
  },
  fr: {
    askWWAI:               "Demander à WWAI",
    findFood:              "Trouver à manger",
    findRide:              "Trouver un trajet",
    hotelRoutes:           "Itinéraires vers l'hôtel",
    findOffers:            "Trouver des offres",
    findBars:              "Trouver des bars",
    getBack:               "Retourner à l'hôtel",
    planRoute:             "Planifier un itinéraire",
    registerBusiness:      "Enregistrer votre entreprise",
    demoMode:              "Mode démo",
    safetyRoute:           "Itinéraire démo sécurisé",
    productionNotice:      "La production nécessite des données en direct",
    emergencyNotice:       "En cas d'urgence, contactez immédiatement les services d'urgence locaux.",
    slogan:                "Vous ne savez pas où aller ? WhichWay AI le sait.",
    poweredBy:             "Propulsé par TROPTIONS",
    send:                  "Envoyer",
    listening:             "En écoute…",
    speak:                 "Parler",
    stop:                  "Arrêter",
    playResponse:          "Lire la réponse",
    voiceNotConfigured:    "Voix non configurée",
    textModeOnly:          "Mode texte uniquement",
    voiceNotSupported:     "Enregistrement vocal non pris en charge dans ce navigateur",
    demoMultilingualNotice: "Mode multilingue démo. La production nécessite des packs de langue révisés.",
  },
  de: {
    askWWAI:               "WWAI fragen",
    findFood:              "Essen finden",
    findRide:              "Fahrt finden",
    hotelRoutes:           "Hotelrouten",
    findOffers:            "Angebote finden",
    findBars:              "Bars finden",
    getBack:               "Zurück zum Hotel",
    planRoute:             "Route planen",
    registerBusiness:      "Unternehmen registrieren",
    demoMode:              "Demo-Modus",
    safetyRoute:           "Sicherheitsorientierte Demo-Route",
    productionNotice:      "Produktion erfordert Live-Daten",
    emergencyNotice:       "Wenden Sie sich bei Notfällen sofort an die lokalen Notfalldienste.",
    slogan:                "Nicht sicher, wo Sie hingehen sollen? WhichWay AI weiß es.",
    poweredBy:             "Unterstützt von TROPTIONS",
    send:                  "Senden",
    listening:             "Zuhören…",
    speak:                 "Sprechen",
    stop:                  "Stoppen",
    playResponse:          "Antwort abspielen",
    voiceNotConfigured:    "Sprache nicht konfiguriert",
    textModeOnly:          "Nur Textmodus",
    voiceNotSupported:     "Sprachaufnahme in diesem Browser nicht unterstützt",
    demoMultilingualNotice: "Demo-Mehrsprachigkeitsmodus. Produktion erfordert überprüfte Sprachpakete.",
  },
  pt: {
    askWWAI:               "Perguntar ao WWAI",
    findFood:              "Encontrar comida",
    findRide:              "Encontrar carona",
    hotelRoutes:           "Rotas para o hotel",
    findOffers:            "Encontrar ofertas",
    findBars:              "Encontrar bares",
    getBack:               "Voltar ao hotel",
    planRoute:             "Planejar rota",
    registerBusiness:      "Registre seu negócio",
    demoMode:              "Modo demo",
    safetyRoute:           "Rota de demonstração informada por segurança",
    productionNotice:      "Produção requer dados ao vivo",
    emergencyNotice:       "Em caso de emergência, contate os serviços de emergência locais imediatamente.",
    slogan:                "Não sabe para onde ir? WhichWay AI sabe.",
    poweredBy:             "Desenvolvido por TROPTIONS",
    send:                  "Enviar",
    listening:             "Ouvindo…",
    speak:                 "Falar",
    stop:                  "Parar",
    playResponse:          "Reproduzir resposta",
    voiceNotConfigured:    "Voz não configurada",
    textModeOnly:          "Somente modo texto",
    voiceNotSupported:     "Gravação de voz não suportada neste navegador",
    demoMultilingualNotice: "Modo multilíngue de demonstração. A produção requer pacotes de idiomas revisados.",
  },
  ja: {
    askWWAI:               "WWAIに聞く",
    findFood:              "食事を見つける",
    findRide:              "乗り物を探す",
    hotelRoutes:           "ホテルへのルート",
    findOffers:            "オファーを探す",
    findBars:              "バーを探す",
    getBack:               "ホテルに戻る",
    planRoute:             "ルートを計画する",
    registerBusiness:      "ビジネスを登録する",
    demoMode:              "デモモード",
    safetyRoute:           "安全情報に基づくデモルート",
    productionNotice:      "本番環境にはライブデータが必要です",
    emergencyNotice:       "緊急の場合は、すぐに地元の緊急サービスに連絡してください。",
    slogan:                "どこへ行けばいいかわからない？WhichWay AIが知っています。",
    poweredBy:             "TROPTIONSを搭載",
    send:                  "送信",
    listening:             "聴いています…",
    speak:                 "話す",
    stop:                  "停止",
    playResponse:          "応答を再生",
    voiceNotConfigured:    "音声が設定されていません",
    textModeOnly:          "テキストモードのみ",
    voiceNotSupported:     "このブラウザでは音声録音はサポートされていません",
    demoMultilingualNotice: "デモ多言語モード。本番環境には審査済みの言語パックが必要です。",
  },
  zh: {
    askWWAI:               "询问 WWAI",
    findFood:              "寻找餐厅",
    findRide:              "寻找出行",
    hotelRoutes:           "酒店路线",
    findOffers:            "寻找优惠",
    findBars:              "寻找酒吧",
    getBack:               "返回酒店",
    planRoute:             "规划路线",
    registerBusiness:      "注册您的业务",
    demoMode:              "演示模式",
    safetyRoute:           "安全演示路线",
    productionNotice:      "生产环境需要实时数据",
    emergencyNotice:       "如遇紧急情况，请立即联系当地紧急服务。",
    slogan:                "不知道去哪里？WhichWay AI 知道。",
    poweredBy:             "由 TROPTIONS 提供支持",
    send:                  "发送",
    listening:             "正在听…",
    speak:                 "说话",
    stop:                  "停止",
    playResponse:          "播放回复",
    voiceNotConfigured:    "语音未配置",
    textModeOnly:          "仅文字模式",
    voiceNotSupported:     "此浏览器不支持语音录制",
    demoMultilingualNotice: "演示多语言模式。生产需要经过审核的语言包。",
  },
  ar: {
    askWWAI:               "اسأل WWAI",
    findFood:              "ابحث عن طعام",
    findRide:              "ابحث عن وسيلة نقل",
    hotelRoutes:           "مسارات الفندق",
    findOffers:            "ابحث عن عروض",
    findBars:              "ابحث عن بارات",
    getBack:               "العودة إلى الفندق",
    planRoute:             "خطط لمسار",
    registerBusiness:      "سجّل عملك",
    demoMode:              "وضع العرض التوضيحي",
    safetyRoute:           "مسار توضيحي موجّه للسلامة",
    productionNotice:      "الإنتاج يتطلب بيانات مباشرة",
    emergencyNotice:       "في حالات الطوارئ، اتصل بخدمات الطوارئ المحلية فوراً.",
    slogan:                "لست متأكداً أين تذهب؟ WhichWay AI يعرف.",
    poweredBy:             "مدعوم من TROPTIONS",
    send:                  "إرسال",
    listening:             "جارٍ الاستماع…",
    speak:                 "تحدث",
    stop:                  "إيقاف",
    playResponse:          "تشغيل الرد",
    voiceNotConfigured:    "الصوت غير مُهيأ",
    textModeOnly:          "وضع النص فقط",
    voiceNotSupported:     "تسجيل الصوت غير مدعوم في هذا المتصفح",
    demoMultilingualNotice: "وضع تجريبي متعدد اللغات. الإنتاج يتطلب حزم لغوية مراجعة.",
  },
};

/** Get a translation with English fallback */
export function getTranslation(lang: string, key: DictionaryKey): string {
  return translations[lang]?.[key] ?? translations.en[key];
}

/** Build a t() helper bound to a language */
export function buildTranslator(lang: string) {
  return (key: DictionaryKey) => getTranslation(lang, key);
}

export default translations;
