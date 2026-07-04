export interface ContrastAuditPair {
    name: string;
    foreground: string;
    background: string;
    minimum: number;
}
export interface ContrastAuditResult extends ContrastAuditPair {
    ratio: number;
    passed: boolean;
}
export declare function getRelativeLuminance(color: string): number;
export declare function getContrastRatio(foreground: string, background: string): number;
export declare function auditContrastPairs(pairs: ContrastAuditPair[]): ContrastAuditResult[];
