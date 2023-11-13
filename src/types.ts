export interface ICtorOptions {
  activityEvents?: string[]
  logStackMaxLength?: number
  autoInit?: boolean
  timeToStart?: number
  samplingTime?: number
}

export enum EvenType {
  Move = "mousemove",
  Click = "click",
  Keydown = "keydown",
  Wheel = "wheel",
  Touch = "touch",
  Focus = "focus"
}

interface IBaseLogItem {
  type: EvenType
  x: number
  y: number
  preX: number
  preY: number
  preType: EvenType
  changeDistance: number
  timestamp: number
}

export interface IMouseLogItem extends IBaseLogItem {
  type: EvenType.Move | EvenType.Click
}
export interface IKeyboardLogItem {
  type: EvenType.Keydown
  key: string
  preKey: string | "mouse"
  preType: EvenType
  timestamp: number
}

export interface IFocusLogItem {
  type: EvenType.Focus
  preType: EvenType
  timestamp: number
}

export interface ITouchLogItem extends IBaseLogItem {
  type: EvenType.Touch
}

export interface IWheelLogItem {
  type: EvenType.Wheel
  preType: EvenType
  timestamp: number
  deltaX: number
  deltaY: number
}

export type LogStackItem =
  | IMouseLogItem
  | IKeyboardLogItem
  | IFocusLogItem
  | ITouchLogItem
  | IWheelLogItem

type OptionsType<T extends { startTime: number }> = T & {
  endTime: number | undefined
} & {
  preTime?: number
}
export type IQueryOptions = OptionsType<{ startTime: number }>

export type UserEvent = MouseEvent | KeyboardEvent | FocusEvent | TouchEvent | WheelEvent
