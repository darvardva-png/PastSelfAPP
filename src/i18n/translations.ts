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

  // Viral Duets
  trendingDuetsTitle: string;
  trendingDuetsSub: string;
  recordNewReaction: string;
  watchSynchronized: string;

  // Capsule Card
  unlockedAgo: string;
  vaultedCapsule: string;
  recordedOn: string;
  duetReactBtn: string;
  predictionBetLabel: string;
  confidence: string;
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

    trendingDuetsTitle: 'Trending Split-Screen Duets',
    trendingDuetsSub: 'Past Self vs Present Reactions with synced dual playback & #PastSelfApp watermark',
    recordNewReaction: 'Record New Reaction',
    watchSynchronized: 'Watch Synchronized',

    unlockedAgo: 'UNLOCKED',
    vaultedCapsule: 'VAULTED',
    recordedOn: 'Recorded',
    duetReactBtn: 'Duet / React',
    predictionBetLabel: 'PREDICTION BET',
    confidence: 'Confident'
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

    trendingDuetsTitle: 'Dúos en Tendencia en Pantalla Dividida',
    trendingDuetsSub: 'Yo del Pasado vs Reacciones del Presente con reproducción dual sincronizada y marca #PastSelfApp',
    recordNewReaction: 'Grabar Nueva Reacción',
    watchSynchronized: 'Ver Sincronizado',

    unlockedAgo: 'DESBLOQUEADO',
    vaultedCapsule: 'EN BÓVEDA',
    recordedOn: 'Grabado',
    duetReactBtn: 'Dúo / Reaccionar',
    predictionBetLabel: 'APUESTA DE PREDICCIÓN',
    confidence: 'Seguro'
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

    trendingDuetsTitle: 'Duetos em Destaque em Tela Dividida',
    trendingDuetsSub: 'Eu do Passado vs Reações do Presente com reprodução sincronizada e marca #PastSelfApp',
    recordNewReaction: 'Gravar Nova Reação',
    watchSynchronized: 'Assistir Sincronizado',

    unlockedAgo: 'DESBLOQUEADO',
    vaultedCapsule: 'NO COFRE',
    recordedOn: 'Gravado',
    duetReactBtn: 'Dueto / Reagir',
    predictionBetLabel: 'APOSTA DE PREVISÃO',
    confidence: 'Confiante'
  }
};
