export type Language = 'en' | 'es' | 'pt';

export interface Translations {
  appName: string;
  tagline: string;
  duetEngine: string;
  capsulesTab: string;
  duetsTab: string;
  timebombsTab: string;
  vaultTab: string;
  proPass: string;
  recordDuet: string;
  newTimeLock: string;
  signIn: string;
  signOut: string;
  
  // Hero banner
  heroTag: string;
  heroQuote: string;
  heroSub: string;
  startBlindDuet: string;
  recordFutureLock: string;
  aiWishesHeroBtn: string;
  aiWishesNav: string;
  chronoPoints: string;
  pointsHub: string;

  // Feed & Filters
  allCapsules: string;
  friendsOnly: string;
  readyToDuet: string;
  searchPlaceholder: string;

  // Vault Tab & Profile
  vaultTitle: string;
  vaultSubtitle: string;
  chronoArchivist: string;
  userBio: string;
  sealNewCapsule: string;
  storyRecapCard: string;
  sealedCapsulesMetric: string;
  duetsRecordedMetric: string;
  blindReactionsMetric: string;
  predictionsMadeMetric: string;
  forBadge: string;
  activeBets: string;
  achievementsTitle: string;
  achievementsSubtitle: string;
  myVaultCapsules: string;
  myVaultCapsulesSub: string;
  noCapsulesFound: string;

  // Sort Dropdown
  sortByLabel: string;
  sortUnlockDate: string;
  sortCreationDate: string;
  sortTitleAZ: string;

  // Time Bombs
  timeBombsTitle: string;
  timeBombsSub: string;
  createGroupCapsule: string;
  unboxedToday: string;
  lockedDays: string;
  crewVaulted: string;
  enterUnboxingRoom: string;
  viewGroupPredictions: string;

  // Viral Duets
  trendingDuetsTitle: string;
  trendingDuetsSub: string;
  recordNewReaction: string;
  watchSynchronized: string;
  verticalDuet: string;
  splitDuet: string;
  pastSelfLabel: string;
  presentReactionLabel: string;

  // Capsule Card
  unlockedAgo: string;
  vaultedCapsule: string;
  recordedOn: string;
  duetReactBtn: string;
  predictionBetLabel: string;
  confidence: string;
  lockedTimeCapsule: string;
  unlocksIn: string;
  days: string;
  unlocksOn: string;
  predictionTrue: string;
  predictionWrong: string;
  predictionPending: string;
  shareEarnPoints: string;
  viewDuetsTooltip: string;
  yearsAgo: string;

  // Chrono Points & Monetization Hub
  pointsHubTitle: string;
  pointsHubDesc: string;
  manifestWishBtn: string;
  viewProPassBtn: string;
  freeCoreFeatures: string;
  includedForEveryone: string;
  paidProAddons: string;
  proPriceLabel: string;
  freeFeature1: string;
  freeFeature2: string;
  freeFeature3: string;
  freeFeature4: string;
  freeFeature5: string;
  proFeature1: string;
  proFeature2: string;
  proFeature3: string;
  proFeature4: string;
  proFeature5: string;

  // Share Modal
  shareModalTitle: string;
  shareModalSub: string;
  uniqueLink: string;
  copied: string;
  copyLink: string;
  sharePlatforms: string;
  storyCard: string;
  downloadCard: string;
  pointsEarnedNotice: string;

  // Pro Modal
  proModalTitle: string;
  proModalSub: string;
  monthly: string;
  yearly: string;
  save33: string;
  upgradeNow: string;
  stripeConnected: string;
  configureStripe: string;
  saveLink: string;

  // AI Wish Modal
  aiWishTitle: string;
  aiWishSub: string;
  wishInputPlaceholder: string;
  manifestYearLabel: string;
  chooseStyle: string;
  generateVision: string;
  generating: string;
  shareToSocial: string;
  downloadVision: string;

  // Badges
  allBadges: string;
  unlockedBadges: string;
  inProgressBadges: string;
  tierBronze: string;
  tierSilver: string;
  tierGold: string;
  tierNeon: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'PASTSELF',
    tagline: 'Time-capsule video social network & blind reaction duets',
    duetEngine: 'Duet Engine',
    capsulesTab: 'Friend Capsules',
    duetsTab: 'Viral Duets',
    timebombsTab: 'Time Bombs',
    vaultTab: 'My Vault',
    proPass: 'Pro Pass',
    recordDuet: 'Record Duet',
    newTimeLock: 'New Time-Lock',
    signIn: 'Sign In',
    signOut: 'Sign Out',

    heroTag: 'VIRAL SPLIT-SCREEN ENGINE',
    heroQuote: '“What would you tell yourself from 3 years ago?”',
    heroSub: 'Unlock time-capsule videos recorded by friends in 2023. Record side-by-side Blind Reactions where their video unlocks only when you hit record — with one-tap export to TikTok & Reels with the #PastSelfApp watermark!',
    startBlindDuet: 'Start Blind Duet Reaction',
    recordFutureLock: 'Record New Future Time-Lock',
    aiWishesHeroBtn: 'Turn Wish to Video ✨ (+100 pts)',
    aiWishesNav: 'AI Wishes',
    chronoPoints: 'Chrono Points',
    pointsHub: 'Points & Rewards Hub',

    allCapsules: 'All Capsules',
    friendsOnly: 'Friends Only',
    readyToDuet: 'Ready to Duet ⚡',
    searchPlaceholder: 'Search memories, predictions...',

    vaultTitle: 'Your Personal Time Vault',
    vaultSubtitle: 'Messages and bets you have sealed for future you (or unlocked from the past)',
    chronoArchivist: 'Chrono Archivist',
    userBio: 'Locking video memories into 2027, 2029, and 2031. Future me, please tell me we bought that house and learned Italian.',
    sealNewCapsule: 'Seal New Capsule',
    storyRecapCard: 'Story Recap Card',
    sealedCapsulesMetric: 'Sealed Capsules',
    duetsRecordedMetric: 'Duets Recorded',
    blindReactionsMetric: 'Blind Reactions',
    predictionsMadeMetric: 'Predictions Made',
    forBadge: 'for',
    activeBets: 'Active bets',
    achievementsTitle: 'Your Badges & Achievements',
    achievementsSubtitle: 'Earn milestone badges like ‘Time Traveler’ (5 capsules) and ‘Reaction King’ (10 duets)',
    myVaultCapsules: 'My Vault Capsules',
    myVaultCapsulesSub: 'Time-locked videos you recorded for future you',
    noCapsulesFound: 'No capsules found in your vault yet.',

    sortByLabel: 'Sort Capsules by:',
    sortUnlockDate: 'Unlock Date (Soonest first)',
    sortCreationDate: 'Creation Date (Newest first)',
    sortTitleAZ: 'Title (A - Z)',

    timeBombsTitle: '“Time Bomb” Group Challenges',
    timeBombsSub: 'You and your crew record answers to a future prompt locked until a fixed date, then unbox together!',
    createGroupCapsule: 'Create Group Capsule',
    unboxedToday: 'UNBOXED TODAY',
    lockedDays: 'LOCKED',
    crewVaulted: 'Crew Vaulted',
    enterUnboxingRoom: 'Enter Unboxing Room',
    viewGroupPredictions: 'View Group Predictions',

    trendingDuetsTitle: 'Trending Split-Screen Duets',
    trendingDuetsSub: 'Past Self vs Present Reactions with synced dual playback & #PastSelfApp watermark',
    recordNewReaction: 'Record New Reaction',
    watchSynchronized: 'Watch Synchronized',
    verticalDuet: '9:16 Vertical Duet',
    splitDuet: 'Side-by-Side Split',
    pastSelfLabel: 'Past Self',
    presentReactionLabel: 'Present Reaction',

    unlockedAgo: 'UNLOCKED',
    vaultedCapsule: 'VAULTED',
    recordedOn: 'Recorded',
    duetReactBtn: 'Duet / React',
    predictionBetLabel: 'PREDICTION BET',
    confidence: 'Confident',
    lockedTimeCapsule: 'Locked Time-Capsule',
    unlocksIn: 'Unlocks in',
    days: 'days',
    unlocksOn: 'Unlocks on',
    predictionTrue: '✅ Prediction Came True!',
    predictionWrong: '❌ Failed Prediction',
    predictionPending: '⏳ Still Pending',
    shareEarnPoints: 'Share (+75 pts)',
    viewDuetsTooltip: 'View reactions & duets',
    yearsAgo: 'Y AGO',

    pointsHubTitle: 'Chrono Points & Monetization Hub',
    pointsHubDesc: 'Earn free points by sharing AI wishes on social media, or upgrade to Pro Pass for unlimited 4K locks.',
    manifestWishBtn: 'Manifest Wish (+50 pts)',
    viewProPassBtn: 'View Pro Pass',
    freeCoreFeatures: 'Free Core Features',
    includedForEveryone: 'Included for Everyone',
    paidProAddons: 'Paid Pro & Add-ons',
    proPriceLabel: '$4.99/mo or $39.99/yr',
    freeFeature1: 'Lock video capsules (6 months, 1 year, 3 years)',
    freeFeature2: 'Record side-by-side blind reactions & duets',
    freeFeature3: 'AI Future Wish short video generator (+50 pts)',
    freeFeature4: 'Earn 75-100 points per share to TikTok/Instagram',
    freeFeature5: 'Standard HD export with #PastSelfApp watermark',
    proFeature1: '10-year & 20-year ultra-vault storage',
    proFeature2: '4K 60fps canvas compositing & clean export',
    proFeature3: 'Remove or customize watermark with your brand',
    proFeature4: 'All premium retro filters (VHS, Y2K Digicam, Cyberpunk)',
    proFeature5: 'Direct Stripe payment integration for creator revenue',

    shareModalTitle: 'Share Capsule & Earn Chrono Points',
    shareModalSub: 'Every time you share your capsule link or story card, you get +75 points and help grow the network!',
    uniqueLink: 'Unique Capsule Link',
    copied: 'Copied!',
    copyLink: 'Copy Link',
    sharePlatforms: 'Direct Social Media Sharing',
    storyCard: '9:16 Instagram Story Card',
    downloadCard: 'Download Story Card (PNG)',
    pointsEarnedNotice: 'earned for sharing!',

    proModalTitle: 'Upgrade to Chrono Pass Pro',
    proModalSub: 'Unlock ultra-long 20-year vaults, crystal 4K exports, and creator monetization',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save33: 'Save 33%',
    upgradeNow: 'Upgrade to Pro Now',
    stripeConnected: 'Active Stripe Link Connected',
    configureStripe: 'Connect Your Live Stripe Payment Link',
    saveLink: 'Save Link',

    aiWishTitle: 'AI Future Wish & Vision Studio',
    aiWishSub: 'Turn your ambitions into cinematic future videos and prophecy cards ready for TikTok & Instagram',
    wishInputPlaceholder: 'e.g., I want to be a tech CEO living in Tokyo with a golden retriever...',
    manifestYearLabel: 'Manifestation Year',
    chooseStyle: 'Choose Visual Aesthetic',
    generateVision: 'Generate AI Vision & Video',
    generating: 'Generating Cinematic Vision...',
    shareToSocial: 'Share to Social (+75 pts)',
    downloadVision: 'Download Video Card',

    allBadges: 'All Badges',
    unlockedBadges: 'Unlocked',
    inProgressBadges: 'In Progress',
    tierBronze: 'Bronze',
    tierSilver: 'Silver',
    tierGold: 'Gold',
    tierNeon: 'Neon Master'
  },

  es: {
    appName: 'PASTSELF',
    tagline: 'Red social de video cápsulas del tiempo y reacciones a ciegas en dúo',
    duetEngine: 'Motor de Dúos',
    capsulesTab: 'Cápsulas de Amigos',
    duetsTab: 'Dúos Virales',
    timebombsTab: 'Bombas de Tiempo',
    vaultTab: 'Mi Bóveda',
    proPass: 'Pase Pro',
    recordDuet: 'Grabar Dúo',
    newTimeLock: 'Nuevo Bloqueo',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',

    heroTag: 'MOTOR VIRAL DE PANTALLA DIVIDIDA',
    heroQuote: '“¿Qué le dirías a tu yo de hace 3 años?”',
    heroSub: 'Desbloquea cápsulas de video grabadas por tus amigos en 2023. Graba reacciones a ciegas lado a lado donde el video se revela solo cuando empiezas a grabar, ¡con exportación directa a TikTok y Reels con la marca de agua #PastSelfApp!',
    startBlindDuet: 'Iniciar Reacción a Ciegas',
    recordFutureLock: 'Grabar Mensaje para el Futuro',
    aiWishesHeroBtn: 'Convertir Deseo en Video ✨ (+100 pts)',
    aiWishesNav: 'Deseos IA',
    chronoPoints: 'Puntos Crono',
    pointsHub: 'Centro de Puntos y Recompensas',

    allCapsules: 'Todas las Cápsulas',
    friendsOnly: 'Solo Amigos',
    readyToDuet: 'Listos para Dúo ⚡',
    searchPlaceholder: 'Buscar recuerdos, predicciones...',

    vaultTitle: 'Tu Bóveda Personal del Tiempo',
    vaultSubtitle: 'Mensajes y apuestas que has sellado para tu yo futuro (o desbloqueado del pasado)',
    chronoArchivist: 'Cronista del Tiempo',
    userBio: 'Sellando memorias en video para 2027, 2029 y 2031. Yo del futuro, por favor dime que compramos esa casa y aprendimos italiano.',
    sealNewCapsule: 'Sellar Nueva Cápsula',
    storyRecapCard: 'Tarjeta Resumen para Historia',
    sealedCapsulesMetric: 'Cápsulas Selladas',
    duetsRecordedMetric: 'Dúos Grabados',
    blindReactionsMetric: 'Reacciones a Ciegas',
    predictionsMadeMetric: 'Predicciones Hechas',
    forBadge: 'para',
    activeBets: 'Apuestas activas',
    achievementsTitle: 'Tus Insignias y Logros',
    achievementsSubtitle: 'Gana insignias como ‘Viajero del Tiempo’ (5 cápsulas) y ‘Rey de las Reacciones’ (10 dúos)',
    myVaultCapsules: 'Mis Cápsulas en la Bóveda',
    myVaultCapsulesSub: 'Videos bloqueados en el tiempo que grabaste para tu yo futuro',
    noCapsulesFound: 'Aún no tienes cápsulas en tu bóveda.',

    sortByLabel: 'Ordenar cápsulas por:',
    sortUnlockDate: 'Fecha de desbloqueo (Más próxima)',
    sortCreationDate: 'Fecha de creación (Más reciente)',
    sortTitleAZ: 'Título (A - Z)',

    timeBombsTitle: 'Desafíos Grupales “Bomba de Tiempo”',
    timeBombsSub: '¡Tú y tus amigos graban respuestas a una pregunta futura bloqueada hasta una fecha fija y la abren juntos!',
    createGroupCapsule: 'Crear Cápsula Grupal',
    unboxedToday: 'DESBLOQUEADO HOY',
    lockedDays: 'BLOQUEADO',
    crewVaulted: 'Grupo Sellado',
    enterUnboxingRoom: 'Entrar a la Sala de Apertura',
    viewGroupPredictions: 'Ver Predicciones del Grupo',

    trendingDuetsTitle: 'Dúos en Tendencia en Pantalla Dividida',
    trendingDuetsSub: 'Yo del Pasado vs Reacciones del Presente con reproducción dual sincronizada y marca #PastSelfApp',
    recordNewReaction: 'Grabar Nueva Reacción',
    watchSynchronized: 'Ver Sincronizado',
    verticalDuet: 'Dúo Vertical 9:16',
    splitDuet: 'División Lado a Lado',
    pastSelfLabel: 'Yo del Pasado',
    presentReactionLabel: 'Reacción del Presente',

    unlockedAgo: 'DESBLOQUEADO',
    vaultedCapsule: 'EN BÓVEDA',
    recordedOn: 'Grabado',
    duetReactBtn: 'Dúo / Reaccionar',
    predictionBetLabel: 'APUESTA DE PREDICCIÓN',
    confidence: 'Seguro',
    lockedTimeCapsule: 'Cápsula del Tiempo Bloqueada',
    unlocksIn: 'Se desbloquea en',
    days: 'días',
    unlocksOn: 'Se desbloquea el',
    predictionTrue: '✅ ¡La predicción se cumplió!',
    predictionWrong: '❌ Predicción Fallida',
    predictionPending: '⏳ Aún Pendiente',
    shareEarnPoints: 'Compartir (+75 pts)',
    viewDuetsTooltip: 'Ver reacciones y dúos',
    yearsAgo: 'AÑOS ATRÁS',

    pointsHubTitle: 'Centro de Puntos Crono y Monetización',
    pointsHubDesc: 'Gana puntos gratis compartiendo deseos IA en redes sociales o mejora a Pase Pro para bloqueos ilimitados en 4K.',
    manifestWishBtn: 'Manifestar Deseo (+50 pts)',
    viewProPassBtn: 'Ver Pase Pro',
    freeCoreFeatures: 'Funciones Principales Gratuitas',
    includedForEveryone: 'Incluido para Todos',
    paidProAddons: 'Pase Pro de Pago y Complementos',
    proPriceLabel: '$4.99/mes o $39.99/año',
    freeFeature1: 'Bloquea cápsulas de video (6 meses, 1 año, 3 años)',
    freeFeature2: 'Graba reacciones a ciegas y dúos lado a lado',
    freeFeature3: 'Generador de video corto de Deseos Futuros con IA (+50 pts)',
    freeFeature4: 'Gana 75-100 puntos por compartir en TikTok/Instagram',
    freeFeature5: 'Exportación estándar HD con marca de agua #PastSelfApp',
    proFeature1: 'Almacenamiento ultra en bóveda por 10 y 20 años',
    proFeature2: 'Composición de lienzo en 4K 60fps y exportación limpia',
    proFeature3: 'Elimina o personaliza la marca de agua con tu marca',
    proFeature4: 'Todos los filtros retro premium (VHS, Y2K Digicam, Cyberpunk)',
    proFeature5: 'Integración directa de pagos Stripe para ingresos del creador',

    shareModalTitle: 'Compartir Cápsula y Ganar Puntos Crono',
    shareModalSub: '¡Cada vez que compartes tu enlace o tarjeta de historia recibes +75 puntos y expandes la red!',
    uniqueLink: 'Enlace Único de la Cápsula',
    copied: '¡Copiado!',
    copyLink: 'Copiar Enlace',
    sharePlatforms: 'Compartir Directo en Redes Sociales',
    storyCard: 'Tarjeta para Historias 9:16',
    downloadCard: 'Descargar Tarjeta (PNG)',
    pointsEarnedNotice: '¡ganados por compartir!',

    proModalTitle: 'Mejora a Pase Chrono Pro',
    proModalSub: 'Desbloquea bóvedas ultra largas de 20 años, exportaciones 4K cristalinas y monetización de creador',
    monthly: 'Mensual',
    yearly: 'Anual',
    save33: 'Ahorra 33%',
    upgradeNow: 'Mejorar a Pro Ahora',
    stripeConnected: 'Enlace de Stripe Activo Conectado',
    configureStripe: 'Conecta tu Enlace de Pago de Stripe',
    saveLink: 'Guardar Enlace',

    aiWishTitle: 'Estudio de Deseos y Visiones Futuras con IA',
    aiWishSub: 'Convierte tus ambiciones en videos cinematográficos y tarjetas de profecía listos para TikTok e Instagram',
    wishInputPlaceholder: 'ej., Quiero ser CEO de tecnología viviendo en Tokio con un golden retriever...',
    manifestYearLabel: 'Año de Manifestación',
    chooseStyle: 'Elige la Estética Visual',
    generateVision: 'Generar Visión y Video con IA',
    generating: 'Generando Visión Cinematográfica...',
    shareToSocial: 'Compartir en Redes (+75 pts)',
    downloadVision: 'Descargar Tarjeta de Video',

    allBadges: 'Todas las Insignias',
    unlockedBadges: 'Desbloqueadas',
    inProgressBadges: 'En Progreso',
    tierBronze: 'Bronce',
    tierSilver: 'Plata',
    tierGold: 'Oro',
    tierNeon: 'Maestro Neón'
  },

  pt: {
    appName: 'PASTSELF',
    tagline: 'Rede social de vídeos cápsula do tempo e reações às cegas em dueto',
    duetEngine: 'Motor de Duetos',
    capsulesTab: 'Cápsulas de Amigos',
    duetsTab: 'Duetos Virais',
    timebombsTab: 'Bombas-Relógio',
    vaultTab: 'Meu Cofre',
    proPass: 'Passe Pro',
    recordDuet: 'Gravar Dueto',
    newTimeLock: 'Novo Bloqueio',
    signIn: 'Entrar',
    signOut: 'Sair',

    heroTag: 'MOTOR VIRAL DE TELA DIVIDIDA',
    heroQuote: '“O que você diria para o seu eu de 3 anos atrás?”',
    heroSub: 'Desbloqueie vídeos de cápsulas do tempo gravados por amigos em 2023. Grave reações às cegas lado a lado onde o vídeo se revela apenas quando você aperta gravar — com exportação em um toque para TikTok e Reels com a marca d’água #PastSelfApp!',
    startBlindDuet: 'Iniciar Reação às Cegas',
    recordFutureLock: 'Gravar Mensagem para o Futuro',
    aiWishesHeroBtn: 'Transformar Desejo em Vídeo ✨ (+100 pts)',
    aiWishesNav: 'Desejos IA',
    chronoPoints: 'Pontos Crono',
    pointsHub: 'Central de Pontos e Recompensas',

    allCapsules: 'Todas as Cápsulas',
    friendsOnly: 'Apenas Amigos',
    readyToDuet: 'Prontos para Dueto ⚡',
    searchPlaceholder: 'Buscar memórias, previsões...',

    vaultTitle: 'Seu Cofre Pessoal do Tempo',
    vaultSubtitle: 'Mensagens e apostas que você selou para o seu eu futuro (ou desbloqueou do passado)',
    chronoArchivist: 'Arquivista do Tempo',
    userBio: 'Selando memórias em vídeo para 2027, 2029 e 2031. Eu do futuro, por favor me diga que compramos aquela casa e aprendemos italiano.',
    sealNewCapsule: 'Selar Nova Cápsula',
    storyRecapCard: 'Cartão de Resumo para Stories',
    sealedCapsulesMetric: 'Cápsulas Seladas',
    duetsRecordedMetric: 'Duetos Gravados',
    blindReactionsMetric: 'Reações às Cegas',
    predictionsMadeMetric: 'Previsões Feitas',
    forBadge: 'para',
    activeBets: 'Apostas ativas',
    achievementsTitle: 'Seus Emblemas e Conquistas',
    achievementsSubtitle: 'Ganhe emblemas como ‘Viajante do Tempo’ (5 cápsulas) e ‘Rei das Reações’ (10 duetos)',
    myVaultCapsules: 'Minhas Cápsulas no Cofre',
    myVaultCapsulesSub: 'Vídeos bloqueados no tempo que você gravou para o seu eu futuro',
    noCapsulesFound: 'Nenhuma cápsula encontrada no seu cofre.',

    sortByLabel: 'Ordenar cápsulas por:',
    sortUnlockDate: 'Data de desbloqueio (Mais próxima)',
    sortCreationDate: 'Data de criação (Mais recente)',
    sortTitleAZ: 'Título (A - Z)',

    timeBombsTitle: 'Desafios em Grupo “Bomba-Relógio”',
    timeBombsSub: 'Você e sua turma gravam respostas para uma pergunta futura trancada até uma data fixa e abrem juntos!',
    createGroupCapsule: 'Criar Cápsula em Grupo',
    unboxedToday: 'DESBLOQUEADO HOJE',
    lockedDays: 'BLOQUEADO',
    crewVaulted: 'Turma Selada',
    enterUnboxingRoom: 'Entrar na Sala de Abertura',
    viewGroupPredictions: 'Ver Previsões do Grupo',

    trendingDuetsTitle: 'Duetos em Destaque em Tela Dividida',
    trendingDuetsSub: 'Eu do Passado vs Reações do Presente com reprodução sincronizada e marca #PastSelfApp',
    recordNewReaction: 'Gravar Nova Reação',
    watchSynchronized: 'Assistir Sincronizado',
    verticalDuet: 'Dueto Vertical 9:16',
    splitDuet: 'Divisão Lado a Lado',
    pastSelfLabel: 'Eu do Passado',
    presentReactionLabel: 'Reação do Presente',

    unlockedAgo: 'DESBLOQUEADO',
    vaultedCapsule: 'NO COFRE',
    recordedOn: 'Gravado',
    duetReactBtn: 'Dueto / Reagir',
    predictionBetLabel: 'APOSTA DE PREVISÃO',
    confidence: 'Confiante',
    lockedTimeCapsule: 'Cápsula do Tempo Trancada',
    unlocksIn: 'Desbloqueia em',
    days: 'dias',
    unlocksOn: 'Desbloqueia em',
    predictionTrue: '✅ A previsão se concretizou!',
    predictionWrong: '❌ Previsão Incorreta',
    predictionPending: '⏳ Ainda Pendente',
    shareEarnPoints: 'Compartilhar (+75 pts)',
    viewDuetsTooltip: 'Ver reações e duetos',
    yearsAgo: 'ANOS ATRÁS',

    pointsHubTitle: 'Central de Pontos Crono e Monetização',
    pointsHubDesc: 'Ganhe pontos grátis compartilhando desejos de IA nas redes sociais ou assine o Passe Pro para bloqueios ilimitados em 4K.',
    manifestWishBtn: 'Manifestar Desejo (+50 pts)',
    viewProPassBtn: 'Ver Passe Pro',
    freeCoreFeatures: 'Recursos Principais Gratuitos',
    includedForEveryone: 'Incluído para Todos',
    paidProAddons: 'Passe Pro Pago e Extras',
    proPriceLabel: '$4,99/mês ou $39,99/ano',
    freeFeature1: 'Bloqueie cápsulas de vídeo (6 meses, 1 ano, 3 anos)',
    freeFeature2: 'Grave reações às cegas e duetos lado a lado',
    freeFeature3: 'Gerador de vídeo curto de Desejo Futuro com IA (+50 pts)',
    freeFeature4: 'Ganhe 75-100 pontos por compartilhamento no TikTok/Instagram',
    freeFeature5: 'Exportação HD padrão com marca d’água #PastSelfApp',
    proFeature1: 'Armazenamento ultra no cofre por 10 e 20 anos',
    proFeature2: 'Composição em 4K 60fps e exportação limpa',
    proFeature3: 'Remova ou personalize a marca d’água com a sua marca',
    proFeature4: 'Todos os filtros retrô premium (VHS, Câmera Y2K, Cyberpunk)',
    proFeature5: 'Integração direta de pagamentos Stripe para receita do criador',

    shareModalTitle: 'Compartilhar Cápsula e Ganhar Pontos Crono',
    shareModalSub: 'Cada vez que compartilha seu link ou cartão de stories, ganha +75 pontos e expande a rede!',
    uniqueLink: 'Link Único da Cápsula',
    copied: 'Copiado!',
    copyLink: 'Copiar Link',
    sharePlatforms: 'Compartilhamento Direto nas Redes',
    storyCard: 'Cartão de Stories 9:16',
    downloadCard: 'Baixar Cartão de Stories (PNG)',
    pointsEarnedNotice: 'ganhos por compartilhar!',

    proModalTitle: 'Assine o Passe Chrono Pro',
    proModalSub: 'Desbloqueie cofres ultralongos de 20 anos, exportações cristalinas em 4K e monetização de criador',
    monthly: 'Mensal',
    yearly: 'Anual',
    save33: 'Economize 33%',
    upgradeNow: 'Assinar o Pro Agora',
    stripeConnected: 'Link do Stripe Ativo Conectado',
    configureStripe: 'Conecte seu Link de Pagamento do Stripe',
    saveLink: 'Salvar Link',

    aiWishTitle: 'Estúdio de Desejos e Visões Futuras com IA',
    aiWishSub: 'Transforme suas ambições em vídeos cinematográficos e cartões proféticos prontos para TikTok e Instagram',
    wishInputPlaceholder: 'ex.: Quero ser CEO de tecnologia morando em Tóquio com um golden retriever...',
    manifestYearLabel: 'Ano de Manifestação',
    chooseStyle: 'Escolha a Estética Visual',
    generateVision: 'Gerar Visão e Vídeo com IA',
    generating: 'Gerando Visão Cinematográfica...',
    shareToSocial: 'Compartilhar nas Redes (+75 pts)',
    downloadVision: 'Baixar Cartão de Vídeo',

    allBadges: 'Todos os Emblemas',
    unlockedBadges: 'Desbloqueados',
    inProgressBadges: 'Em Progresso',
    tierBronze: 'Bronze',
    tierSilver: 'Prata',
    tierGold: 'Ouro',
    tierNeon: 'Mestre Neon'
  }
};
