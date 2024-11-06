import { Col, Row } from "antd";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { AuthenticatedLayout } from "./components/layouts/AuthenticatedLayout";
import PrivateRoute from "./privateRoute";
const MenuBar = React.lazy(() => import("./components/menubar/index"));
const SignIn = React.lazy(() => import("./components/signin/index"));
const SignUp = React.lazy(() => import("./components/signup/index"));
const ResetPassword = React.lazy(() =>
  import("./components/reset-password/index")
);
const VerifyEmail = React.lazy(() => import("./components/verify-email/index"));
const TwitterCallback = React.lazy(() =>
  import("./components/signin/twitterCallback")
);
const Home = React.lazy(() => import("./components/home/index"));
const Explore = React.lazy(() => import("./components/explore/index"));
const Notifications = React.lazy(() =>
  import("./components/notifications/index")
);
const ChatBox = React.lazy(() => import("./components/chat/ChatBox"));
const MessageBox = React.lazy(() => import("./components/chat/MessageBox"));
const Votes = React.lazy(() => import("./components/votes/index"));
const Games = React.lazy(() => import("./components/games/index"));
const Relationship = React.lazy(() =>
  import("./components/profile/relationship")
);
const Referral = React.lazy(() => import("./components/referral/index"));
const TermOfService = React.lazy(() => import("./components/termOfService"));
const PrivacyPolicy = React.lazy(() => import("./components/privacyPolicy"));
const Feedback = React.lazy(() => import("./components/feedback"));
const GameDetail = React.lazy(() => import("./components/games/detail"));
const VoteDetail = React.lazy(() => import("./components/votes/voteDetail"));
const CreateVote = React.lazy(() => import("./components/votes/create"));
const BuySell = React.lazy(() => import("./components/buy-sell/index"));
const Profile = React.lazy(() => import("./components/profile/index"));
const ProfileWallet = React.lazy(() =>
  import("./components/profile-wallet/index")
);
const FAQ = React.lazy(() => import("./components/faq/index"));
const TermsOfServices = React.lazy(() =>
  import("./components/terms-of-services/index")
);
const PrivacyAndSafety = React.lazy(() =>
  import("./components/privacy-and-safety/index")
);
const Deposit = React.lazy(() => import("./components/deposit/index"));
const Tweet = React.lazy(() => import("./components/tweet/index"));
const Likes = React.lazy(() => import("./components/tweet/likes"));
const Hashtag = React.lazy(() => import("./components/tweet/hashtag"));
const Invest = React.lazy(() => import("./components/invest/index"));

const Retweet = React.lazy(() => import("./components/tweet/retweets"));
const CookiesPolicy = React.lazy(() => import("./components/cookies-policy"));
const PageNotFound = React.lazy(() => import("./components/pageNotFound"));
const DepositAndWithdraw = React.lazy(() =>
  import("./components/deposit-withdraw")
);
const PageError = React.lazy(() => import("./components/pageError"));
const Portfolio = React.lazy(() => import("./components/portfolio"));

const Routes = () => {
  const withLikeModal = (WrappedComponent) => (props) =>
    (
      <React.Fragment>
        <Likes />
        <WrappedComponent />
      </React.Fragment>
    );

  const withRetweetModal = (WrappedComponent) => (props) =>
    (
      <React.Fragment>
        <Retweet />
        <WrappedComponent />
      </React.Fragment>
    );

  const withOnlyMenuBar = (WrappedComponent) => (props) =>
    (
      <Row>
        <Col md={7} xs={5}>
          <MenuBar />
        </Col>
        <Col md={17} xs={19}>
          <WrappedComponent />
        </Col>
      </Row>
    );

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={SignIn} homeAuthenticated />
        <PrivateRoute
          exact
          path="/sign-up"
          component={SignUp}
          homeAuthenticated
        />
        <PrivateRoute
          exact
          path="/reset-password"
          component={ResetPassword}
          homeAuthenticated
        />
        <PrivateRoute
          exact
          path="/verify-email"
          component={VerifyEmail}
          homeAuthenticated
        />
        <PrivateRoute
          exact
          path="/sign-up"
          component={SignUp}
          homeAuthenticated
        />
        <PrivateRoute
          exact
          path="/reset-password"
          component={ResetPassword}
          homeAuthenticated
        />
        <PrivateRoute
          exact
          path="/verify-email"
          component={VerifyEmail}
          homeAuthenticated
        />
        <PrivateRoute
          exact
          path="/twitter/callback"
          component={TwitterCallback}
          homeAuthenticated
        />
        <PrivateRoute
          exact
          path="/home"
          component={AuthenticatedLayout(Home)}
        />
        <PrivateRoute
          path="/explore"
          component={AuthenticatedLayout(Explore)}
        />
        <PrivateRoute
          path="/hashtag/:hashtagSlug"
          component={AuthenticatedLayout(Hashtag)}
        />
        <PrivateRoute
          path="/hashtag"
          component={AuthenticatedLayout(Hashtag)}
        />
        <PrivateRoute
          path="/notifications"
          component={AuthenticatedLayout(Notifications)}
        />
        <PrivateRoute
          path="/messages/:chatRoomId"
          component={AuthenticatedLayout(MessageBox, true)}
        />
        <PrivateRoute
          path="/messages"
          component={AuthenticatedLayout(ChatBox)}
        />
        <PrivateRoute path="/invest" component={AuthenticatedLayout(Invest)} />
        <PrivateRoute
          path="/votes/create"
          component={AuthenticatedLayout(CreateVote)}
        />
        <PrivateRoute
          path="/votes/:userId"
          component={AuthenticatedLayout(VoteDetail)}
        />
        <PrivateRoute path="/votes" component={AuthenticatedLayout(Votes)} />
        <PrivateRoute
          path="/profile-wallet"
          component={AuthenticatedLayout(ProfileWallet)}
        />
        <PrivateRoute
          path="/deposit"
          component={AuthenticatedLayout(Deposit)}
        />
        <PrivateRoute
          path="/my-portfolio"
          component={AuthenticatedLayout(Portfolio)}
        />
        {/* <PrivateRoute path="/bookmarks" component={AuthenticatedLayout(BookMarks)} /> */}
        {/* <PrivateRoute path="/lists" component={AuthenticatedLayout(Lists)} /> */}
        <PrivateRoute
          path="/games/:id"
          component={AuthenticatedLayout(GameDetail)}
        />
        <PrivateRoute path="/games" component={AuthenticatedLayout(Games)} />
        <PrivateRoute
          path="/referral"
          component={AuthenticatedLayout(Referral)}
        />
        <PrivateRoute path="/faq" component={AuthenticatedLayout(FAQ)} />
        <PrivateRoute
          path="/terms-of-services"
          component={AuthenticatedLayout(TermsOfServices)}
        />
        <PrivateRoute
          path="/privacy-and-safety"
          component={AuthenticatedLayout(PrivacyAndSafety)}
        />
        <PrivateRoute
          path="/relationship/:id"
          component={AuthenticatedLayout(Relationship)}
        />
        <PrivateRoute
          exact
          path="/buy-sell/:id"
          component={AuthenticatedLayout(BuySell)}
        />
        <PrivateRoute
          exact
          path="/profile/:id"
          component={AuthenticatedLayout(Profile)}
        />
        <PrivateRoute
          exact
          path="/profile/:id/media"
          component={AuthenticatedLayout(Profile)}
        />
        <PrivateRoute
          exact
          path="/profile/:id/likes"
          component={AuthenticatedLayout(Profile)}
        />
        <PrivateRoute
          path="/profile/:username/:activity"
          component={AuthenticatedLayout(Profile)}
        />
        <PrivateRoute
          path="/tweet/:slug"
          component={AuthenticatedLayout(Tweet)}
        />
        {/* <PrivateRoute
          path="/:username/status/:tweetId/likes"
          component={AuthenticatedLayout(withLikeModal(Tweet))}
        />
        <PrivateRoute
          path="/:username/status/:tweetId/retweets"
          component={AuthenticatedLayout(withRetweetModal(Tweet))}
        /> */}
        <PrivateRoute
          path="/deposit-withdraw"
          component={AuthenticatedLayout(DepositAndWithdraw)}
        />
        <PrivateRoute path="/error" component={PageError} />
        <Route path="/term-of-service" component={TermOfService} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/cookies-policy" component={CookiesPolicy} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
};

export default Routes;
