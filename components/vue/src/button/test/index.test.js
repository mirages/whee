import Button from '../'
import { mount } from '@vue/test-utils'

test('the shape prop can set the button shape', async () => {
  const wrapper = mount(Button, {
    props: {
      shape: 'square'
    }
  })
  let html = wrapper.html()
  await wrapper.setProps({ shape: 'round' })
  html += wrapper.html()

  expect(html).toMatchSnapshot()
})

test('the type prop can set the button style types', async () => {
  const wrapper = mount(Button)
  let html = wrapper.html()

  await wrapper.setProps({ type: 'primary' })
  html += wrapper.html()

  await wrapper.setProps({ type: 'danger' })
  html += wrapper.html()

  await wrapper.setProps({ type: 'ghost' })
  html += wrapper.html()

  expect(html).toMatchSnapshot()
})

test('the block prop can set the button display block', async () => {
  const wrapper = mount(Button)
  let html = wrapper.html()

  await wrapper.setProps({ block: true })
  html += wrapper.html()

  expect(html).toMatchSnapshot()
})

test('the disabled prop can set the button disable state', async () => {
  const wrapper = mount(Button)
  let html = wrapper.html()

  await wrapper.setProps({ disabled: true })
  html += wrapper.html()

  expect(html).toMatchSnapshot()
})

test('the loading props can set the button loading state', async () => {
  const wrapper = mount(Button, {
    props: {
      loading: true,
      loadingSize: 20,
      loadingType: 'circle'
    }
  })
  let html = wrapper.html()

  await wrapper.setProps({ type: 'primary' })
  html += wrapper.html()

  await wrapper.setProps({ type: 'ghost' })
  html += wrapper.html()

  expect(html).toMatchSnapshot()
})

test('the default slot can set the button text', () => {
  const wrapper = mount(Button, {
    slots: {
      default: () => <p data-test="text">确认无误</p>
    }
  })

  expect(wrapper.find('[data-test=text]').html()).toEqual(
    '<p data-test="text">确认无误</p>'
  )
})

test('should emit click event', async () => {
  const mockFn = jest.fn()
  const wrapper = mount(Button, {
    props: {
      onclick: mockFn
    }
  })

  await wrapper.trigger('click')

  expect(mockFn).toHaveBeenCalledTimes(1)
})

test('should not emit click event when disabled', async () => {
  const mockFn = jest.fn()
  const wrapper = mount(Button, {
    props: {
      disabled: true,
      onClick: mockFn
    }
  })

  await wrapper.trigger('click')

  expect(mockFn).toHaveBeenCalledTimes(0)
})

test('should not emit click event when loading', async () => {
  const mockFn = jest.fn()
  const wrapper = mount(Button, {
    props: {
      loading: true,
      onClick: mockFn
    }
  })

  await wrapper.trigger('click')

  expect(mockFn).toHaveBeenCalledTimes(0)
})
