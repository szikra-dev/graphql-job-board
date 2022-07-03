import { request, gql } from 'graphql-request'
import { getAccessToken } from '../auth'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

export const getJobs = async () => {
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `
  const { jobs } = await request(GRAPHQL_URL, query)
  return jobs
}

export const getJob = async (id) => {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `
  const variables = { id }
  const { job } = await request(GRAPHQL_URL, query, variables)
  return job
}

export const getCompany = async (id) => {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `
  const variables = { id }
  const { company } = await request(GRAPHQL_URL, query, variables)
  return company
}

export const createJob = async (input) => {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `
  const variables = { input }
  const headers = {
    Authorization: `Bearer ${getAccessToken()}`,
  }
  const { job } = await request(GRAPHQL_URL, mutation, variables, headers)
  return job
}
