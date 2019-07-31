/* eslint-disable no-template-curly-in-string */

export default {
  "id": "hello:world",
  "components": [
    {
      "element": "epi-headlinevalue",
      "@label": "User defined values",
      "@value": "Hello World!"
    },
    {
      "element": "epi-headlinevalue",
      "@label": "Native DOM events",
      "@value": {
        // "fn:jmespath": "[@.clientX, @.clientY]"
        "fn:jmespath": "join(`, `, [join(`Client X: `, [``, to_string(clientX)]), join(`Client Y: `, [``, to_string(clientY)])])"
      },
      "listen": "mousemove"
    },
    {
      "element": "epi-headlinevalue",
      "@label": "Custom events (user datastreams)",
      "@value": {
        "fn:jmespath": "length(data.resultList.result[])"
      },

      "listen": "bos:beraad"
    }
  ],
  "streams": [
        {
          "@channel": "bos:beraad",
          "element": "epi-poll-datastream",
          "@url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=AUTH:%22Kulesha+E%22&format=json",
          "@poll-frequency": 25000,
          "@credentials": "omit"
        }
  ]
}