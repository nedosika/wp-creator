import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client";
import {errorLink, httpLink} from "./links";

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
    connectToDevTools: true,
    link: ApolloLink.from([errorLink, httpLink]),
    cache
})