class TopMenu extends React.Component {
    render() {
        return (
            <div>
                <div title="친구">
                    {
                        this.props.location === "index"
                            ? (<a href="#"><i className="fas fa-user active"></i></a>)
                            : (<a href="/KakaoTalk/index.html"><i className="fas fa-user"></i></a>)
                    }
                </div>
                <div title="채팅">
                    {
                        this.props.location === 'chats' 
                            ? (<a href="/KakaoTalk/chats.html">
                                    <i className="fas fa-comment active"></i>
                                    <div className="alarm">1</div>
                                </a>) 
                            : (<a href="/KakaoTalk/chats.html">
                                    <i className="fas fa-comment"></i>
                                    <div className="alarm">1</div>
                                </a>)
                    }
                </div>
                <div title="더보기">
                    {
                        this.props.location === "more"
                            ? (<a href="#"><i className="fas fa-ellipsis-h active"></i></a>)
                            : (<a href="/KakaoTalk/more.html"><i className="fas fa-ellipsis-h"></i></a>)
                    }
                </div>
            </div>
        );
    }
}

class BottomMenu extends React.Component {
    render() {
        return (
            <ul>
                <li><i className="far fa-bell"></i></li>
                <li><i className="fas fa-cog"></i></li>
            </ul>
        );
    }
}

class SideNav extends React.Component {
    render() {
        return (
            <nav>
                <TopMenu location={this.props.loc}></TopMenu>
                <BottomMenu></BottomMenu>
            </nav>
        );
    }
}