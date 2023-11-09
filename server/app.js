const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

app.use("/", graphqlHTTP({ graphiql: true, schema: schema }));

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
