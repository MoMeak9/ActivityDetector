import { getDistance, throttle } from "./utils"
import type { ICtorOptions, UserEvent, LogStackItem } from "./types"
import { EvenType } from "./types"
import { isSSR, binarySearchTwoTargets, binarySearchOneTarget } from "./utils"

const DEFAULT_ACTIVITY_EVENTS = [
  "click",
  "mousemove",
  "keydown",
  "DOMMouseScroll",
  "mousewheel",
  "mousedown",
  "touchstart",
  "touchmove",
  "focus"
]

export class ActivityDetector {
  private logStack: Array<LogStackItem>
  private startTime: number | undefined
  state: "start" | "stop" = "stop"
  activityEvents: string[]
  logStackMaxLength: number
  preEvent: any | undefined
  samplingTime: number = 100
  /**
   * 构造函数
   * @param activityEvents 用户活动事件
   * @param logStackMaxLength 日志栈最大长度
   * @param autoInit 是否自动初始化
   * @param timeToStar 初始化延迟时间
   * @param samplingTime 采样时间
   */
  constructor({
    activityEvents = DEFAULT_ACTIVITY_EVENTS,
    logStackMaxLength = 20,
    autoInit = true,
    timeToStart = 0,
    samplingTime = 100
  }: ICtorOptions) {
    this.logStackMaxLength = logStackMaxLength
    this.activityEvents = activityEvents
    this.logStack = []
    this.samplingTime = samplingTime
    if (autoInit) {
      setTimeout(() => {
        this.start()
      }),
        timeToStart
    }
  }

  /**
   * @description 处理用户活动事件
   * @private
   */
  private handleUserActivityEvent() {
    return throttle((event: UserEvent) => {
      let log: LogStackItem | undefined
      if (event instanceof MouseEvent) {
        log = {
          type: event.type as EvenType.Move | EvenType.Click,
          x: event.clientX,
          y: event.clientY,
          preX: this.preEvent?.x || 0,
          preY: this.preEvent?.y || 0,
          changeDistance:
            (this.preEvent?.x &&
              this.preEvent?.y &&
              getDistance(event.clientX, event.clientY, this.preEvent?.x, this.preEvent?.y)) ||
            0,
          timestamp: (this.startTime && Date.now() - this.startTime) || 0,
          preType: this.preEvent?.type
        }
      } else if (event instanceof KeyboardEvent) {
        log = {
          type: EvenType.Keydown,
          key: event.key,
          preKey: this.preEvent?.key || "mouse",
          preType: this.preEvent?.type,
          timestamp: (this.startTime && Date.now() - this.startTime) || 0
        }
      } else if (event instanceof FocusEvent) {
        log = {
          type: EvenType.Focus,
          preType: this.preEvent?.type,
          timestamp: (this.startTime && Date.now() - this.startTime) || 0
        }
      } else if (event instanceof WheelEvent) {
        log = {
          type: EvenType.Wheel,
          preType: this.preEvent?.type,
          timestamp: (this.startTime && Date.now() - this.startTime) || 0,
          deltaX: event.deltaX,
          deltaY: event.deltaY
        }
      } else if (event instanceof TouchEvent) {
        log = {
          type: EvenType.Touch,
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          preX: this.preEvent?.x || 0,
          preY: this.preEvent?.y || 0,
          changeDistance:
            (this.preEvent?.x &&
              this.preEvent?.y &&
              getDistance(
                event.touches[0].clientX,
                event.touches[0].clientY,
                this.preEvent?.x,
                this.preEvent?.y
              )) ||
            0,
          timestamp: (this.startTime && Date.now() - this.startTime) || 0,
          preType: this.preEvent?.type
        }
      }
      // 日志超长，则清除最早的一条
      if (this.logStack.length >= this.logStackMaxLength) {
        this.logStack.shift()
      }
      log && this.logStack.push(log)
      this.preEvent = log
    }, this.samplingTime)
  }

  public start() {
    if (isSSR()) {
      console.error("ActivityDetector can not be used in SSR")
      return
    }
    this.startTime = Date.now()
    this.state = "start"
    this.activityEvents.forEach(event => {
      window.addEventListener(event, this.handleUserActivityEvent())
    })
  }

  public stop() {
    if (isSSR()) {
      console.error("ActivityDetector can not be used in SSR")
      return
    }
    this.startTime = undefined
    this.state = "stop"
    this.activityEvents.forEach(event => {
      window.removeEventListener(event, this.handleUserActivityEvent())
    })
  }

  public clearLog() {
    this.logStack = []
  }

  /**
   * @description 获取查询事件发生前一段时间的日志
   * @param preTime ms
   */
  public getPreTimeLog(preTime?: number) {
    if (preTime) {
      const lastTime = this.logStack[this.logStack.length - 1]?.timestamp
      if (lastTime && lastTime >= preTime) {
        return this.logStack.filter(log => log.timestamp && log.timestamp >= lastTime - preTime)
      } else {
        return this.logStack
      }
    } else {
      return this.logStack
    }
  }

  /**
   * @description 获取查询时间段内的日志
   * @param startTime ms
   * @param endTime ms
   */
  public getLog(startTime?: number, endTime?: number) {
    const timestampArr = this.logStack.map(log => log.timestamp)
    if (startTime && endTime && startTime < endTime) {
      // 二分查找
      const [star, end] = binarySearchTwoTargets(timestampArr, startTime, endTime)
      return this.logStack.slice(star, end)
    }
    if (!endTime && startTime) {
      return this.logStack.slice(binarySearchOneTarget(timestampArr, startTime))
    }
    if (!startTime && endTime) {
      return this.logStack.slice(0, binarySearchOneTarget(timestampArr, endTime))
    }
    return this.logStack
  }
}

export default ActivityDetector
