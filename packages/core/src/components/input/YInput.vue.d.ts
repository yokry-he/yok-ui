interface Props {
    modelValue?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    label: string;
    placeholder: string;
    disabled: boolean;
    modelValue: string;
    error: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
