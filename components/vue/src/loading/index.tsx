import { defineComponent, computed, PropType } from 'vue'
import styles from './index.less'

export type LoadingType = 'spinner' | 'circle'

export default defineComponent({
  name: 'we-loading',
  props: {
    size: {
      type: [Number, String],
      default: 20
    },
    vertical: Boolean,
    type: {
      type: String as PropType<LoadingType>,
      default: 'spinner'
    },
    color: {
      type: String,
      default: '#999'
    }
  },
  setup(props, { slots }) {
    const offset = 0.7
    const size = computed(() => Math.floor(Number(props.size) / 2) * 2)
    const lineWidth = computed(() => (size.value * 0.5) / (1 + offset))
    const lineHeight = computed(() => lineWidth.value / 2.5)
    const renderSpinner = () => {
      const num = 10 // spinner 线条数
      const pos = []
      const diffR = 360 / num
      const diffO = 0.7 / num

      for (let i = 0; i < num; i++) {
        pos.push(
          <i
            data-test="loading-spinner"
            style={{
              width: `${Math.floor(lineWidth.value)}px`,
              height: `${Math.floor(lineHeight.value)}px`,
              transform: `translate(${offset * 100}%, -50%) rotate(${
                -90 + diffR * i
              }deg)`,
              transformOrigin: `-${offset * 100}% 50%`,
              opacity: 1 - diffO * i,
              backgroundColor: props.color
            }}
          ></i>
        )
      }

      return (
        <div
          class={[styles.spinner]}
          style={{
            animationTimingFunction: `steps(${num})`
          }}
        >
          {pos}
        </div>
      )
    }
    const renderCircle = () => {
      return (
        <div class={[styles.circle]}>
          <svg viewBox="0 0 30 30">
            <circle
              cx="15"
              cy="15"
              r="12"
              data-test="loading-circle"
              stroke={props.color}
            ></circle>
          </svg>
        </div>
      )
    }

    return () => (
      <div
        class={{
          [styles.loading]: true,
          [styles.vertical]: props.vertical
        }}
      >
        <div
          data-test="loading-size"
          style={{
            width: size.value + 'px',
            height: size.value + 'px'
          }}
        >
          {props.type === 'spinner' ? renderSpinner() : renderCircle()}
        </div>
        <div
          style={{
            color: props.color
          }}
        >
          {slots.default && slots.default()}
        </div>
      </div>
    )
  }
})
