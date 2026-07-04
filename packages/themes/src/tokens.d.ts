export interface YokThemeTokens {
    color: Record<string, string>;
    radius: Record<string, string>;
    space: Record<string, string>;
    shadow: Record<string, string>;
    motion: Record<string, string>;
}
export declare const yokLight: YokThemeTokens;
export declare const yokClean: YokThemeTokens;
export declare const yokCandy: YokThemeTokens;
export type YokThemeName = 'yok-light' | 'yok-clean' | 'yok-candy';
export interface YokThemeMeta {
    name: YokThemeName;
    label: string;
    description: string;
    primary: string;
    surface: string;
}
export declare const builtinThemes: YokThemeMeta[];
