const statuses = [
  'active',
  'completed',
  'delayed',
  'failed',
  'paused',
  'waiting',
]

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals
  const pairs = Object.entries(bullMasterQueues)

  if (pairs.length === 0) {
    return [];
  }

  const queues = await Promise.all(
    pairs.map(async ([name, queue]) => {
      const counts = await queue.getJobCounts(...statuses)

      return {
        name,
        counts,
      }
    }),
  )

  return res.json({
    queues,
  })
}
