// - Import react components
import React, {Component} from "react";
import PropTypes, {string} from "prop-types";
import {connect} from "react-redux";
import Button from "material-ui/Button";
import SvgAddImage from "material-ui-icons/AddAPhoto";
import SvgDelete from "material-ui-icons/Delete";
import GridList, {GridListTile, GridListTileBar} from "material-ui/GridList";
import {grey} from "material-ui/colors";
import uuid from "uuid";
import {getTranslate, getActiveLanguage} from "react-localize-redux";
import {Map} from "immutable";

// - Material UI
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import SvgClose from "material-ui-icons/Clear";
import {CircularProgress} from "material-ui/Progress";
import Tooltip from "material-ui/Tooltip";
import {withStyles} from "material-ui/styles";

// - Import app components
import Img from "components/img";

// - Import API
import FileAPI from "api/FileAPI";

// - Import actions
import * as imageGalleryActions from "store/actions/imageGalleryActions";
import * as globalActions from "store/actions/globalActions";

import {IPostAdComponentProps} from "./IPostAdComponentProps";
import {IPostAdComponentState} from "./IPostAdComponentState";
import {hidePostAd} from "store/actions/globalActions";
import {SocialProviderTypes} from "core/socialProviderTypes";
import {provider} from "src/socialEngine";
import {IImageGalleryService} from "core/services/imageGallery";

const styles = (theme: any) => ({
    fullPageXs: {
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            height: "100%",
            margin: 0,
            overflowY: "auto"
        }
    }
});

/**
 * Create component class
 */
export class PostAdComponent extends Component<IPostAdComponentProps, IPostAdComponentState> {

    styles = {
        root: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around"
        },
        box: {
            width: 320,
            height: 325,
            justifyContent: "center",
            alignItems: "center",
        },
        uploadButton: {
            verticalAlign: "middle",
            fontWeight: 400
        },
        formButton: {
            verticalAlign: "middle",
            fontWeight: 300,
            marginLeft: "26px",
        },
        uploadInput: {
            cursor: "pointer",
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            width: "100%",
            opacity: 0
        },
        deleteImage: {
            marginLeft: "5px",
            cursor: "pointer",
            color: "white"
        },
        addImage: {
            marginRight: "5px",
            cursor: "pointer",
            color: "white"
        },
        formBox: {
            padding: "0px 26px",
            align: "center",
        }
    };

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props: IPostAdComponentProps) {
        super(props);

        // Binding function to `this`
        this.onFileChange = this.onFileChange.bind(this);
        this.handleDeleteImage = this.handleDeleteImage.bind(this);

        this.state = {
            imgSet: false,
            companyName: "",
            phoneNum: "",
            website: "",
        };
    }

    /**
     * Handle delete image
     * @param  {event} evt  passed by on click event on delete image
     * @param  {integer} id is the image identifier which selected to delete
     */
    handleDeleteImage = (event: any) => {
        this.setState({
            imgSet: false
        });
    }

    componentDidMount() {
        window.addEventListener("onSendResizedImage", this.handleSendResizedImage);
    }

    componentWillUnmount() {
        window.removeEventListener("onSendResizedImage", this.handleSendResizedImage);
    }

    /**
     * Handle send image resize event that pass the resized image
     *
     *
     * @memberof ImageGallery
     */
    handleSendResizedImage = (event: any) => {
        const { resizedImage, fileName } = event.detail;
        const {uploadImage} = this.props;
        uploadImage!(resizedImage,fileName);
    }

    /**
     * Handle on change file upload
     */
    onFileChange = (event: any) => {
        const extension = FileAPI.getExtension(event.target.files[0].name);
        let fileName = (`${uuid()}.${extension}`);
        let image = FileAPI.constraintImage(event.target.files[0], fileName);

        this.setState({
            imgSet: true
        });
    }

    handleCompanyName = (event: any) => {
        const target = event ? event.target : {};
        const value = target ? target.value : "";
        if (value) {
            this.setState({
                companyName: value
            });
        }
    }

    handlePhoneNum = (event: any) => {
        const target = event ? event.target : {};
        const value = target ? target.value : "";
        if (value) {
            this.setState({
                phoneNum: value
            });
        }
    }

    handleWebsite = (event: any) => {
        const target = event ? event.target : {};
        const value = target ? target.value : "";
        if (value) {
            this.setState({
                website: value
            });
        }
    }

    handleClose = () => {
        const {hidePostAd, resetAdImgUrl} = this.props;
        resetAdImgUrl!();
        hidePostAd!();
    }

    advertiseForm = () => {
        const {translate, hidePostAd} = this.props;

        return (
            <div style={this.styles.formBox}>
                <form style={{width: "90%"}}>
                    <TextField
                        placeholder={translate!("postAd.entityName")}
                        onChange={this.handleCompanyName}
                        autoFocus
                        fullWidth={true}
                    /><br />
                    <TextField
                        placeholder={translate!("postAd.phoneNum")}
                        onChange={this.handlePhoneNum}
                        autoFocus
                        fullWidth={true}
                    /><br />
                    <TextField
                        placeholder={translate!("postAd.website")}
                        onChange={this.handleWebsite}
                        autoFocus
                        fullWidth={true}
                    /><br />
                </form>
            </div>
        );
    }

    advertiseImg = () => {
        const {translate} = this.props;
        if (this.props.imgUrl!) {
            return (
                <GridListTile>
                <div>
                    <div style={{overflowY: "hidden", overflowX: "auto"}}>
                        <Img fileName={this.props.imgUrl!} style={{width: "100%", height: "auto"}}/>
                    </div>
                </div>
                {/*<GridListTileBar*/}
                    {/*title={<SvgDelete style={this.styles.deleteImage as any}*/}
                                      {/*onClick={evt => this.handleDeleteImage(evt)}/>}*/}
                    {/*titlePosition="top"*/}
                {/*/>*/}
            </GridListTile>
            );
        } else {
            return (
                <GridListTile key="upload-image-gallery">
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <input
                            accept="image/*"
                            style={this.styles.uploadInput as any}
                            id="raised-button-file"
                            onChange={this.onFileChange}
                            type="file"
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span" style={this.styles.uploadButton as any}>
                                {translate!("postAd.uploadButton")}
                            </Button>
                        </label>
                    </div>
                </GridListTile>
            );
        }
    }

    render() {
        const {translate, hidePostAd} = this.props;

        return (
            <div style={{
                position: "fixed",
                zIndex: 1101,
                right: "10%",
                top: "50%",
                transform: "translate(0, -50%)"
            }}>
                <Paper className="paper">
                    <div className="close">
                        <Tooltip title="Cancel" placement="bottom-start">
                            <IconButton onClick={() => this.handleClose()}>
                                <SvgClose/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div style={this.styles.box}>
                        {this.advertiseForm()}
                        <GridList cellHeight={180} style={{
                            marginLeft: "26px"
                        }}>
                            {this.advertiseImg()}
                        </GridList>

                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span" onClick={() => this.handleClose()} style={this.styles.formButton as any}>
                                {translate!("postAd.submitButton")}
                            </Button>
                        </label>
                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span" onClick={() => this.handleClose()} style={this.styles.formButton as any}>
                                {translate!("postAd.cancelButton")}
                            </Button>
                        </label>
                    </div>
                </Paper>
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
const mapDispatchToProps = (dispatch: any, ownProps: IPostAdComponentProps) => {
    return {
        uploadImage: (image: any, imageName: string) => dispatch(imageGalleryActions.dbUploadAdImage(image, imageName)),
        progressChange: (percent: number, status: boolean) => dispatch(globalActions.progressChange(percent, status)),
        hidePostAd: () => dispatch(globalActions.hidePostAd()),
        resetAdImgUrl: () => dispatch(imageGalleryActions.setAdImageURL("", ""))
    };
};

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state: Map<string, any>) => {
    const uid = state.getIn(["authorize", "uid"]);
    const currentUser = state.getIn(["user", "info", uid]);
    return {
        translate: getTranslate(state.get("locale")),
        avatar: currentUser ? currentUser.avatar : "",
        imgUrl: state.getIn(["imageGallery", "adImageURL"])
    };
};

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(PostAdComponent as any) as any);
