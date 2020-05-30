import React from 'react'

import { useMutation } from '@apollo/react-hooks'
import * as MUTATIONS from '../graphql/mutations'

import moment from 'moment'
import { Formik, Form, Field } from 'formik'

import {
  Frame,
  Input,
  Card,
  Helmet,
} from '../components'
import { ADD_UPDATE_SCHEMA, useColorMode } from '../utils'

export default () => {
  const { cm } = useColorMode()
  const [addUpdate, { loading }]= useMutation(MUTATIONS.ADD_UPDATE)
  return (
    <Frame>
      <Helmet>Admin</Helmet>
      <Card title="New Update:">
        <Formik
          initialValues={{
            ticker: '',
            title: '',
            content: '',
            date: moment().format('YYYY-MM-DD'),
            url: '',
          }}
          validationSchema={ADD_UPDATE_SCHEMA}
          onSubmit={async ({ ticker, title, content, date, url }) => {
            await addUpdate({
              variables: {
                addUpdateInput: {
                  title,
                  content,
                  date,
                  url,
                  ticker: ticker.toUpperCase(),
                }
              }
            })
            alert('Added update.')
            window.location.reload()
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors }) => (
            <Form>
              <Field name="ticker" as={Input} label="Stock Ticker" error={errors.ticker} wrapperClassName="mb-3" />
              <Field name="title" as={Input} label="Title" error={errors.title} wrapperClassName="mb-3" />
              <Field name="content" as={Input} textArea label="Content" error={errors.content} wrapperClassName="mb-3" />
              <Field name="date" as={Input} label="Date" error={errors.date} wrapperClassName="mb-3" />
              <Field name="url" as={Input} label="URL" error={errors.url} wrapperClassName="mb-3" />
              <button type="submit" disabled={loading} className={`mt-2 btn--${cm()}`}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </Card>
    </Frame>
  )
}