function logout() {
    FB.logout();
}

function checkLoginStatusAndLoadUserLikes() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            loadUserAndLikes();
        } else {
            loginAndLoadUserLikes();
        }
    });
}

function loginAndLoadUserLikes() {
    FB.login(function (response) {
        loadUserAndLikes();
    }, { scope: 'user_likes' });
}

function loadUserAndLikes() {
    FB.api('/me', function (userResponse) {
        React.render(<UserDetails userDetails={userResponse} />,
            document.getElementById('user'));

        let fields = { fields: 'category, name, picture.type(normal)' };

        FB.api('/me/likes', fields, function (likesResponse) {
            React.render(<UserLikeList list={likesResponse.data} />,
            document.getElementById('main'));
        });
    });
}

let UserDetails = React.createClass({
    handleLogout: function () {
        FB.logout(function () {
            alert("You're logged out, refresh the page in order to login again.");
    });
    },
    render: function () {
        return (
            <section id="user-details">
                <a href={this.props.userDetails.link} target="__blank">
                    {this.props.userDetails.name}
                </a>
                {' | '}
                <a href="#" onClick={this.handleLogout}>Logout</a>
            </section>
        )
    },
});


let UserLikeList = React.createClass({
    render: function() {
        let items = this.props.list.map(function (likeObject) {
            return <UserLikeItem data={likeObject} />
        });

        return (
            <ul id="user-likes-list">
                { items }
            </ul>
        );
    }
});

let UserLikeItem = React.createClass({
    render: function() {
        let data = this.props.data;

        return (
            <li>
                <img src={data.picture.data.url} title={data.name} />

                <h1>{data.name} <small>{data.category}</small> </h1>
            </li>
        );
    }
});