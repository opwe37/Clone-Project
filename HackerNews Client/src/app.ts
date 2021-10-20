// 이전: store 객체를 전역으로 관리하고 있던 문제가 있음
// 수정: store 클래스를 별도로 만들어, 사용하는 곳에 넘겨줄 것

import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";
import Store from "./store";

const store = new Store();

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root', store);
const newsDetailView = new NewsDetailView('root', store);

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();