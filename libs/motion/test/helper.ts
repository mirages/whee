export const delay: (t: number) => Promise<undefined> = time => new Promise(resolve => {
  setTimeout(resolve, time)
})