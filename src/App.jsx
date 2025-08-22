import { Route, BrowserRouter, Routes } from "react-router-dom";
import Profile from "./components/Profile";
import AuthForm from "./components/AuthForm";
import Body from "./components/Body";

import { Provider } from "react-redux";
import appStore from "./utils/appStore"; // default import
import Feed from "./components/Feed";
import MyConnections from "./components/MyConnections";
import Inbox from "./components/Inbox";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myConnections" element={<MyConnections />} />
            <Route path="/pendingRequests" element={<Inbox />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
