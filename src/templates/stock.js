import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import Modal from 'react-modal'
import { Formik } from 'formik'

import {
  Input,
} from '../components'

import api from '../utils/api'

export default ({ ticker }) => {
  const [loaded, changeLoaded] = React.useState(false)
  const [{ companyData, marketData }, changeData] = React.useState({})
  const identity = useIdentityContext()
  const { user } = identity
  const { roles } = user.app_metadata
  const isAdmin = roles && roles.indexOf('admin') > -1


  React.useEffect(() => {
    async function loadData() {
      try {
        let data = await fetch(`/.netlify/functions/load-company?company=${ticker}`, {
          headers: {
            'Authorization': `Bearer ${user.token.access_token}`,
          },
        })
        data = await data.json()
        changeData(data)
        changeLoaded(true)
      } catch(e) {
        console.error(e)
        changeLoaded(true)
      }
    }
    loadData()
  }, [ticker, user])


  if (!loaded && !marketData) {
    return <p>Loading...</p>
  }
  if (loaded && !marketData) {
    return <p>No company found for: <span className="font-bold">{ticker}</span></p>
  }

  const { updateUser } = identity
  const following = user.user_metadata.follow || []
  const index = following.indexOf(ticker)
  let already = false
  if (index > -1) {
    already = true
  }

  async function handleClick() {
    if (already) {
      // unfollow
      const index = following.indexOf(ticker)
      if (index > -1) {
        following.splice(index, 1)
      }
      await updateUser({ data: { follow: [...following] }})
    } else {
      // follow
      await updateUser({ data: { follow: [...following, ticker] }})
    }
    window.location.reload()
  }

  return (
    <div className="flex">
      <div className="w-1/4">
        <h1 className="text-4xl font-bold">{marketData['Name']}</h1>
        <h3 className="text-2xl font-bold">{ticker}</h3>
        <LogoSection admin={isAdmin} ticker={ticker} src={companyData.logo} />
        <p
          className="link my-2"
          onClick={handleClick}
        >
          {already ? 'Unfollow' : 'Follow'}
        </p>
        <p>Open: ${parseFloat(marketData['Open'])}</p>
        <p>High: ${parseFloat(marketData['High'])}</p>
        <p>Low: ${parseFloat(marketData['Low'])}</p>
        <p>Price: ${parseFloat(marketData['LastPrice'])}</p>
        <p>Change: ${parseFloat(marketData['Change'])}</p>
      </div>
      <div className="w-3/4">
        <UpdatesSection admin={isAdmin} updates={companyData.updates} ticker={ticker} />
        <CalendarSection admin={isAdmin} events={companyData.events} />
      </div>
    </div>
  )
}

const LogoSection = ({ admin, ticker, src }) => {
  const [file, changeFile] = React.useState()
  function onChange(e) {
    changeFile(e.target.files[0])
  }
  async function onSubmit(e) {
    e.preventDefault()
    console.log(file)
    const fileData = new FormData()
    fileData.append('Content-Type', file.type)
    fileData.append('file', file)
    try {
      let data = await api.uploadFile({
        ticker,
        file,
        fileName: file.name,
        fileType: file.type,
      })
      console.log(data)
    } catch(e) {
      console.error(e)
    }
  }
  return (
    <form onSubmit={onSubmit}>
      {!src && <div className="border border-black rounded" style={{ width: 100, height: 100 }} />}
      {src && <img src={src} style={{ maxWidth: 100 }} />}
      {admin &&
        <div>
          <input type="hidden" name="MAX_FILE_SIZE" value="4194304" />
          <input type="file" onChange={onChange} />
          {file &&
            <button className="btn--outlined--secondary" type="submit">Submit</button>
          }
        </div>
      }
    </form>
  )
}

const UpdatesSection = ({ admin, ticker }) => {
  const [modal, changeModal] = React.useState(false)
  const [loading, changeLoading] = React.useState(true)
  const [updates, changeUpdates] = React.useState([])

  React.useEffect(() => {
    async function loadData() {
      try {
        let data = await api.loadUpdates(ticker)
        data = await data.json()
        if (data) changeUpdates(data)
      } catch(e) {
        console.error(e)
      }
      changeLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <>Loading...</>
  }

  async function onSubmit(values) {
    try {
      await api.newUpdate({
        ticker,
        ...values
      })
    } catch(e) {
      console.error(e)
    }
    changeModal(false)
  }

  return (
    <div className="py-2">
      <h2 className="text-xl font-bold mb-1">Recent Updates</h2>
      {updates.map(({ title, date, link }, i) => {
        return (
          <div className="bg-white rounded p-3 mb-4 shadow" key={i}>
            <h3><a href={link} target="_blank">{title}</a></h3>
            <p>{date}</p>
          </div>
        )
      })}
      {updates.length === 0 &&
        <div>
          <h3>No updates found.</h3>
        </div>
      }
      <button className="btn">See More</button>
      {admin &&
        <div>
          <button className="btn--outlined--secondary" onClick={() => changeModal(true)}>Add Update</button>
        </div>
      }
      <Modal
        isOpen={modal}
        onRequestClose={() => changeModal(false)}
        contentLabel="Example Modal"
      >
        <Formik
          initialValues={{
            title: '',
            date: '',
          }}
          onSubmit={onSubmit}
          // validationSchema={SignInSchema}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {props => (
            <form onSubmit={props.handleSubmit}>
              <Input
                label="Title"
                type="text"
                name="title"
                error={props.errors.title}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.title}
                autoFocus
              />
              <div className="py-2" />
              <Input
                label="Date"
                type="date"
                name="date"
                error={props.errors.date}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.date}
              />
              <div className="py-2" />
              <div>
                <button className="btn--secondary" type="submit">Submit</button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}

const CalendarSection = ({ admin, events = [] }) => {
  return (
    <div className="py-2">
      <h2 className="text-xl font-bold mb-1">Upcoming Calendar Events</h2>
      {events.map(({ title, date }, i) => {
        return (
          <div className="bg-white rounded p-3 mb-4 shadow" key={i}>
            <h3>{title}</h3>
            <p>{date}</p>
          </div>
        )
      })}
      {events.length === 0 &&
        <div>
          <h3>No events found.</h3>
        </div>
      }
      <button className="btn">See Full Calendar</button>
      {admin &&
        <div>
          <button className="btn--outlined--secondary">Add Event</button>
        </div>
      }
    </div>
  )
}