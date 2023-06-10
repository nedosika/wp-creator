import {createHttpLink, Observable} from "@apollo/client";
import {config} from "../config";
import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";
import {GraphQLError} from "graphql";
import {apolloClient} from "./client";
import {REFRESH_TOKEN} from "./queries";

const refreshToken = async () => {
    try {
        const refreshResolverResponse = await apolloClient.query({
            query: REFRESH_TOKEN,
        });

        const accessToken = refreshResolverResponse.data?.refreshToken.tokens.accessToken;
        localStorage.setItem('accessToken', accessToken || '');
        return accessToken;
    } catch (err) {
        localStorage.clear();
        throw err;
    }
};

function isRefreshRequest(operation) {
    return operation.operationName === 'refreshToken';
}

export const errorHandler = ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            switch (err.message) {
                case 'UNAUTHENTICATED':
                    if (isRefreshRequest(operation))
                        return;

                    return new Observable((observer) => {
                        (async () => {
                            try {
                                const accessToken = await refreshToken();

                                if (!accessToken) {
                                    console.log('Empty AccessToken')
                                    throw new GraphQLError('Empty AccessToken');
                                }

                                // Retry the failed request
                                const subscriber = {
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer),
                                };

                                forward(operation).subscribe(subscriber);
                            } catch (err) {
                                observer.error(err);
                            }
                        })();
                    });
            }
        }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
}

export const httpLink = createHttpLink({uri: config.uri, credentials: 'include'});

export const authLink = setContext((operation, {headers}) => {
    const accessToken = localStorage.getItem("accessToken");

    return {
        headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : "",
        }
    }
});

export const errorLink = onError(errorHandler);