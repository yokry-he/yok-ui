import {
  defineComponent,
  h,
  type PropType
} from 'vue'

export type YokIconSize = number | string
export type YokIconStrokeWidth = number | string

export interface CreateYokIconOptions {
  viewBox?: string
  strokeWidth?: YokIconStrokeWidth
  stroke?: string
  fill?: string
}

export function createYokIcon(
  name: string,
  paths: string[],
  options: CreateYokIconOptions = {}
) {
  return defineComponent({
    name: `Yok${name.charAt(0).toUpperCase()}${name.slice(1)}Icon`,
    props: {
      size: {
        type: [Number, String] as PropType<YokIconSize>,
        default: 16
      },
      color: {
        type: String,
        default: 'currentColor'
      },
      strokeWidth: {
        type: [Number, String] as PropType<YokIconStrokeWidth>,
        default: options.strokeWidth ?? 2
      },
      stroke: {
        type: String,
        default: options.stroke ?? ''
      },
      fill: {
        type: String,
        default: options.fill ?? 'none'
      },
      title: {
        type: String,
        default: ''
      },
      decorative: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const isDecorative = () => props.decorative || !props.title

      return () => h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: options.viewBox ?? '0 0 24 24',
          width: props.size,
          height: props.size,
          fill: props.fill,
          stroke: props.stroke || props.color,
          'stroke-width': props.strokeWidth,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          focusable: 'false',
          role: isDecorative() ? undefined : 'img',
          'aria-hidden': isDecorative() ? 'true' : undefined
        },
        [
          !isDecorative() ? h('title', props.title) : null,
          ...paths.map((path) => h('path', { d: path }))
        ]
      )
    }
  })
}
