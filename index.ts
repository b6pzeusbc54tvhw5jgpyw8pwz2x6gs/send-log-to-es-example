import { Client} from '@elastic/elasticsearch'
import to from 'await-to-js'
import { indexPattern, reportLogTemplate } from "./es-template"

const client = new Client({
  node: process.env.ES_ENDPOINT,
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
})

const createESTemplate = async () => {
  console.log('template will be created')
  const body = reportLogTemplate
  if (!body) return

  const [err, result] = await to(client.indices.putTemplate({
    name: indexPattern,
    create: true,
    include_type_name: true,
    body,
  }))

  if (err) {
    // 동시에 create 요청을 해서 두번째 이후로 줄줄이 실패!
    // 밖으로 빼서 globally 하게 한번만 실행되도록 하고
    // runtime 이 동시에 만들어져서 실패 할 수도 있으니
    // already exists 에러는 throw 하지 않도록
    console.log(err)
    throw err
  }

  return result
}

const sendLogToES = async () => {

  // example: lambda REPORT log
  const body = {
    RequestId: '7660cda7-8421-497a-a92b-78866acab06c',
    Duration: 5.02,
    BilledDuration: 6,
    MemorySize: 512,
    MaxMemoryUsed: 119,
  }
  await to(client.index({
    index: 'test-2020-01-01', type: '_doc',
    id: body.RequestId, body,
  }))
}

if (require.main === module) {
  // createESTemplate().catch(err => console.error(err))
  sendLogToES().catch(err => console.error(err))
}
