const colors = (ch) => {
  const result = {}

  for (let x = 10; x <= 90; x += 10) {
    result[x] = `oklch(${x}% ${ch})`
  }

  return result
}

module.exports = {
  theme: {
    extend: {
      colors: {
        tertiary: colors("var(--theme-tertiary-ch)"),
      },
    },
  },
}
