import Router from "./core/router";
import { NewsFeedView, NewsDetailView } from "./page";
import { Store } from './types';

const store: Store = {
    currentPage: 1,
    feeds: [],
};

// 파일이 분리되면서, 다른 파일에서는 store에 접근이 불가능해짐
// => 브라우저의 window 객체에 store를 저장
// => 좋은 방식은 아니지만, 가장 손쉬운 방법
declare global {
    interface Window {
        store: Store;
    }
}

window.store = store;
// =========================================================

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();