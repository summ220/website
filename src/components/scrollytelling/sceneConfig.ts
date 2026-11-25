export type SceneId = 'wake' | 'meeting' | 'voice' | 'sleep';

export type MonitorMode = 'standby' | 'meeting' | 'music' | 'off';
export type HomePodMode = 'idle' | 'muted' | 'playing' | 'off';

export interface SceneLayersConfig {
  /** 可选：替换为真实 3D 渲染的房间底图 */
  baseImageUrl?: string;
  /** 可选：替换为真实 3D 渲染的台灯独立光影图层 */
  lampLightLayerUrl?: string;
  /** 可选：替换为真实 3D 渲染的空调开启图层 */
  acOnLayerUrl?: string;
}

export interface SceneState {
  id: SceneId;
  stepLabel: string;
  badge: string;
  title: string;
  description: string;
  /** 是否属于白天明亮房间背景 */
  isDaylight: boolean;
  /** 环境主光强度 0-1 */
  ambientOpacity: number;
  /** 台灯亮度 0-1 */
  lampBrightness: number;
  /** 台灯色温：cool (自然日光) | neutral (护眼白光) | warm (温馨暖黄) */
  lampTone: 'cool' | 'neutral' | 'warm';
  /** 显示器状态 */
  monitorMode: MonitorMode;
  /** 空调是否开启 */
  acOn: boolean;
  /** 空调设定温度 */
  acTemp: number;
  /** HomePod 状态 */
  homePodMode: HomePodMode;
  /** 门口红色勿扰氛围灯 */
  doorAlertOn: boolean;
  /** 中枢小盒子呼吸灯 */
  hubBreathOn: boolean;
  /** 语音指令文本 */
  voiceTranscript?: string;
  voiceActionSummary?: string;
  /** 预留 3D 多图层 PNG 替换接口 */
  layers?: SceneLayersConfig;
}

export const SCENES: SceneState[] = [
  {
    id: 'wake',
    stepLabel: '场景 01',
    badge: '早上 08:30 · 起床准备',
    title: '清晨阳光照进书房，一切刚刚好',
    description:
      '白天自然光照进家里，电脑安静待机，空调保持关闭，音箱和台灯都在温柔待命。你走进房间坐下，随时准备开启一天的生活与工作。',
    isDaylight: true,
    ambientOpacity: 0.75,
    lampBrightness: 0.2,
    lampTone: 'cool',
    monitorMode: 'standby',
    acOn: false,
    acTemp: 26,
    homePodMode: 'idle',
    doorAlertOn: false,
    hubBreathOn: true,
  },
  {
    id: 'meeting',
    stepLabel: '场景 02',
    badge: '上午 10:00 · 线上开会',
    title: '电脑一开视频会，全屋自动配合你',
    description:
      '检测到电脑打开了视频会议，桌面台灯立刻亮起柔和护眼补光让你气色更好，客厅的 HomePod 自动静音防打扰，房门外还会亮起提示灯告诉家人“正在开会”。',
    isDaylight: true,
    ambientOpacity: 0.85,
    lampBrightness: 0.92,
    lampTone: 'neutral',
    monitorMode: 'meeting',
    acOn: false,
    acTemp: 26,
    homePodMode: 'muted',
    doorAlertOn: true,
    hubBreathOn: true,
  },
  {
    id: 'voice',
    stepLabel: '场景 03',
    badge: '晚上 20:30 · 下班回家',
    title: '随口说句话，不同牌子的家电一起动',
    description:
      '不用打开好几个 App！说一句“有点热，灯暗一点，放点爵士乐”，小米台灯自动调成温馨暖黄光，挂机空调吹出 24°C 柔风，HomePod 同步放起音乐。',
    isDaylight: false,
    ambientOpacity: 0.45,
    lampBrightness: 0.45,
    lampTone: 'warm',
    monitorMode: 'music',
    acOn: true,
    acTemp: 24,
    homePodMode: 'playing',
    doorAlertOn: false,
    hubBreathOn: true,
    voiceTranscript: '“有点热，灯暗一点，用 HomePod 放点爵士乐”',
    voiceActionSummary: '台灯调暖 · 空调开 24°C · 开始放音乐',
  },
  {
    id: 'sleep',
    stepLabel: '场景 04',
    badge: '深夜 23:30 · 准备睡觉',
    title: '说声晚安，全屋安静熄灯进入睡眠',
    description:
      '全屋灯光、电脑屏幕和空调一起温柔熄灭帮你省电，只剩下桌面上的 AuraHub 小盒子留着一颗微弱安心的呼吸灯，静静守护一整晚。',
    isDaylight: false,
    ambientOpacity: 0.1,
    lampBrightness: 0,
    lampTone: 'warm',
    monitorMode: 'off',
    acOn: false,
    acTemp: 26,
    homePodMode: 'off',
    doorAlertOn: false,
    hubBreathOn: true,
  },
];
