module.exports = () => {
  _.each(document.querySelectorAll('nav a'), (el) => {
    if(location.pathname === el.getAttribute('href')) {
      el.className += ' current'
    }
  })
}

