export const indexPattern = 'report-*'

export const reportLogTemplate = {
  "index_patterns": [indexPattern],
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "index": {
      "refresh_interval": "5s"
    }
  },
  "mappings": {
    "_doc": {
      "_source": { "enabled": true },
      "properties": {
        "@timestamp":  { "type": "date" },
        requestId:     { type: "keyword", index: true },
        level:         { type: "keyword", index: true },
        raw:           { type: "text",    index: false },
        "fields": {
          "properties": {
            billedDuration: { type: "integer" },
            duration: { type: "integer" },
            memorySize: { type: "integer" },
            maxMemoryUsed: { type: "integer" },
          }
        }
      }
    }
  }
}
