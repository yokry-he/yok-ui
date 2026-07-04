import type { YSelectSize } from '../select';
import type { YTimeSelectFormat } from './time-select';
interface YTimeSelectProps {
    id?: string;
    modelValue?: string;
    label?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    start?: string;
    end?: string;
    step?: string;
    minTime?: string;
    maxTime?: string;
    format?: YTimeSelectFormat;
    error?: string;
    size?: YSelectSize;
    invalid?: boolean;
}
declare const _default: import("vue").DefineComponent<YTimeSelectProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
    change: (value: string) => any;
    clear: () => any;
    visibleChange: (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<YTimeSelectProps> & Readonly<{
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
    start: string;
    end: string;
    step: string;
    minTime: string;
    maxTime: string;
    format: YTimeSelectFormat;
    error: string;
    invalid: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
