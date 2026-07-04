import type { YokConfigSize } from '../config-provider';
import type { YDateTimePickerDisabledDate, YDateTimePickerDisabledTime, YDateTimeShortcut } from './date-time';
interface YDateTimePickerProps {
    id?: string;
    modelValue?: string;
    label?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    locale?: string;
    minuteStep?: number;
    disabledDate?: YDateTimePickerDisabledDate;
    disabledTime?: YDateTimePickerDisabledTime;
    shortcuts?: YDateTimeShortcut[];
    error?: string;
    size?: YokConfigSize;
    invalid?: boolean;
}
declare const _default: import("vue").DefineComponent<YDateTimePickerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
    change: (value: string) => any;
    clear: () => any;
    visibleChange: (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<YDateTimePickerProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
    onVisibleChange?: ((open: boolean) => any) | undefined;
}>, {
    id: string;
    modelValue: string;
    label: string;
    ariaLabel: string;
    ariaDescribedby: string;
    placeholder: string;
    disabled: boolean;
    clearable: boolean;
    locale: string;
    minuteStep: number;
    shortcuts: YDateTimeShortcut[];
    error: string;
    invalid: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
