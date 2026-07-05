import type { YDatePickerCell, YDatePickerDisabledDate, YDateShortcut } from './date';
interface YDatePickerPanelProps {
    id?: string;
    modelValue?: string;
    label?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    locale?: string;
    disabled?: boolean;
    disabledDate?: YDatePickerDisabledDate;
    shortcuts?: YDateShortcut[];
    border?: boolean;
    showAdjacentMonths?: boolean;
    today?: Date;
    error?: string;
    invalid?: boolean;
}
declare const _default: import("vue").DefineComponent<YDatePickerPanelProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
    change: (value: string) => any;
    select: (cell: YDatePickerCell) => any;
    "panel-change": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<YDatePickerPanelProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    onSelect?: ((cell: YDatePickerCell) => any) | undefined;
    "onPanel-change"?: ((value: string) => any) | undefined;
}>, {
    id: string;
    modelValue: string;
    label: string;
    ariaLabel: string;
    ariaDescribedby: string;
    locale: string;
    disabled: boolean;
    shortcuts: YDateShortcut[];
    border: boolean;
    showAdjacentMonths: boolean;
    error: string;
    invalid: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
