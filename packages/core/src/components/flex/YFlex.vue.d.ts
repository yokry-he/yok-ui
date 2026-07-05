import type { CSSProperties } from 'vue';
export type YFlexSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | number | string;
export type YFlexGap = YFlexSize | [YFlexSize, YFlexSize];
export type YFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type YFlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline' | 'normal';
export type YFlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | 'normal';
export type YFlexWrap = boolean | 'reverse';
export type YFlexElement = 'div' | 'span' | 'section' | 'nav' | 'header' | 'footer' | 'main' | 'ul' | 'ol';
interface YFlexProps {
    as?: YFlexElement;
    direction?: YFlexDirection;
    vertical?: boolean;
    align?: YFlexAlign;
    justify?: YFlexJustify;
    gap?: YFlexGap;
    wrap?: YFlexWrap;
    inline?: boolean;
    flex?: string | number;
    ariaLabel?: string;
    style?: CSSProperties;
}
declare const _default: import("vue").DefineComponent<YFlexProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<YFlexProps>, {
    as: YFlexElement;
    direction: YFlexDirection;
    vertical: boolean;
    align: YFlexAlign;
    justify: YFlexJustify;
    gap: YFlexGap;
    wrap: YFlexWrap;
    inline: boolean;
    flex: string | number;
    ariaLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
