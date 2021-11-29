import React, {lazy, Suspense} from "react";
import history from "./utils/history";
import {Route, Routes} from "react-router-dom";

const Home = lazy(() => import("./pages/Home"))
const Account = lazy(() => import("./pages/Account"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const Error404 = lazy(() => import("./pages/Error404"))


function App() {
    return (
        <Routes history={history}>
            <Route
                path="/"
                exact={true}
                element={
                    <Suspense fallback={<>...</>}>
                        <Home/>
                    </Suspense>
                }
            />
            <Route
                path="/login"
                exact={true}
                element={
                    <Suspense fallback={<>...</>}>
                        <Login/>
                    </Suspense>
                }
            />
            <Route
                path="/signup"
                exact={true}
                element={
                    <Suspense fallback={<>...</>}>
                        <Register/>
                    </Suspense>
                }
            />
            <Route
                path="/profile"
                exact={true}
                element={
                    <Suspense fallback={<>...</>}>
                        <Account/>
                    </Suspense>
                }
            />
            <Route
                path="*"
                element={
                    <Suspense fallback={<>...</>}>
                        <Error404/>
                    </Suspense>
                }
            />
        </Routes>
    );
}

export default App;