import { NewsFeed, NewsDetail } from '../types';

export class Api {
    xhr: XMLHttpRequest;
    url: string;

    constructor(url: string) {
        this.xhr = new XMLHttpRequest();
        this.url = url;
    }
    
    // 비동기로 바뀌면서, 응답을 받을 때, 데이터를 전달하여 UI가 업데이트 되도록
    // 콜백 함수를 전달
    getRequestWithXHR<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
        this.xhr.open('GET', this.url);
        this.xhr.addEventListener('load', () => {
            // ajax.response 속성에 응답이 왔을 때 처리
            cb(JSON.parse(this.xhr.response) as AjaxResponse);
        });
        this.xhr.send();
    }

    getRequestWithPromise<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
        fetch(this.url)
            .then(response => response.json())
            .then(cb)
            .catch(() => {
                console.error('데이터를 불러오지 못했습니다.');
            })
    }
}

export class NewsFeedApi extends Api { 
    constructor(url: string) {
        super(url);
    }

    getDataWithXHR(cb: (data: NewsFeed[]) => void): void {
        return this.getRequestWithXHR<NewsFeed[]>(cb)
    }

    getDataWithPromise(cb: (data: NewsFeed[]) => void): void {
        return this.getRequestWithPromise<NewsFeed[]>(cb)
    }
}

export class NewsDetailApi extends Api { 
    constructor(url: string) {
        super(url);
    }

    getDataWithXHR(cb: (data: NewsDetail) => void): void {
        return this.getRequestWithXHR<NewsDetail>(cb)
    }

    getDataWithPromise(cb: (data: NewsDetail) => void): void {
        return this.getRequestWithPromise<NewsDetail>(cb);
    }
}