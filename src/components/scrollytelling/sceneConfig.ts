export type SceneId = 'wake' | 'meeting' | 'voice' | 'sleep';

export type MonitorMode = 'standby' | 'meeting' | 'music' | 'off';
export type HomePodMode = 'idle' | 'muted' | 'playing' | 'off';

export interface SceneLayersConfig {
  /** 可选：替换为真实 3D 渲染的房间底图 (如 /assets/room_base.png) */
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
  /** 环境主光强度 0-1 */
  ambientOpacity: number;
  /** 台灯亮度 0-1 */
  lampBrightness: number;
  /** 台灯色温：cool (5600K) | neutral (5000K) | warm (2700K) */
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
  /** 动态岛语音指令文本 */
  voiceTranscript?: string;
  voiceActionSummary?: string;
  /** 预留 3D 多图层 PNG 替换接口 */
  layers?: SceneLayersConfig;
}

export const SCENES: SceneState[] = [
  {
    id: 'wake',
    stepLabel: '01 / 04',
    badge: '0% - 25% · 自然唤醒',
    title: '清晨自然光，全屋静默待命',
    description:
      '清晨冷白自然光漫入书房，Mac 与 Windows 处于低功耗待机，空调关闭，HomePod 静默待命，等待你的第一个桌面动作或语音指令。',
    ambientOpacity: 0.55,
    lampBrightness: 0.35,
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
    stepLabel: '02 / 04',
    badge: '25% - 50% · 桌面状态联动',
    title: '摄像头一开，全屋进入会议模式',
    description:
      '检测到电脑开启视频会议，台灯自动提亮并切至 5000K 高显色补光光锥，HomePod 自动静音防打扰，门口氛围灯同步渗出克制的红色勿扰光晕。',
    ambientOpacity: 0.72,
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
    stepLabel: '03 / 04',
    badge: '50% - 75% · 本地 AI 语音大脑',
    title: '一句话，跨品牌设备协同响应',
    description:
      '本地 AI 离线解析模糊意图：主灯与台灯平滑降至 25% 暖琥珀光，挂机空调张开导风板送出 24°C 柔风，HomePod 亮起极光灯环并播放爵士乐。',
    ambientOpacity: 0.38,
    lampBrightness: 0.25,
    lampTone: 'warm',
    monitorMode: 'music',
    acOn: true,
    acTemp: 24,
    homePodMode: 'playing',
    doorAlertOn: false,
    hubBreathOn: true,
    voiceTranscript: '“有点热，调暗灯光，用 HomePod 放点爵士乐”',
    voiceActionSummary: '灯光 25% 暖光 · 空调 24°C · AirPlay 爵士乐',
  },
  {
    id: 'sleep',
    stepLabel: '04 / 04',
    badge: '75% - 100% · 晚安 / 离座休眠',
    title: '一键归零，极致静谧的夜间守护',
    description:
      '全屋照明、显示器与空调渐暗熄灭，仅保留桌面 AuraHub 中枢盒子一颗微弱的冷银蓝呼吸状态灯，低功耗守护局域网自动化规则。',
    ambientOpacity: 0.08,
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
