import React from 'react'

const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default () => {
  const [state, setState] = React.useState({})
  const handleSubmit = (e) => {
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', ...state }),
    })
      .then(() => alert('Success!'))
      .catch((error) => alert(error))

    e.preventDefault()
  }

  const handleChange = (e) => setState({ [e.target.name]: e.target.value })

  return (
    <form
      name="contact"
      netlify="true"
      netlify-honeypot="bot-field"
      hidden
      onSubmit={handleSubmit}
    >
      <input type="text" name="name" onChange={handleChange} />
      <input type="email" name="email" onChange={handleChange} />
      <textarea name="message" onChange={handleChange}></textarea>
    </form>
  )
}
