<template>
    <div class="calendar theme1">
        <div class="calendar-bar">
            <div class="prev" @click="prevMonth" v-if="showArrow && curDate.year >= 1970"><i class="iconfont icon-left"></i></div>
            <div class="ym" @click="changeYearMonth">
                <div class="year">{{ curDate.year }}</div>
                <div class="split">/</div>
                <div class="month">{{ curDate.month | dobuleNumber }}</div>
            </div>
            <div class="next" @click="nextMonth" v-if="showArrow"><i class="iconfont icon-right"></i></div>
        </div>
        <div class="calendar-content">
            <div class="dayWrapper" v-if="!isShowYearMonthWrapper">
                <div class="dayWrapper-bar" v-if="curWeek">
                    <div
                        class="dayWrapper-item"
                        v-for="item in curWeek"
                        :key="item"
                    >
                        {{ item }}
                    </div>
                </div>
                <div class="dayWrapper-content">
                    <div
                        class="dayWrapper-item"
                        :class="showOtherDay ? 'prevDay':''"
                        v-for="item in beforeEmptyDate"
                        :key="item.timestamp"
                    >
                        {{ showOtherDay ? item.day : '&nbsp;' }}
                    </div>
                    <div
                        class="dayWrapper-item curDay"
                        v-for="item in curDate.days"
                        :key="item.timestamp"
                    >
                        {{ item }}
                    </div>
                    <div
                        class="dayWrapper-item"
                        :class="showOtherDay ? 'nextDay':''"
                        v-for="item in afterEmptyDate"
                        :key="item.timestamp"
                    >
                        {{ showOtherDay ? item.day : '&nbsp;' }}
                    </div>
                </div>
            </div>
            <div class="yearMonthWrapper" v-if="isShowYearMonthWrapper">
                <div class="yearMonthWrapper-content">
                    <div class="yearWrapper">
                        <div
                            class="yearWrapper-item"
                            :class="waitYear == item.num ? 'active': ''"
                            v-for="item in yearList"
                            :key="item.name"
                            @click="chooseYear(item.num)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                    <div class="monthWrapper">
                        <div
                            class="monthWrapper-item"
                            :class="waitMonth == item.num ? 'active': ''"
                            v-for="item in monthList"
                            :key="item.name"
                            @click="chooseMonth(item.num)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <div class="yearMonthWrapper-options">
                    <div class="cancel" @click="cancelYearMonth">取消</div>
                    <div class="confirm" @click="confirmYearMonth">确定</div>
                </div>
            </div>
        </div>
        <div class="calendar-thing"></div>
    </div>
</template>

<script>
export default {
    name: 'CrazyCalendar',

    props: {
        weekFirst: {
            type: Number,
            default: 1 // 第一天是星期几
        },
        language: {
            type: Number,
            default: 1 // 0:中文 1：中文简写 2：英文  3：英文简写
        },
        showArrow: {
            type: Boolean,
            default: true
        },
        allowChange: {
            type: Boolean,
            default: true
        },
        allowYearMonthChange: {
            type: Boolean,
            default: true
        },
        showOtherDay: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            yearAlias: [],
            monthAlias: [
                ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
                ['January','February','March','April','May','June','July','August','September','October','November','December'],
                ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
            ],
            weekAlias: [
                ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                ['日', '一', '二', '三', '四', '五', '六'],
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                ['Sun', 'Mon.', 'Tues.', 'Wed', 'Thur', 'Fri', 'Sat'],
            ],

            yearList: '',
            monthList: '',
            curDate: {},

            waitYear: '',
            waitMonth: '',

            isShowYearMonthWrapper: false
        }
    },

    filters: {
        dobuleNumber(v) {
            if (v <= 9) {
                return '0' + v
            } else {
                return v
            }
        }
    },

    computed: {
        // 当前显示的星期格式 根据每周星期几开始以及语言计算得出
        curWeek() {
            let week = this.weekAlias[this.language]
            let newWeekLeft = []
            let newWeekRight = []
            for(let i = 0; i <= 6; i++) {
                if(i < this.weekFirst) {
                    newWeekRight.push(week[i])
                } else {
                    newWeekLeft.push(week[i])
                }
            }
            return [
                ...newWeekLeft,
                ...newWeekRight
            ]
        },
        // 每个月前面空白的数量
        beforeEmptyCount() {
            const firstWeek = this.curDate.firstWeek
            if(firstWeek >= this.weekFirst) {
                return firstWeek - this.weekFirst
            } else {
                return 6 - (this.weekFirst - firstWeek) + 1
            }
        },
        // 每个月后面空白的数量
        afterEmptyCount() {
            const lastWeek = this.curDate.lastWeek
            if(lastWeek >= this.weekFirst) {
                return 6 - lastWeek + this.weekFirst
            } else {
                return this.weekFirst - 1 - lastWeek
            }
        },
        // 计算每个月之前的日期
        beforeEmptyDate() {
            const days = (new Date(this.curDate.year, this.curDate.month-1, 0)).getDate()
            let arr = []
            for(let i = 0; i < this.beforeEmptyCount; i++) {
                arr.push(
                    this.getDateNow(new Date(this.curDate.year, this.curDate.month-2, days - (this.beforeEmptyCount - i - 1)))
                )
            }
            return arr
        },
        // 计算每个月之后的日期
        afterEmptyDate() {
            let arr = []
            for(let i = 0; i < this.afterEmptyCount; i++) {
                arr.push(
                    this.getDateNow(new Date(this.curDate.year, this.curDate.month, i + 1))
                )
            }
            return arr
        },
    },

    methods: {
        // 设置双位数
        setDouble(v) {
            if (v <= 9) {
                return '0' + v
            } else {
                return v
            }
        },
        // 获取当前日期
        getDateNow(timestamp = '') {
            const date = timestamp ? new Date(timestamp) : new Date()
            let dateInfo = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hour: date.getHours(),
                minutes: date.getMinutes(),
                second: date.getSeconds(),
                week: date.getDay(),
                timestamp : date.getTime(),
                isToday: new Date().getDate() == date.getDate() ? true : false,
            }
            dateInfo.days = new Date(dateInfo.year, dateInfo.month, 0).getDate()
            dateInfo.firstWeek = (new Date(dateInfo.year, dateInfo.month - 1, 1)).getDay()
            dateInfo.lastWeek = (new Date(dateInfo.year, dateInfo.month - 1, dateInfo.days)).getDay()
            return dateInfo
        },
        // 上个月
        prevMonth() {
            if(!this.allowChange) return false 
            const stamp = new Date(this.curDate.timestamp).setMonth(this.curDate.month - 2)
            this.curDate = this.getDateNow(stamp)
        },
        // 下个月
        nextMonth() {
            if(!this.allowChange) return false 
            const stamp = new Date(this.curDate.timestamp).setMonth(this.curDate.month)
            this.curDate = this.getDateNow(stamp)
        },
        // 获取月份
        getMonthList() {
            let arr = []
            this.monthAlias[this.language].forEach((item, index) => {
                arr.push({
                    name: item,
                    num: index + 1
                })
            })
            this.monthList = arr
        },
        // 获取年份
        getYearList() {
            let years = []
            let nowYear = new Date().getFullYear()
            for(let i = nowYear; i >= nowYear - 50; i--) {
                if(i >= 1970) {
                    years.push({
                        name: i,
                        num: i
                    })
                }
            }
            this.yearList = years
        },
        changeYearMonth() {
            if(!this.allowYearMonthChange) return false
            this.waitYear = this.curDate.year
            this.waitMonth = this.curDate.month
            this.isShowYearMonthWrapper = !this.isShowYearMonthWrapper
        },
        // confirmYearMonth
        confirmYearMonth() {
            this.curDate = this.getDateNow(new Date(this.waitYear, this.waitMonth - 1))
            this.isShowYearMonthWrapper = !this.isShowYearMonthWrapper
        },
        cancelYearMonth() {
            this.isShowYearMonthWrapper = !this.isShowYearMonthWrapper
        },
        // chooseYear
        chooseYear(item) {
            this.waitYear = item
        },
        chooseMonth(item) {
            this.waitMonth = item
        },
        // 初始化
        init() {
            this.getYearList()
            this.getMonthList()
            const date = this.getDateNow()
            this.curDate = date
        },
    },

    created() {
        this.init()
    }
}
</script>

<style lang="scss" scoped>
@import './assets/iconfont/iconfont.css';

$barHeight: 40px;
$itemHeight: 40px;
$borderColor: #efefef;
$backgroundColor: #ffffff;

.theme1 {
    border: 1px solid $borderColor;
    background: $backgroundColor;
    .calendar {
        &-bar {
            border-bottom: 1px solid $borderColor;
            .year,
            .month,
            .prev,
            .next {
                &:hover,
                &:active {
                    background: darken(#ffffff, 5%)
                }
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
    .dayWrapper {
        &-item {
            box-shadow: 1px 1px 0 0 lighten($borderColor, 3%);
            &.curDay,
            &.prevDay,
            &.nextDay {
                &:hover,
                &:active {
                    background: darken(#ffffff, 5%);
                }
            }
            &.prevDay,
            &.nextDay {
                color: darken($backgroundColor, 30%);
                background: darken(#ffffff, 2%);
            }
        }
    }
    .yearWrapper,
    .monthWrapper {
        &-item {
            box-shadow: 1px 1px 0 0 lighten($borderColor, 3%);
            &.active,
            &:hover,
            &:active {
                background: darken(#ffffff, 5%);
            }
        }
    }
}

.calendar {
    &-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > * {
            height: $barHeight;
        }
        .ym {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .split {
            margin: 0 5px;
        }
        .year,
        .month {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            font-size: 16px;
        }
        .prev,
        .next {
            display: flex;
            align-items: center;
            justify-content: center;
            width: $barHeight;
            font-size: 24px;
        }
    }
}

.dayWrapper {
    &-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &-content {
        display: flex;
        align-items: top;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    &-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 100/7*1%;
        min-height: $itemHeight;
    }
}

.yearMonthWrapper {
    &-content,
    &-options {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &-options {
        .cancel,
        .confirm {
            flex: 0 0 50%;
            text-align: center;
            border-top: 1px solid $borderColor;
            height: $itemHeight;
            line-height: $itemHeight;
        }
    }
}
.yearWrapper,
.monthWrapper {
    flex: 1 1 50%;
    height: 200px;
    overflow: auto;
    &-item {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: $itemHeight;
    }
}
</style>