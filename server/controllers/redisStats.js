const { parse: parseRedisInfo } = require('redis-info')

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals
  const [ queue ] = Object.values(bullMasterQueues)

  if (!queue) {
    return {};
  }
  const redisClient = await queue.client
  const redisInfoRaw = await redisClient.info()
  const redisInfo = parseRedisInfo(redisInfoRaw)

  const {
    redis_version: redisVersion,
    used_memory: usedMemory,
    mem_fragmentation_ratio: memFragmentationRatio,
    connected_clients: connectedClients,
    blocked_clients: blockedClients,
    total_system_memory: totalSystemMemory,
    maxmemory,
  } = redisInfo;

  return res.json({
    redisVersion,
    usedMemory,
    memFragmentationRatio,
    connectedClients,
    blockedClients,
    totalSystemMemory: totalSystemMemory || maxmemory,
  })
};
