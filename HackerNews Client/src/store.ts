import { NewsFeed, NewsStore } from './types';

export default class Store implements NewsStore {
    private _currentPage: number;
    private feeds: NewsFeed[];

    constructor() {
        this._currentPage = 1;
        this.feeds = [];
    }

    get currentPage(): number {
        return this._currentPage;
    }

    set currentPage(page: number) {
        this._currentPage = page;
    }

    get prevPage(): number {
        return this._currentPage - 1 > 1 ? this._currentPage - 1 : 1;
    }

    get nextPage(): number {
        const maxPage = this.numOfFeed() / 10;
        return this._currentPage + 1 > maxPage ? maxPage : this._currentPage + 1;
    }

    getFeedsAll(): NewsFeed[] {
        return this.feeds;
    }

    getFeed(idx: number): NewsFeed {
        return this.feeds[idx];
    }

    setFeeds(feeds: NewsFeed[]): void {
        this.feeds = feeds.map(feed => ({
            ...feed,
            read: false,
        }));
    }

    readFeed(id: number): void {
        const feed = this.feeds.find(feed => feed.id === id);
        if (feed) {
            feed.read = true;
        }
    }

    hasFeed(): boolean {
        return this.feeds.length > 0;
    }

    numOfFeed(): number {
        return this.feeds.length;
    }
}