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
    mutation Mutation($data: TaskInput) {
        createTask(data: $data)
    }
`

export const DELETE_TASK = gql`
    mutation deleteTask($id: ID!) {
        deleteTask(id: $id){
            name
        }
    }
`
export const UPDATE_TASK = gql`
    mutation updateTask($id: ID!, $task: TaskInput) {
        updateTask(id: $id, task: $task){
            id
        }
    }
`