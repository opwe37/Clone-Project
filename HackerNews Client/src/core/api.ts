import { NewsFeed, NewsDetail } from '../types';

export class Api {
    url: string;

    constructor(url: string) {
        this.url = url;
    }
    
    // async-await 문법으로 실제론 비동기 작업이지만, 코드는 동지 작업처럼 작성 가능
    // async 지시자가 붙은 함수는 반환 타입이 Promise 여야 하는 규칙이 존재
    async request<AjaxResponse>(): Promise<AjaxResponse> {
        const response = await fetch(this.url);
        return await response.json() as AjaxResponse;
    }
}

export class NewsFeedApi extends Api { 
    constructor(url: string) {
        super(url);
    }

    async getData(): Promise<NewsFeed[]> {
        return this.request<NewsFeed[]>()
    }
}

export class NewsDetailApi extends Api { 
    constructor(url: string) {
        super(url);
    }

    async getData(): Promise<NewsDetail> {
        return this.request<NewsDetail>();
    }
}