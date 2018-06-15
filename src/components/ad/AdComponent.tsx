// - Import react components
import React, {Component} from "react";
import {connect} from "react-redux";
import {NavLink} from "react-router-dom";
import {push} from "react-router-redux";
import PropTypes from "prop-types";
import moment from "moment/moment";
import Linkify from "react-linkify";
import copy from "copy-to-clipboard";
import {getTranslate, getActiveLanguage} from "react-localize-redux";
import {Map} from "immutable";

// - Material UI
import Card, {CardActions, CardHeader, CardMedia, CardContent} from "material-ui/Card";
import {LinearProgress} from "material-ui/Progress";
import Typography from "material-ui/Typography";
import SvgShare from "material-ui-icons/Share";
import SvgComment from "material-ui-icons/Comment";
import SvgFavorite from "material-ui-icons/Favorite";
import SvgFavoriteBorder from "material-ui-icons/FavoriteBorder";
import Checkbox from "material-ui/Checkbox";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import {grey} from "material-ui/colors";
import Paper from "material-ui/Paper";
import Menu from "material-ui/Menu";
import {MenuList, MenuItem} from "material-ui/Menu";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui-icons/MoreVert";
import {ListItemIcon, ListItemText} from "material-ui/List";
import {withStyles} from "material-ui/styles";
import {Manager, Target, Popper} from "react-popper";
import Grow from "material-ui/transitions/Grow";
import ClickAwayListener from "material-ui/utils/ClickAwayListener";
import classNames from "classnames";

import reactStringReplace from "react-string-replace";

// - Import app components
import CommentGroup from "components/commentGroup";
import ShareDialog from "components/shareDialog";
import PostWrite from "components/postWrite";
import Img from "components/img";
import IconButtonElement from "layouts/iconButtonElement";
import UserAvatar from "components/userAvatar";

// - Import actions
import * as voteActions from "store/actions/voteActions";
import * as postActions from "store/actions/postActions";
import * as commentActions from "store/actions/commentActions";
import * as globalActions from "store/actions/globalActions";
import {IAdComponentProps} from "./IAdComponentProps";
import {IAdComponentState} from "./IAdComponentState";

const styles = (theme: any) => ({
	iconButton: {
		width: 27,
		marginLeft: 5
	},
	popperOpen: {
		zIndex: 10
	},
	popperClose: {
		pointerEvents: "none",
		zIndex: 0
	},
	postBody: {
		wordWrap: "break-word",
		color: "rgba(0, 0, 0, 0.87)",
		fontSize: "0.875rem",
		fontWeight: 400,
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		lineHeight: "1.46429em"
	},
	image: {
		width: "100%",
        maxWidth: 530,
		height: 500
	},
	fullPageXs: {
		[theme.breakpoints.down("xs")]: {
			width: "100%",
			height: "100%",
			margin: 0,
			overflowY: "auto"
		}
	}
});

// - Create component class
export class AdComponent extends Component<IAdComponentProps, IAdComponentState> {
    styles = {
        dialog: {
            width: "",
            maxWidth: "530px",
            borderRadius: "4px"
        }
    };

	/**
	 * Component constructor
	 * @param  {object} props is an object properties of component
	 */
	constructor(props: IAdComponentProps) {
		super(props);

		this.state = {

		};
	}

	/**
	 * Reneder component DOM
	 * @return {react element} return the DOM which rendered by component
	 */
	render() {
        const ad = this.props.ad;

        const id = ad.id;
        const image = ad.image;

		return (
			<Card key={`advertisement-${id}`}>
				<CardHeader
                    title="Advertisement">
                </CardHeader>
				{image ? (
					<CardMedia image={image}>
						<Img fileName={image}/>
					</CardMedia>) : ""}
			</Card>
		);
	}
}

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch: any, ownProps: IAdComponentProps) => {
	return {

	};
};

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: Map<string, any>, ownProps: IAdComponentProps) => {
	return {

    };
};

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(AdComponent as any) as any);
