# vue-crazy-calendar

![screenShot](https://github.com/crazy-hope/vue-crazy-calendar/blob/master/screenshot/calendar.png)

### 安装 `vue-crazy-calendar`
``` shell
yarn add vue-crazy-calendar
# or
npm install vue-crazy-calendar
```

### 引入 `vue-crazy-calendar`
``` javascript
// main.js
import CrazyCalendar from 'vue-crazy-calendar'
Vue.use(CrazyCalendar)
```

### 使用 `vue-crazy-calendar`
``` html
<CrazyCalendar></CrazyCalendar>
```

### 属性说明
| 属性 | 类型 | 默认值 | 说明 |
|-|-|-|-|
| weekFirst | `Number` | `1` | 列表排列，第一天是星期几 |
| language | `Number` | `1` | 0:中文 1：中文简写 2：英文  3：英文简写 |
| showArrow | `Boolean` | `true` | 是否显示左右切换按钮 |
| allowChange | `Boolean` | `true` | 是否允许切换 |
| allowYearMonthChange | `Boolean` | `true` | 是否可以切换年和月 |
| showOtherDay | `Boolean` | `true` | 是否填充当月前后的空白区域 |
| areaThings | `Array` | `[]` | 事件标记 |

``` javascript
areaThings = [
    {
        start: '2020-4-20',
        end: '2020-4-30',
        things: [
            'Test 1',
        ]
    },
    {
        start: '2020-3-20',
        end: '',
        things: [
            'Test 2',
            'Test 3'
        ]
    }
]
```