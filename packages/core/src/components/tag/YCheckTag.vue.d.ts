import type { YokConfigSize } from '../config-provider';
export type YCheckTagTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
interface YCheckTagProps {
    checked?: boolean;
    disabled?: boolean;
    tone?: YCheckTagTone;
    label?: string;
    invalid?: boolean;
    error?: string;
    ariaDescribedby?: string;
    size?: YokConfigSize;
}
declare const _default: import("vue").DefineComponent<YCheckTagProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:checked": (value: boolean) => any;
    change: (value: boolean) => any;
    click: (event: MouseEvent) => any;
    focus: (event: FocusEvent) => any;
    blur: (event: FocusEvent) => any;
}, string, import("vue").PublicProps, Readonly<YCheckTagProps> & Readonly<{
    "onUpdate:checked"?: ((value: boolean) => any) | undefined;
    onChange?: ((value: boolean) => any) | undefined;
    onClick?: ((event: MouseEvent) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
}>, {
    checked: boolean;
    disabled: boolean;
    tone: YCheckTagTone;
    label: string;
    invalid: boolean;
    error: string;
    ariaDescribedby: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
