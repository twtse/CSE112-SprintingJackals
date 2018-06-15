// - Import react components
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import TextField, { TextFieldProps } from "material-ui/TextField";
import InfiniteScroll from "react-infinite-scroller";
import { getTranslate, getActiveLanguage } from "react-localize-redux";
import { Map } from "immutable";
import {CopyToClipboard} from "react-copy-to-clipboard";

// - Import app components
import UserBoxList from "components/userBoxList";
import LoadMoreProgressComponent from "layouts/loadMoreProgress";

// - Import API
import { FriendService } from "data/firestoreClient/services/friends";

// - Import actions
import * as userActions from "store/actions/userActions";
import * as globalActions from "store/actions/globalActions";
import { IFindPeopleComponentProps } from "./IFindPeopleComponentProps";
import { IFindPeopleComponentState } from "./IFindPeopleComponentState";
import { UserTie } from "core/domain/circles/userTie";
import {provider} from "src/socialEngine";
import {SocialProviderTypes} from "core/socialProviderTypes";
import {ICircleService} from "core/services/circles";
import {IFriendService} from "data/firestoreClient/services/friends/IFriendService";
import {IUserService} from "core/services/users";

/**
 * Create component class
 */
export class FindPeopleComponent extends Component<IFindPeopleComponentProps, IFindPeopleComponentState> {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
	constructor(props: IFindPeopleComponentProps) {
		super(props);

        const userService: IUserService = provider.get<IUserService>(SocialProviderTypes.UserService);

		// Default state
		this.state = {
            friendIdString: "",
            newUsernameString: "",
            username: "",
            friendFieldError: false,
            usernameFieldError: false
		};

        userService.getUsername(this.props.userId)
            .then(_username => {
                this.setState({
                    username: _username
                });
            });

		this.handleFriendIdChange = this.handleFriendIdChange.bind(this);
		this.handleAddFriend = this.handleAddFriend.bind(this);
        this.handleUsernameFieldChange = this.handleUsernameFieldChange.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
	}

	handleFriendIdChange = (event: any) => {
		const friendId = event.target.value;

        if (friendId == null) {
            return;
        }

		this.setState({
			friendIdString: friendId,
            friendFieldError: false
		});
	}

    handleUsernameFieldChange = (event: any) => {
        const username = event.target.value;

        if (username == null) {
            return;
        }

        this.setState({
            newUsernameString: username,
            usernameFieldError: false
        });
    }

	handleAddFriend = () => {
		const { friendIdString } = this.state;
		const friendService: IFriendService = provider.get<IFriendService>(SocialProviderTypes.FriendService);

		friendService.sendFriendRequest(this.props.userId, friendIdString)
            .then(() => {
                this.props.sendMessage!("Friend request sent to " + friendIdString);
            })
            .catch(err => {
                this.setState({
                    friendFieldError: true
                });
                this.props.sendMessage!(err);
            });
	}

    handleChangeUsername = () => {
        const { newUsernameString } = this.state;
        const userService: IUserService = provider.get<IUserService>(SocialProviderTypes.UserService);

        userService.changeUsername(this.props.userId, newUsernameString)
            .then(newUsername => {
                this.setState({
                    username: newUsername
                });
                this.props.sendMessage!("Username changed to " + newUsername);
            })
            .catch(err => {
                // Display the error to the user
                this.setState({
                    usernameFieldError: true
                });
                this.props.sendMessage!(err);
            });
    }

    handleCopy = () => {
        const {sendMessage} = this.props;
        sendMessage!("Username copied to clipboard!");
    }

	/**
	 * Scroll loader
	 */
	scrollLoad = (page: number) => {
		const { loadPeople } = this.props;
		loadPeople!(page, 10);
	}

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
	render() {
		const { hasMorePeople, translate } = this.props;
		const peopleInfo = Map<string, UserTie>(this.props.peopleInfo!);

		const textFieldStyle = {
			width: "100%",
			backgroundColor: "white",
			color: "black",
			paddingLeft: "5px"
		};

		const buttonStyle = {
			display: "block",
			marginLeft: "auto",
			marginRight: "auto"
		};

		return (
            <Paper elevation={0} className="animate2-top10"
              style={{ position: "relative", margin: "auto", padding: "48px 40px 36px",
                        display: "block", width: "50%", minHeight: 250,
                        maxWidth: 450, minWidth: 250, textAlign: "center"}}>
                <div style={{textAlign: "center"}}>
                    {this.state.username === "" ?
                    <span>Set your username below to give to your friends!</span> :
                    <span>Your username is&nbsp;
                        <CopyToClipboard
                            text={this.state.username}
                            onCopy={this.handleCopy}>
                            <span style={{cursor: "pointer"}}><b>{this.state.username}</b></span>
                        </CopyToClipboard>.
                        Share this with your friends!
                    </span>
                    }
                </div>
    			<div className="friend_bars">
    				{"To add a friend, you must both enter each other's secret username below."}
    				<TextField
    					id="friend-id-field"
    					style={textFieldStyle}
    					margin="normal"
    					type="string"
    					placeholder="Friend Username"
    					onChange={this.handleFriendIdChange}
                        error={this.state.friendFieldError}>
    				</TextField>

    				<Button style={buttonStyle} variant="raised" onClick={this.handleAddFriend}>
    					Add as Friend
                    </Button>
    				<br/>

    				<TextField
    					id="username-field"
    					style={textFieldStyle}
    					margin="normal"
    					type="string"
    					placeholder="Change Username"
    					onChange={this.handleUsernameFieldChange}
                        error={this.state.usernameFieldError}>
    				</TextField>
    				<Button style={buttonStyle} variant="raised" onClick={this.handleChangeUsername}>
    					Change Username
                    </Button>
    			</div>
            </Paper>
		);
	}
}

/**
 * Map dispatch to propsl
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch: any, ownProps: IFindPeopleComponentProps) => {
	return {
		loadPeople: (page: number, limit: number) => dispatch(userActions.dbGetPeopleInfo(page, limit)),
        sendMessage: (message: string) => dispatch(globalActions.showMessage(message))
	};
};

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: any, ownProps: IFindPeopleComponentProps) => {
    const uid = state.getIn(["authorize", "uid"]);
	const people = state.getIn(["user", "people"]);
	const hasMorePeople = state.getIn(["user", "people", "hasMoreData"], true);
	const info: Map<string, UserTie> = state.getIn(["user", "info"]);
	return {
        userId: uid,
		    translate: getTranslate(state.get("locale")),
		    peopleInfo: info,
		    hasMorePeople
	};
};

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(FindPeopleComponent as any);
