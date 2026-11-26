export interface LightingKeyframe {
  progress: number; // 0 to 100
  timeLabel: string;
  sceneName: string;
  poeticLine: string;
  kelvin: number;
  ambientTags: [string, string, string];
  // 页面全局背景色调 (RGB)
  pageBg: [number, number, number];
  // 页面主文字深浅 (0 = 浅色文字用于暗夜, 1 = 深色文字用于明亮白天)
  lightTextBlend: number;
  // 窗外天光颜色 & 透明度
  windowSkyRgb: [number, number, number];
  windowSkyAlpha: number;
  // 窗格斜射日光角度 (deg) 与透明度
  sunbeamAngle: number;
  sunbeamAlpha: number;
  sunbeamRgb: [number, number, number];
  // 室内人工暖灯强度 (吊灯/台灯/洗墙灯)
  interiorWarmAlpha: number;
  // 贴地夜灯强度
  floorNightlightAlpha: number;
  // 画面整体亮度与阴影覆盖
  dimOverlayAlpha: number;
  // 电影屏幕反光强度
  cinemaBounceAlpha: number;
}

export const LIGHTING_KEYFRAMES: LightingKeyframe[] = [
  {
    progress: 0,
    timeLabel: '07:00',
    sceneName: '晨曦唤醒',
    poeticLine: '纱帘在微光里缓缓让开一条缝隙，把清晨的第一束暖阳请进客厅。',
    kelvin: 4200,
    ambientTags: ['4200K 晨曦柔白', '纱帘轻启半透', '微风轻拂唤醒'],
    pageBg: [245, 241, 234], // 晨雾白 #F5F1EA
    lightTextBlend: 0,
    windowSkyRgb: [255, 232, 196],
    windowSkyAlpha: 0.58,
    sunbeamAngle: -28,
    sunbeamAlpha: 0.45,
    sunbeamRgb: [255, 224, 172],
    interiorWarmAlpha: 0.16,
    floorNightlightAlpha: 0,
    dimOverlayAlpha: 0.04,
    cinemaBounceAlpha: 0,
  },
  {
    progress: 33.33,
    timeLabel: '14:00',
    sceneName: '专注阅读',
    poeticLine: '午后的天光被薄纱滤得清澈柔软，角落里只留下一片安静的阅读时光。',
    kelvin: 5200,
    ambientTags: ['5200K 清透日光', '自然漫射无影', '室内恒温微风'],
    pageBg: [236, 231, 223], // 建筑暖灰 #ECE7DF
    lightTextBlend: 0,
    windowSkyRgb: [242, 247, 255],
    windowSkyAlpha: 0.52,
    sunbeamAngle: -10,
    sunbeamAlpha: 0.34,
    sunbeamRgb: [255, 249, 238],
    interiorWarmAlpha: 0.24,
    floorNightlightAlpha: 0,
    dimOverlayAlpha: 0.0,
    cinemaBounceAlpha: 0,
  },
  {
    progress: 66.67,
    timeLabel: '20:00',
    sceneName: '影院微醺',
    poeticLine: '夜色漫过落地窗时，主灯悄然隐去，只留琥珀光晕与声浪缓缓包裹沙发。',
    kelvin: 2700,
    ambientTags: ['2700K 琥珀暖光', '窗帘静静合拢', '黑胶轻声流动'],
    pageBg: [26, 33, 46], // 深邃暮色蓝 #1A212E
    lightTextBlend: 1,
    windowSkyRgb: [36, 52, 82],
    windowSkyAlpha: 0.65,
    sunbeamAngle: 12,
    sunbeamAlpha: 0.04,
    sunbeamRgb: [120, 145, 190],
    interiorWarmAlpha: 0.78,
    floorNightlightAlpha: 0.22,
    dimOverlayAlpha: 0.46,
    cinemaBounceAlpha: 0.48,
  },
  {
    progress: 100,
    timeLabel: '23:30',
    sceneName: '柔光入眠',
    poeticLine: '整间屋子温柔地收敛起所有光芒，只留一缕贴近地面的暖影陪你入睡。',
    kelvin: 2100,
    ambientTags: ['2100K 烛影余温', '全屋渐次熄灯', '贴地微光守护'],
    pageBg: [18, 22, 31], // 深夜静蓝 #12161F
    lightTextBlend: 1,
    windowSkyRgb: [16, 22, 35],
    windowSkyAlpha: 0.8,
    sunbeamAngle: 24,
    sunbeamAlpha: 0,
    sunbeamRgb: [90, 110, 150],
    interiorWarmAlpha: 0.14,
    floorNightlightAlpha: 0.92,
    dimOverlayAlpha: 0.72,
    cinemaBounceAlpha: 0,
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpTuple(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export interface InterpolatedLightingState {
  progress: number;
  timeLabel: string;
  sceneName: string;
  poeticLine: string;
  kelvin: number;
  ambientTags: [string, string, string];
  pageBgCss: string;
  pageBgRgb: [number, number, number];
  lightTextBlend: number;
  windowSkyCss: string;
  sunbeamAngle: number;
  sunbeamAlpha: number;
  sunbeamCss: string;
  interiorWarmAlpha: number;
  floorNightlightAlpha: number;
  dimOverlayAlpha: number;
  cinemaBounceAlpha: number;
  nearestIndex: number;
}

function formatTimeFromProgress(progress: number): string {
  // 0 -> 07:00 (420min), 33.33 -> 14:00 (840min), 66.67 -> 20:00 (1200min), 100 -> 23:30 (1410min)
  const anchors = [
    { p: 0, m: 7 * 60 },
    { p: 33.333, m: 14 * 60 },
    { p: 66.667, m: 20 * 60 },
    { p: 100, m: 23 * 60 + 30 },
  ];
  let mins = 420;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (progress >= a.p && progress <= b.p) {
      const localT = (progress - a.p) / (b.p - a.p);
      mins = Math.round(lerp(a.m, b.m, localT));
      break;
    }
  }
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function interpolateLighting(progress: number): InterpolatedLightingState {
  const clamped = Math.max(0, Math.min(100, progress));
  let idx = 0;
  for (let i = 0; i < LIGHTING_KEYFRAMES.length - 1; i++) {
    if (clamped >= LIGHTING_KEYFRAMES[i].progress) {
      idx = i;
    }
  }
  const start = LIGHTING_KEYFRAMES[idx];
  const end = LIGHTING_KEYFRAMES[Math.min(idx + 1, LIGHTING_KEYFRAMES.length - 1)];
  const span = end.progress - start.progress || 1;
  const rawT = (clamped - start.progress) / span;
  const t = smoothstep(rawT);

  const nearest = rawT < 0.5 ? start : end;
  const nearestIndex = rawT < 0.5 ? idx : Math.min(idx + 1, LIGHTING_KEYFRAMES.length - 1);

  const pageBgRgb = lerpTuple(start.pageBg, end.pageBg, t);
  const windowSkyRgb = lerpTuple(start.windowSkyRgb, end.windowSkyRgb, t);
  const windowSkyAlpha = lerp(start.windowSkyAlpha, end.windowSkyAlpha, t);
  const sunbeamRgb = lerpTuple(start.sunbeamRgb, end.sunbeamRgb, t);

  return {
    progress: clamped,
    timeLabel: formatTimeFromProgress(clamped),
    sceneName: nearest.sceneName,
    poeticLine: nearest.poeticLine,
    kelvin: Math.round(lerp(start.kelvin, end.kelvin, t) / 50) * 50,
    ambientTags: nearest.ambientTags,
    pageBgCss: `rgb(${pageBgRgb[0]}, ${pageBgRgb[1]}, ${pageBgRgb[2]})`,
    pageBgRgb,
    lightTextBlend: lerp(start.lightTextBlend, end.lightTextBlend, t),
    windowSkyCss: `rgba(${windowSkyRgb[0]}, ${windowSkyRgb[1]}, ${windowSkyRgb[2]}, ${windowSkyAlpha.toFixed(3)})`,
    sunbeamAngle: lerp(start.sunbeamAngle, end.sunbeamAngle, t),
    sunbeamAlpha: lerp(start.sunbeamAlpha, end.sunbeamAlpha, t),
    sunbeamCss: `rgb(${sunbeamRgb[0]}, ${sunbeamRgb[1]}, ${sunbeamRgb[2]})`,
    interiorWarmAlpha: lerp(start.interiorWarmAlpha, end.interiorWarmAlpha, t),
    floorNightlightAlpha: lerp(start.floorNightlightAlpha, end.floorNightlightAlpha, t),
    dimOverlayAlpha: lerp(start.dimOverlayAlpha, end.dimOverlayAlpha, t),
    cinemaBounceAlpha: lerp(start.cinemaBounceAlpha, end.cinemaBounceAlpha, t),
    nearestIndex,
  };
}

export type HotspotEffectType = 'light' | 'sound' | 'curtain' | 'comfort';

export interface SpatialHotspot {
  id: string;
  label: string;
  subLabel: string;
  story: string;
  xPercent: number;
  yPercent: number;
  effectType: HotspotEffectType;
  cardAlign: 'left' | 'right';
}

export interface SpatialRoom {
  id: 'living' | 'study' | 'bedroom';
  name: string;
  subtitle: string;
  imageUrl: string;
  fallbackGradient: string;
  hotspots: SpatialHotspot[];
}

export const SPATIAL_ROOMS: SpatialRoom[] = [
  {
    id: 'living',
    name: '起居客厅',
    subtitle: '阳光、音乐与团聚自然发生的地方',
    imageUrl: '/images/spatial-living.jpg',
    fallbackGradient: 'linear-gradient(135deg, #EAE3D7 0%, #CFC5B7 52%, #8F7D6A 100%)',
    hotspots: [
      {
        id: 'living-pendant',
        label: '悬浮漫射吊灯',
        subLabel: '随天光流动而呼吸',
        story: '暮色降临时，它会比你更早感知疲惫，将光色一点点调成落日余晖。',
        xPercent: 50,
        yPercent: 31,
        effectType: 'light',
        cardAlign: 'right',
      },
      {
        id: 'living-curtain',
        label: '亚麻光感纱帘',
        subLabel: '温柔接管刺眼西晒',
        story: '午后太阳偏西时，纱帘悄然拉上三分之二，让阳光变得像牛奶一样柔软。',
        xPercent: 11,
        yPercent: 48,
        effectType: 'curtain',
        cardAlign: 'right',
      },
      {
        id: 'living-speaker',
        label: '胡桃木声学音柱',
        subLabel: '只闻其声的立体包围',
        story: '随口轻唤一声，温暖的爵士乐便从胡桃木纹理间流淌出来，刚好填满整个下午。',
        xPercent: 83,
        yPercent: 65,
        effectType: 'sound',
        cardAlign: 'left',
      },
      {
        id: 'living-sofa',
        label: '微风与落座感知',
        subLabel: '像森林树荫下的恒温',
        story: '当你端着热茶陷进沙发，空调会默默把直吹的风收成头顶拂过的微凉林风。',
        xPercent: 49,
        yPercent: 71,
        effectType: 'comfort',
        cardAlign: 'right',
      },
    ],
  },
  {
    id: 'study',
    name: '静谧书房',
    subtitle: '心流深潜时，万物为你静音留白',
    imageUrl: '/images/spatial-study.jpg',
    fallbackGradient: 'linear-gradient(135deg, #DFD7CB 0%, #B8AA98 55%, #5C493A 100%)',
    hotspots: [
      {
        id: 'study-blinds',
        label: '木质寻光百叶',
        subLabel: '把刺眼反光挡在书页之外',
        story: '百叶角度会跟着太阳的轨迹微调，只让漫射光落在纸面上，屏幕始终清澈无眩光。',
        xPercent: 18,
        yPercent: 42,
        effectType: 'curtain',
        cardAlign: 'right',
      },
      {
        id: 'study-lamp',
        label: '香槟金阅读台灯',
        subLabel: '翻开书页时自动亮起',
        story: '不用去摸冰凉的开关，当你坐定在胡桃木桌前，一束恰到好处的护眼暖光正落在手边。',
        xPercent: 75,
        yPercent: 46,
        effectType: 'light',
        cardAlign: 'left',
      },
      {
        id: 'study-acoustic',
        label: '隐形木纹声场',
        subLabel: '白噪音隔绝窗外喧嚣',
        story: '需要专注的时刻，墙面里藏着的细腻声场轻轻铺开一阵远山雨声，抚平所有杂念。',
        xPercent: 58,
        yPercent: 31,
        effectType: 'sound',
        cardAlign: 'left',
      },
    ],
  },
  {
    id: 'bedroom',
    name: '云朵卧室',
    subtitle: '比闹钟更温柔的唤醒，比夜色更轻的守护',
    imageUrl: '/images/spatial-bedroom.jpg',
    fallbackGradient: 'linear-gradient(135deg, #272D38 0%, #3E3A36 55%, #827364 100%)',
    hotspots: [
      {
        id: 'bed-sconce',
        label: '床头漫反射壁灯',
        subLabel: '只在你那一侧温柔发光',
        story: '睡前翻两页书时，光束只落在枕边方寸之地；放下书合上眼，它会在十秒后缓缓熄灭。',
        xPercent: 35.8,
        yPercent: 30,
        effectType: 'light',
        cardAlign: 'right',
      },
      {
        id: 'bed-curtain',
        label: '日出模拟窗帘',
        subLabel: '用半小时慢慢叫醒你',
        story: '告别惊心动魄的闹铃。清晨七点前，纱帘逐厘米开启，让身体跟着真实的天光自然苏醒。',
        xPercent: 14,
        yPercent: 45,
        effectType: 'curtain',
        cardAlign: 'right',
      },
      {
        id: 'bed-floor',
        label: '床底贴地微光',
        subLabel: '起夜时脚边的一缕暖意',
        story: '深夜脚尖刚触到木地板，床底便漾开一圈不刺眼的 1800K 微光，温柔照亮前路却不惊醒睡意。',
        xPercent: 54,
        yPercent: 84,
        effectType: 'light',
        cardAlign: 'left',
      },
      {
        id: 'bed-air',
        label: '深眠轻氧微气候',
        subLabel: '夜半自动调升一度的体贴',
        story: '察觉你进入深睡后，室内的风声彻底安静，温度悄悄贴合体温，直到黎明都不曾着凉。',
        xPercent: 74.5,
        yPercent: 47,
        effectType: 'comfort',
        cardAlign: 'left',
      },
    ],
  },
];

export interface StorySensoryBadge {
  label: string;
  icon: 'light' | 'sound' | 'air' | 'curtain';
}

export interface StoryChapter {
  id: 'morning' | 'kitchen' | 'homecoming' | 'cinema' | 'sleep';
  indexLabel: string;
  timeLabel: string;
  timeHint: string;
  title: string;
  description: string;
  sensoryBadges: StorySensoryBadge[];
  imageUrl: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'morning',
    indexLabel: '01',
    timeLabel: '07:15',
    timeHint: '晨光唤醒',
    title: '用天光把你叫醒，而不是闹钟。',
    description:
      '窗帘在你起身前十分钟悄悄让开三分缝隙，把清晨金桃色的第一抹阳光漫过亚麻被角。房间微微升温一度，微风轻缓流动，陪你从容醒来。',
    sensoryBadges: [
      { label: '纱帘缓启 30%', icon: 'curtain' },
      { label: '晨阳漫过床畔', icon: 'light' },
      { label: '微风轻柔升温', icon: 'air' },
    ],
    imageUrl: '/images/story-morning.jpg',
  },
  {
    id: 'kitchen',
    indexLabel: '02',
    timeLabel: '08:40',
    timeHint: '晨间岛台',
    title: '咖啡刚磨好，光也刚好亮起。',
    description:
      '走进开放式餐厨，洞石岛台上方的线性吊灯调成清澈柔和的晨光色温，正好照亮手冲壶与温热陶杯，耳畔恰如其分地响起一首轻快的晨间黑胶。',
    sensoryBadges: [
      { label: '4600K 晨白亮光', icon: 'light' },
      { label: '岛台重点微聚光', icon: 'light' },
      { label: '轻快黑胶唤醒', icon: 'sound' },
    ],
    imageUrl: '/images/story-kitchen.jpg',
  },
  {
    id: 'homecoming',
    indexLabel: '03',
    timeLabel: '18:50',
    timeHint: '推门归家',
    title: '推门那一刻，灯先懂你。',
    description:
      '玄关的洗墙暖光在你握住门把手的一瞬悄然点亮，空气中早已流动着舒适的微风。双手拎满鲜花与食材，也不必摸黑去按墙壁。',
    sensoryBadges: [
      { label: '玄关 2900K 迎宾光', icon: 'light' },
      { label: '归家新风已备好', icon: 'air' },
      { label: '长廊暖灯渐亮', icon: 'light' },
    ],
    imageUrl: '/images/story-sanctuary.jpg',
  },
  {
    id: 'cinema',
    indexLabel: '04',
    timeLabel: '21:00',
    timeHint: '观影时刻',
    title: '房间退居幕后，只剩故事发光。',
    description:
      '灯光如剧场幕布缓缓暗下，落地纱帘温柔合拢隔绝夜色。环绕声从四面墙面柔和地包裹过来，让你全身心沉浸在银幕光影里。',
    sensoryBadges: [
      { label: '全屋主灯渐隐', icon: 'light' },
      { label: '纱帘静谧合拢', icon: 'curtain' },
      { label: '立体声场包裹', icon: 'sound' },
    ],
    imageUrl: '/images/story-cinema.jpg',
  },
  {
    id: 'sleep',
    indexLabel: '05',
    timeLabel: '23:30',
    timeHint: '安然入眠',
    title: '整屋睡去，留一缕夜灯守候。',
    description:
      '互道晚安之后，客厅与走廊的灯逐一温柔熄灭。唯有沿着踢脚线与床底贴地铺开的一抹柔和微光静静呼吸，整晚默默照看起身的路。',
    sensoryBadges: [
      { label: '全屋轻声熄灯', icon: 'light' },
      { label: '贴地 1800K 微光', icon: 'light' },
      { label: '深眠恒温静谧', icon: 'air' },
    ],
    imageUrl: '/images/story-sleep.jpg',
  },
];
