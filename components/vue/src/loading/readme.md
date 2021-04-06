## Loading

### Usage

#### Type

```html
<!-- spinner loading -->
<we-loading />

<!-- circular loading -->
<we-loading type="circle"></we-loading>
```

#### Size

```html
<we-loading size="30" />

<we-loading :size="25" type="circle" />
```

#### Color

```html
<!-- the color of loading icon is red -->
<we-loading color="#f00" />

<!-- the color of loading text and icon is red -->
<we-loading color="#f00">Loading...</we-loading>

<!-- loading icon's color is red, and the text's color is yellow -->
<we-loading color="#f00">
  <span style="color: #ff0">Loading...</span>
</we-loading>
```

#### Vertical

```html
<!-- loading text and icon align horizontally -->
<we-loading>Loading...</we-loading>

<!-- loading text and icon align vertically -->
<we-loading vertical>Loading...</we-loading>
```

### API

#### Props

| Attribute | Type               | Description                              | Values              | Default   |
| --------- | ------------------ | ---------------------------------------- | ------------------- | --------- |
| type      | _string_           | Loading type: spinner or circle          | `spinner`\|`circle` | `spinner` |
| size      | _string_\|_number_ | Loading graphic size: numberical value   | -                   | `20`      |
| color     | _string_           | Color of loading text and icon           | -                   | `#999`    |
| vertical  | _boolean_          | Vertically aligned between text and icon | `true`\|`false`     | `false`   |

#### Slots

| Name    | Description                              | Default |
| ------- | ---------------------------------------- | ------- |
| default | Can set the loading text and text styles | -       |
