## Button

### Usage

#### Type

```html
<we-button>Default</we-button>
<we-button type="primary">Primary</we-button>
<we-button type="danger">Danger</we-button>
<we-button type="ghost">Ghost</we-button>
```

#### Shape

```html
<we-button>Square</we-button> <we-button shape="round">Round</we-button>
```

#### Block

```html
<we-button>Display inline block</we-button>
<we-button block>Display block</we-button>
```

#### Disabled

```html
<we-button disabled>Disabled</we-button>
```

#### Loading

```html
<we-button loading>Spinner loading and button disabled</we-button>
<we-button loading loading-type="circle"
  >Circular loading and button disabled</we-button
>
<we-button loading loading-size="25">loading and button disabled</we-button>
```

### API

#### Props

| Attribute    | Type               | Description        | Values                                  | Default   |
| ------------ | ------------------ | ------------------ | --------------------------------------- | --------- |
| type         | _string_           | Button type        | `default`\|`primary`\|`danger`\|`ghost` | `default` |
| shape        | _string_           | Button shape       | `square`\|`round`                       | `square`  |
| block        | _boolean_          | Display block      | `true`\|`false`                         | `false`   |
| disabled     | _boolean_          | Disable the button | `true`\|`false`                         | `false`   |
| loading      | _boolean_          | Show loading icon  | `true`\|`false`                         | `false`   |
| loading-type | _string_           | Loading type       | `spinner`\|`circle`                     | `spinner` |
| loading-size | _string_\|_number_ | Loading size       | -                                       | `20`      |

#### Events

| Event | Description        | Arguments           |
| ----- | ------------------ | ------------------- |
| click | Button click event | _event: MouseEvent_ |

#### Slots

| Name    | Description                                     | Default |
| ------- | ----------------------------------------------- | ------- |
| default | Can set the button text or other custom content | -       |
