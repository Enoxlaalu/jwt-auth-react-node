export default function debounce(
  func: (args: any) => void,
  timeout = 500,
): (args: any) => void {
  let timer: ReturnType<typeof setTimeout>

  return (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(value)
    }, timeout)
  }
}
