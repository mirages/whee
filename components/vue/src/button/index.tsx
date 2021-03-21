import { defineComponent, PropType } from 'vue'
import styles from './index.less'
import Loading from '../loading/index'

export type Shape = 'square' | 'round'
export type BtnType = 'default' | 'primary' | 'danger' | 'ghost'

export default defineComponent({
  name: 'we-button',
  props: {
    shape: {
      type: String as PropType<Shape>,
      default: 'square'
    },
    type: {
      type: String as PropType<BtnType>,
      default: 'default'
    },
    block: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    return () => (
      <button
        class={{
          [styles.btn]: true,
          [styles.btnDefault]: props.type === 'default',
          [styles.btnPrimary]: props.type === 'primary',
          [styles.btnDanger]: props.type === 'danger',
          [styles.btnGhost]: props.type === 'ghost',
          [styles.round]: props.shape === 'round',
          [styles.square]: props.shape === 'square',
          [styles.block]: props.block
        }}
        disabled={props.disabled}
      >
        <div class={[styles.content]}>
          {props.loading ? (
            <Loading
              color={
                props.type === 'default' || props.type === 'ghost'
                  ? '#4f8efa'
                  : '#fff'
              }
            />
          ) : (
            ''
          )}
          <div>{slots.default ? slots.default() : ''}</div>
        </div>
      </button>
    )
  }
})
