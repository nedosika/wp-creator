import {gql} from "@apollo/client";

export const TASK_PROGRESS_SUBSCRIPTION = gql`
  subscription {
    taskProgressUpdated {
      id
      progress
    }
  }
`;