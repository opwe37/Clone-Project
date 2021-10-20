import View from '../core/view';

export interface NewsStore {
    currentPage: number;
    prevPage: number;
    nextPage: number;
    hasFeed: boolean;
    getFeedsAll: () => NewsFeed[];
    getFeed: (idx: number) => NewsFeed;
    setFeeds: (feeds: NewsFeed[]) => void;
    readFeed: (id: number) => void;
    numOfFeed: () => number;
}

export interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
}

export interface NewsFeed extends News {
    readonly comments_count: number;
    readonly points: number;
    read?: boolean;
}

export interface NewsDetail extends News {
    readonly comments: NewsComment[];
}

export interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}

export interface RouteInfo {
    path: string;
    page: View;
}