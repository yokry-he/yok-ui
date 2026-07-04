interface Props {
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    label: string;
    disabled: boolean;
    modelValue: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
