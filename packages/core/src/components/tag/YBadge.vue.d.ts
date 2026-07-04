export type YBadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type YBadgePlacement = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';
interface YBadgeProps {
    value?: string | number;
    max?: number;
    dot?: boolean;
    showZero?: boolean;
    label?: string;
    tone?: YBadgeTone;
    placement?: YBadgePlacement;
}
declare const _default: import("vue").DefineComponent<YBadgeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<YBadgeProps> & Readonly<{}>, {
    value: string | number;
    max: number;
    dot: boolean;
    showZero: boolean;
    label: string;
    tone: YBadgeTone;
    placement: YBadgePlacement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
