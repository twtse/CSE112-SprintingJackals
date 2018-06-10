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

		// Default state
		this.state = {
			friendIdString: ""
		};

		this.handleFriendIdChange = this.handleFriendIdChange.bind(this);
		this.handleAddFriend = this.handleAddFriend.bind(this);
	}

	handleFriendIdChange = (event: any) => {
		const friendId = event.target.value;

		this.setState({
			friendIdString: friendId
		});
	}

	handleAddFriend = () => {
		const { friendIdString } = this.state;
		const friendService: IFriendService = provider.get<IFriendService>(SocialProviderTypes.FriendService);

		friendService.sendFriendRequest(this.props.userId, friendIdString);
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
			</div>
		);
	}
}

/**
 * Map dispatch to props
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
