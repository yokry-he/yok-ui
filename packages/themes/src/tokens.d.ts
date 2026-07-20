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
export declare const yokMint: YokThemeTokens;
export declare const yokOcean: YokThemeTokens;
export declare const yokSakura: YokThemeTokens;
export declare const yokLavender: YokThemeTokens;
export declare const yokSunrise: YokThemeTokens;
export declare const yokForest: YokThemeTokens;
export declare const yokInk: YokThemeTokens;
export declare const yokPeach: YokThemeTokens;
export declare const yokSlate: YokThemeTokens;
export type YokThemeName = 'yok-light' | 'yok-clean' | 'yok-candy' | 'yok-mint' | 'yok-ocean' | 'yok-sakura' | 'yok-lavender' | 'yok-sunrise' | 'yok-forest' | 'yok-ink' | 'yok-peach' | 'yok-slate';
export interface YokThemeMeta {
    name: YokThemeName;
    label: string;
    description: string;
    primary: string;
    surface: string;
}
export declare const builtinThemes: YokThemeMeta[];
