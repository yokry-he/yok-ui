import type { YSelectOption } from '../select';
export type YTimeSelectFormat = 'HH:mm' | 'hh:mm A';
export interface YTimeSelectOption extends YSelectOption {
    value: string;
}
export interface YTimeSelectOptionsConfig {
    start?: string;
    end?: string;
    step?: string;
    minTime?: string;
    maxTime?: string;
    format?: YTimeSelectFormat;
}
export declare function timeSelectValueToMinutes(value: string): number | null;
export declare function parseTimeSelectStep(step: string): number;
export declare function formatTimeSelectLabel(value: string, format?: YTimeSelectFormat): string;
export declare function createTimeSelectOptions(config?: YTimeSelectOptionsConfig): YTimeSelectOption[];
