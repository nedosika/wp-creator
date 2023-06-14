import {gql} from "@apollo/client";

export const REFRESH_TOKEN = gql`
    query refreshToken {
        refreshToken{
            tokens {
                accessToken
                refreshToken
            }
        } 
    }
`

export const GET_TASKS = gql`
    query {
        tasks{
            id
            name
            progress
            urls
        }
    }
`;

export const GET_TASK = gql`
    query Query($id: ID) {
          task(id: $id) {
                id
                urls
          }
    }
`;