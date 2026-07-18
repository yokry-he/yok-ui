import type { YButtonIcon, YButtonNativeType, YButtonSize, YButtonType, YButtonVariant } from './types';
interface Props {
    type?: YButtonType | YButtonNativeType;
    variant?: YButtonVariant;
    size?: YButtonSize;
    nativeType?: YButtonNativeType;
    plain?: boolean;
    text?: boolean;
    bg?: boolean;
    link?: boolean;
    round?: boolean;
    circle?: boolean;
    dashed?: boolean;
    loading?: boolean;
    loadingIcon?: YButtonIcon;
    disabled?: boolean;
    icon?: YButtonIcon;
    block?: boolean;
    autofocus?: boolean;
    autoInsertSpace?: boolean;
    color?: string;
    dark?: boolean;
}
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
    icon?: (props: typeof __VLS_1) => any;
    loading?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    plain: boolean;
    text: boolean;
    bg: boolean;
    link: boolean;
    round: boolean;
    circle: boolean;
    dashed: boolean;
    loading: boolean;
    disabled: boolean;
    block: boolean;
    autofocus: boolean;
    autoInsertSpace: boolean;
    dark: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
