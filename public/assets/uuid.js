module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(10)
    .substring(1);