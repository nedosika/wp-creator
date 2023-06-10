import {gql} from "@apollo/client";

export const SIGN_IN = gql`
    mutation signIn($email: String!, $password: String!){
        signIn(email: $email, password: $password){
            tokens{
                accessToken
                refreshToken
            }
        }
    }
`

export const SIGN_OUT = gql`
    mutation signOut{
        signOut{
            refreshToken
            error
        }
    }
`

export const CREATE_TASK = gql`   
    mutation createTask($task: TaskInput) {
        createTask(task: $task) {
            name            
        }
    }
`

export const DELETE_TASK = gql`
    mutation deleteTask($id: ID!) {
        deleteTask(id: $id){
            name
        }
    }
`
