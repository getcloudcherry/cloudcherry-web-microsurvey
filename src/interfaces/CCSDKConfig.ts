import { DisplayConfig } from "./DisplayConfig";

interface CCSDKConfig {
  isActive: boolean;
  themeColor: string;
  brandColor: string;
  position: string;
  textDirection: string;
  thankyouText: string;
  welcomeText: string;
  display: DisplayConfig;
  username: string;
  password: string;
  location: string;
  language: string;
  skipWelcomePage: boolean;
  keepAlive: number;
  cssSelector: string;
  scrollPercent: number;
  click: number;
  waitSeconds: number;
  grepURL: string;
  grepInvertURL: string;
  onExitDetect: boolean;
  startButtonText: string;
  resumeButtonText: string;
}
export { CCSDKConfig }
