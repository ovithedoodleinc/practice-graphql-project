const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = graphql;

// dummy data
const organizationsData = [
  { id: "1", name: "rigel" },
  { id: "2", name: "pran" },
  { id: "3", name: "meta" },
];

const companiesData = [
  { id: "1", name: "doodle", orgId: "1" },
  { id: "2", name: "ahar share", orgId: "1" },
  { id: "3", name: "farmgam", orgId: "1" },
  { id: "4", name: "facebook", orgId: "3" },
  { id: "5", name: "instagram", orgId: "3" },
  { id: "6", name: "whatsapp", orgId: "3" },
];

// type
const OrganizationType = new GraphQLObjectType({
  name: "Organization",
  description: "this is organization",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    companies: {
      type: GraphQLList(CompanyType),
      resolve(parent, args) {
        return _.filter(companiesData, { orgId: parent.id });
      },
    },
  }),
});

const CompanyType = new GraphQLObjectType({
  name: "Company",
  description: "this is company",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    organization: {
      type: OrganizationType,
      resolve(parent, args) {
        return _.find(organizationsData, { id: parent.orgId });
      },
    },
  }),
});

// root query
const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  description: "this is root query",
  fields: {
    organization: {
      type: OrganizationType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return _.find(organizationsData, { id: args.id });
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return _.find(companiesData, { id: args.id });
      },
    },
  },
});

// mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "this is mutation",
  fields: {
    createOrganization: {
      type: OrganizationType,
      args: {
        // id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        const organization = {
          name: args.name,
        };

        return organization;
      },
    },
    createCompany: {
      type: CompanyType,
      args: {
        // id: { type: GraphQLID },
        name: { type: GraphQLString },
        orgId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const company = {
          name: args.name,
          orgId: args.orgId,
        };

        return company;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
