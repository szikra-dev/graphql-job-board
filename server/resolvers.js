import { Job, Company } from './db.js'

const rejectIf = (condition) => {
  if (condition) throw new Error('Unauthorized')
}

export const resolvers = {
  Query: {
    job: (_root, { id }) => Job.findById(id),
    jobs: () => Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob: (_root, { input }, { user }) => {
      rejectIf(!user)
      return Job.create({ ...input, companyId: user.companyId })
    },
    deleteJob: async (_root, { id }, { user }) => {
      const job = await Job.findById(id)
      rejectIf(!user || user.companyId !== job.companyId)
      return Job.delete(id)
    },
    updateJob: async (_root, { input }, { user }) => {
      const job = await Job.findById(input.id)
      rejectIf(!user || user.companyId !== job.companyId)
      return Job.update({ ...input, companyId: user.companyId })
    },
  },

  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },

  Job: {
    company: ({ companyId }) => Company.findById(companyId),
  },
}
