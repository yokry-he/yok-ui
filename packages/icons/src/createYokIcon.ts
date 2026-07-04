import {
  defineComponent,
  h,
  type PropType
} from 'vue'

export type YokIconSize = number | string

export interface CreateYokIconOptions {
  viewBox?: string
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
      title: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      return () => h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: options.viewBox ?? '0 0 24 24',
          width: props.size,
          height: props.size,
          fill: 'none',
          stroke: props.color,
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          role: props.title ? 'img' : undefined,
          'aria-hidden': props.title ? undefined : 'true'
        },
        [
          props.title ? h('title', props.title) : null,
          ...paths.map((path) => h('path', { d: path }))
        ]
      )
    }
  })
}
