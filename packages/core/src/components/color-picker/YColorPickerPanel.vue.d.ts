interface YColorPickerPanelProps {
    id?: string;
    modelValue?: string;
    label?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    presets?: string[];
    showAlpha?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    showValue?: boolean;
    error?: string;
    invalid?: boolean;
}
declare const _default: import("vue").DefineComponent<YColorPickerPanelProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
    change: (value: string) => any;
    clear: () => any;
}, string, import("vue").PublicProps, Readonly<YColorPickerPanelProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {
    id: string;
    modelValue: string;
    label: string;
    ariaLabel: string;
    ariaDescribedby: string;
    presets: string[];
    showAlpha: boolean;
    clearable: boolean;
    disabled: boolean;
    showValue: boolean;
    error: string;
    invalid: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
