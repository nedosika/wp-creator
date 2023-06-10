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
            status {
                start
            }
        }
    }
`;

export const GET_TASK = gql`query getTask($id: ID!){
    task(id: $id){
        name
        status {
            start
        }
        report {
            errors {
                url 
                error
            }
            posts {
                id,            
                url
                slug,
                title,
                categories
            }
        }
    }
}`;