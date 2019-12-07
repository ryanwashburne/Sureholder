import React from 'react'

import Modal from 'react-modal'
import { Formik } from 'formik'
import { UpdateSchema } from '../../utils/schemas'

import {
  Input,
} from '../../components'

import { useQuery, useMutation } from '@apollo/react-hooks'
import * as QUERIES from '../../graphql/queries'
import * as MUTATIONS from '../../graphql/mutations'

export default ({ admin, ticker }) => {
  const [modal, changeModal] = React.useState(false)

  const variables = React.useMemo(() => ({ ticker }), [ticker])
  const { data, loading, error } = useQuery(
    QUERIES.UPDATES_BY_TICKER,
    { variables }
  )

  const [createUpdate, aaa] = useMutation(MUTATIONS.CREATE_UPDATE)
  
  if (error) return <>Error!</>
  if (loading) return <>Loading...</>

  async function onSubmit(values) {
    try {
      const variables = {
        UpdateInput: {
          ticker,
          title: values.title,
          date: values.date,
          link: values.link, 
        },
      }
      await createUpdate({
        variables
      })
    } catch(e) {
      console.error(e)
    }
    changeModal(false)
  }

  return (
    <div className="py-2">
      <h2 className="text-xl font-bold mb-1">Recent Updates</h2>
      {data.updatesByTicker.map(({ title, date, link }, i) => {
        return (
          <div className="bg-white rounded p-3 mb-4 shadow" key={i}>
            <h3><a href={link} target="_blank">{title}</a></h3>
            <p>{date}</p>
          </div>
        )
      })}
      {data.updatesByTicker.length === 0 &&
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
            link: '',
          }}
          onSubmit={onSubmit}
          validationSchema={UpdateSchema}
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
              <Input
                label="Link"
                type="text"
                name="link"
                error={props.errors.link}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.link}
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