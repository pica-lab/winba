import { config as dotenvConfig } from 'dotenv'

let configed = false

export const config = () => {
  if (configed) {
    return process.env
  }
  
  dotenvConfig()

  if (!process.env.OP_RPC_URL) {
    throw new Error('Optimism RPC URL not specified')
  }

  if (!process.env.THIRDWEB_CLIENT_ID || !process.env.THIRDWEB_SECRET_KEY) {
    throw new Error('Thirdweb credentials not specified')
  }

  configed = true
  return process.env
}
```
