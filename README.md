# WFS Search Plugin

Extends search widget using Web Feature Service (WFS)

## Configuration:

| Property            | Type                                                                                                                             | State    | Description                                                                                                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`               | string                                                                                                                           | required | URL of the search service                                                                                                                                                                                 |
| `addressMapping`    | Record<string, string>                                                                                                           | required | Mapping the feature attributes to the VC Map Address Balloon attributes                                                                                                                                   |
| `getFeatureOptions` | [ol.format.WFS.writeGeFeatureOptions](https://openlayers.org/en/latest/apidoc/module-ol_format_WFS.html#~WriteGetFeatureOptions) | required | The options passed to writeGetFeature for WFS query                                                                                                                                                       |
| `isStoredQuery`     | boolean                                                                                                                          | optional | Wether this is a `wfs:StoredQuery`. Stored query filter expressions are treated _as entire Query_ not just the body of the Query. All attributes of the query tag are copied at runtime (featureType etc) |
| `filterExpression`  | string                                                                                                                           | required | The filter expression as a template. Is passed an array of tokens (the result of .match(regEx))                                                                                                           |
| `regEx`             | string                                                                                                                           | required | The RegEx to use for tokenizing.                                                                                                                                                                          |
| `minToken`          | number                                                                                                                           | required | The minimum number of RegEx groups to find in a given string to search. For instance if requiring both a street and house number, the count would be 2.                                                   |
| `projection`        | ProjectionOptions                                                                                                                | optional | The projection of the data. Defaults to WGS84                                                                                                                                                             |

Example:

```json
{
  "url": "./search-wfs",
  "addressMapping": {
    "city": "ort",
    "street": "strasse",
    "number": "hnr",
    "zip": "plz"
  },
  "getFeatureOptions": {
    "featureNS": "http://gingko.de/dueren",
    "featurePrefix": "dueren",
    "featureTypes": ["hausnummern"],
    "maxFeatures": 10,
    "geometryName": "geom",
    "srsName": "urn:ogc:def:crs:EPSG::4326"
  },
  "filterExpression": "<ogc:Filter xmlns='http://www.opengis.net/wfs' xmlns:ogc=\"http://www.opengis.net/ogc\"><% if (token[2]) { %><ogc:And>      <ogc:PropertyIsLike wildCard=\"%\" singleChar=\"_\" escape=\"\\\">        <ogc:PropertyName>dueren:strasse</ogc:PropertyName>        <ogc:Literal><%= token[1] %></ogc:Literal>      </ogc:PropertyIsLike>    <ogc:PropertyIsEqualTo>      <ogc:PropertyName>dueren:hnr</ogc:PropertyName>      <ogc:Literal><%= token[2] %></ogc:Literal>    </ogc:PropertyIsEqualTo></ogc:And><% } else { %>      <ogc:PropertyIsLike wildCard=\"%\" singleChar=\"_\" escape=\"\\\">        <ogc:PropertyName>dueren:strasse</ogc:PropertyName>        <ogc:Literal><%= token[1] %></ogc:Literal>      </ogc:PropertyIsLike><% } %>    </ogc:Filter>",
  "regEx": "([a-zA-ZßäöüÄÖÜ\\.\\-\\s]+)\\s*([0-9]+\\s*[a-zA-Z]*)?",
  "minToken": 1
}
```
