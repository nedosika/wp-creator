import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client";
import {authLink, errorLink, httpLink} from "./links";

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
    connectToDevTools: true,
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache
})