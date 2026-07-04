import type { YDatePickerDisabledDate } from '../date-picker/date';
import type { YTimePickerDisabledTime } from '../time-picker/time';
export type YDateTimePickerDisabledDate = YDatePickerDisabledDate;
export type YDateTimePickerDisabledTime = YTimePickerDisabledTime;
export type YDateTimeShortcutValue = string | (() => string);
export interface YDateTimeValue {
    date: string;
    time: string;
    value: string;
}
export interface YDateTimeShortcut {
    label: string;
    value: YDateTimeShortcutValue;
    description?: string;
    disabled?: boolean;
}
export interface YResolvedDateTimeShortcut {
    label: string;
    value: string;
    description?: string;
    disabled: boolean;
}
export declare function parseDateTimeValue(value: string): YDateTimeValue | null;
export declare function combineDateTimeValue(date: string, time: string): string;
export declare function createDateTimeShortcut(shortcut: YDateTimeShortcut): YResolvedDateTimeShortcut;
