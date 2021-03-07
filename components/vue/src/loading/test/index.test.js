import Loading from '..'
import { mount } from '@vue/test-utils'

test('the size prop can set the loading size', () => {
  const wrapper = mount(Loading, {
    props: {
      size: 40
    }
  })

  const loadingSize = wrapper.get('[data-test=loading-size]').element

  expect(loadingSize.style.width).toEqual('40px')
  expect(loadingSize.style.height).toEqual('40px')
})

test('the type prop can set the loading type: spinner or circle', async () => {
  const wrapper  = mount(Loading, {
    props: {
      type: 'spinner'
    }
  })

  expect(wrapper.find('[data-test=loading-spinner]').exists()).toBe(true)

  await wrapper.setProps({ type: 'circle' })
  expect(wrapper.find('[data-test=loading-circle]').exists()).toBe(true)
})

test('the color prop can set the loading and text color', () => {
  const wrapper = mount(Loading, {
    props: {
      color: 'red'
    }
  })
})
