import AppRouter from "./components/AppRouter/AppRouter";
import DialogProvider from "./contexts/DialogsContext";
import TasksProvider from "./contexts/TasksContext";
import {ApolloProvider} from "@apollo/client";
import {apolloClient} from "./apollo/client";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
    <ErrorBoundary>
        <ApolloProvider client={apolloClient}>
            <TasksProvider>
                <DialogProvider>
                    <AppRouter/>
                </DialogProvider>
            </TasksProvider>
        </ApolloProvider>
    </ErrorBoundary>
);
export default App;