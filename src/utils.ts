/**
 * @description 节流函数
 * @param fn
 * @param delay
 */
export const throttle = (fn: (...arg: any) => void, delay: number) => {
  let timer: NodeJS.Timeout | null = null
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, arguments)
        timer = null
      }, delay)
    }
  }
}

// 计算坐标点之间的距离
export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.floor(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
}

// 是否为SSR
export const isSSR = () => {
  return typeof window === "undefined"
}

// 二分查找多目标值
export const binarySearchTwoTargets = (arr: Array<number>, target1: number, target2: number) => {
  let left = 0
  let right = arr.length - 1
  let index1 = -1
  let index2 = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midValue = arr[mid]

    // 检查中间值是否为任一目标值
    if (midValue === target1 || midValue === target2) {
      if (midValue === target1) {
        index1 = mid
        // 如果已经找到第二个目标，则结束搜索
        if (index2 !== -1) break
        // 继续搜索第二个目标值
        target1 = target2
      } else {
        index2 = mid
        // 如果已经找到第一个目标，则结束搜索
        if (index1 !== -1) break
        // 继续搜索第一个目标值
        target2 = target1
      }
    }

    // 根据中间值与目标值的比较，调整搜索范围
    if (midValue < target1) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return [index1, index2]
}

// 二分查找单目标值
export const binarySearchOneTarget = (arr: Array<number>, target: number) => {
  let left = 0
  let right = arr.length - 1
  let index = -1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midValue = arr[mid]

    // 检查中间值是否为目标值
    if (midValue === target) {
      index = mid
      break
    }

    // 根据中间值与目标值的比较，调整搜索范围
    if (midValue < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return index
}
