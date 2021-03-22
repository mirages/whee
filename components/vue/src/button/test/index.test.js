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

test('the loading props can set the button loading state', () => {
  const wrapper = mount(Button, {
    props: {
      loading: true,
      loadingSize: 20,
      loadingType: 'circle'
    }
  })

  expect(wrapper.html()).toMatchSnapshot()
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
