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

// - Import app components
import UserBoxList from "components/userBoxList";
import LoadMoreProgressComponent from "layouts/loadMoreProgress";

// - Import API
import { FriendService } from "data/firestoreClient/services/friends";

// - Import actions
import * as userActions from "store/actions/userActions";
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
            username: ""
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

        if (friendId == null || friendId === "") {
            return;
        }

		this.setState({
			friendIdString: friendId
		});
	}

    handleUsernameFieldChange = (event: any) => {
        const username = event.target.value;

        if (username == null || username === "") {
            return;
        }

        this.setState({
            newUsernameString: username
        });
    }

	handleAddFriend = () => {
		const { friendIdString } = this.state;
		const friendService: IFriendService = provider.get<IFriendService>(SocialProviderTypes.FriendService);

		friendService.sendFriendRequest(this.props.userId, friendIdString);
	}

    handleChangeUsername = () => {
        const { newUsernameString } = this.state;
        const userService: IUserService = provider.get<IUserService>(SocialProviderTypes.UserService);

        userService.changeUsername(this.props.userId, newUsernameString)
            .then(newUsername => {
                this.setState({
                    username: newUsername
                });
            })
            .catch(err => {
                // Throw an error?
                console.error(err);
            });
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
            //
			<div>
				<TextField
					id="friend-id-field"
					style={textFieldStyle}
					margin="normal"
					type="string"
					placeholder="Friend ID"
					onChange={this.handleFriendIdChange}>
				</TextField>
				<Button style={buttonStyle} variant="raised" onClick={this.handleAddFriend}>
					Add as Friend
                </Button>

                {this.state.username === "" ?
                "Set your username below to give to your friends!" :
                "Your username is " + this.state.username + ". Share this with your friends!"
                }

				<TextField
					id="username-field"
					style={textFieldStyle}
					margin="normal"
					type="string"
					placeholder="Change Username"
					onChange={this.handleUsernameFieldChange}>
				</TextField>
				<Button style={buttonStyle} variant="raised" onClick={this.handleChangeUsername}>
					Change Username
                </Button>
			</div>
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
		loadPeople: (page: number, limit: number) => dispatch(userActions.dbGetPeopleInfo(page, limit))
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
