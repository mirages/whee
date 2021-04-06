import { defineComponent, PropType } from 'vue'
import styles from './index.less'
import Loading, { LoadingType } from '../loading/index'

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
    loadingSize: {
      type: [String, Number],
      default: 18
    },
    loadingType: {
      type: String as PropType<LoadingType>,
      default: 'spinner'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    const clickHandler = (e: MouseEvent) => {
      if (!props.loading && !props.disabled) {
        emit('click', e)
      }
    }
    return () => {
      return (
        <button
          class={{
            [styles.btn]: true,
            [styles.btnDefault]: props.type === 'default',
            [styles.btnPrimary]: props.type === 'primary',
            [styles.btnDanger]: props.type === 'danger',
            [styles.btnGhost]: props.type === 'ghost',
            [styles.round]: props.shape === 'round',
            [styles.square]: props.shape === 'square',
            [styles.disabled]: props.disabled,
            [styles.loading]: props.loading,
            [styles.block]: props.block
          }}
          disabled={props.disabled}
          onClick={clickHandler}
        >
          <div class={[styles.content]}>
            {props.loading ? (
              <Loading
                size={props.loadingSize}
                type={props.loadingType}
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
  }
})
