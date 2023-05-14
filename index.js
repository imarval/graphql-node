import {ApolloServer, gql} from 'apollo-server'

const persons = [
  {
    id: "f4e30d5f-6a6c-4b24-88d5-1e0453e3db8a",
    name: "Juan",
    phone: "555-123-4567",
    street: "Calle 1",
    city: "Maracaibo",
  },
  {
    id: "afaf16c4-f80a-4a8a-ba4f-b3a0685a68a5",
    name: "Maria",
    phone: "555-987-6543",
    street: "Avenida 2",
    city: "Caracas",
  },
  {
    id: "d156c385-45c6-4b0f-82d1-19e5c1f1f21e",
    name: "Carlos",
    phone: "",
    street: "Calle 3",
    city: "Margarita",
  },
  {
    id: "1c2ee1b1-3a71-4410-b92e-49f2c7a6d35b",
    name: "Laura",
    phone: "555-111-1111",
    street: "Avenida 4",
    city: "Falcon",
  },
];

const typeDefinitions = gql`
    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }    

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person]!
        findPerson(name:String): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,

        allPersons: (root, args) => {
            if (!args.phone) return persons

            return persons.filter(person => {
                return args.phone === "YES" ? person.phone : !person.phone
            })
        },
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }

    }
}

const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server running at ${url}`)
})