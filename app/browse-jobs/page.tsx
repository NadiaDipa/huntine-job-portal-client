import React from 'react'
import { getJobs } from '../api/jobs'

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

  const search = await searchParams

  const urlSearch = new URLSearchParams()

  Object.entries(search).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlSearch.set(key, value)
    }
  })

  const query = urlSearch.toString()

  console.log('Search params: ', query)

  const jobs = await getJobs(query)

  return (
    <div>
      <h1>Browse Jobs Page</h1>
    </div>
  )
}

export default BrowseJobsPage