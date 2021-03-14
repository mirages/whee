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
  expect(wrapper.html()).toMatchSnapshot()
})

test('the type prop can set the loading type: spinner or circle', async () => {
  const wrapper = mount(Loading, {
    props: {
      type: 'spinner'
    }
  })

  expect(wrapper.find('[data-test=loading-spinner]').exists()).toBe(true)
  let prevHtml = wrapper.html()

  await wrapper.setProps({ type: 'circle' })
  expect(wrapper.find('[data-test=loading-circle]').exists()).toBe(true)
  expect(prevHtml + wrapper.html()).toMatchSnapshot()
})

test('the default slot can set the loading text and style', () => {
  const wrapper = mount(Loading, {
    slots: {
      default: () => <p class="test">loading...</p>
    }
  })

  expect(wrapper.html()).toContain('<p class="test">loading...</p>')
  expect(wrapper.html()).toMatchSnapshot()
})
