// - Import external components
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { push } from "react-router-redux";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/Button";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import ActionAndroid from "material-ui-icons/Android";
import { withStyles } from "material-ui/styles";
import config from "src/config";
import { localize } from "react-localize-redux";
import HomeHeader from "src/components/homeHeader";

// - Import actions
import * as authorizeActions from "src/store/actions/authorizeActions";
import { ILoginComponentProps } from "./ILoginComponentProps";
import { ILoginComponentState } from "./ILoginComponentState";
import { OAuthType } from "src/core/domain/authorize";
import Grid from "material-ui/Grid/Grid";
import CommonAPI from "api/CommonAPI";

const styles = (theme: any) => ({
  textField: {
    minWidth: 280,
    marginTop: 20
  },
  contain: {
    margin: "0 auto"
  },
  paper: {
    minHeight: 370,
    maxWidth: 450,
    minWidth: 337,
    textAlign: "center",
    display: "block",
    margin: "auto"
  },
  bottomPaper: {
    display: "inherit",
    fontSize: "small",
    marginTop: "50px"
  },
  link: {
    color: "#0095ff",
    display: "inline-block"
  }
});

// - Create Login component class
export class LoginComponent extends Component<ILoginComponentProps, ILoginComponentState> {

  styles = {
    singinOptions: {
      paddingBottom: 10,
      justifyContent: "space-around",
      display: "flex"
    },
    divider: {
      marginBottom: 10,
      marginTop: 15
    }
  };

  /**
   * Component constructor
   * @param  {object} props is an object properties of component
   */
  constructor(props: ILoginComponentProps) {
    super(props);

    this.state = {
      emailInput: "",
      emailInputError: "",
      passwordInput: "",
      passwordInputError: "",
      confirmInputError: ""
    };

    // Binding function to `this`
    this.handleForm = this.handleForm.bind(this);

  }

  /**
   * Handle data on input change
   * @param  {event} evt is an event of inputs of element on change
   */
  handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

    switch (name) {
      case "emailInput":
        this.setState({
          emailInputError: ""
        });
        break;
      case "passwordInput":
        this.setState({
          confirmInputError: "",
          passwordInputError: ""
        });

        break;
      default:

    }
  }

  /**
   * Handle register form
   */
  handleForm = () => {
    const { translate } = this.props;
    let error = false;
    if (this.state.emailInput === "") {
      this.setState({
        emailInputError: translate!("login.emailRequiredError")
      });
      error = true;

    }
    if (this.state.passwordInput === "") {
      this.setState({
        passwordInputError: translate!("login.passwordRequiredError")
      });
      error = true;

    }

    if (!error) {
      this.props.login!(
        this.state.emailInput,
        this.state.passwordInput
      );
    }

  }

  /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
  render() {
    const { classes, loginWithOAuth, translate } = this.props;

    const OAuthLogin = (
      <div style={this.styles.singinOptions as any}>
        <IconButton
          onClick={() => loginWithOAuth!(OAuthType.FACEBOOK)}
        ><div className="icon-fb icon"></div></IconButton>
        <IconButton
          onClick={() => loginWithOAuth!(OAuthType.GOOGLE)}
        > <div className="icon-google icon"></div> </IconButton>
        <IconButton
          onClick={() => loginWithOAuth!(OAuthType.GITHUB)}
        > <div className="icon-github icon"></div> </IconButton>
  
      </div>
    );

    return (
        <div> 
        
         <AppBar position="static" style={{ backgroundColor: "#4d545d"}}>
           <h1 className="g__app-name">{config.settings.appName}</h1>
         </AppBar>
      
          <div className="animate-bottom" style={{float: "none"}}>
          
            <h1 className="g__blurb-name1">Welcome to Peterbook</h1>
            <p className="g__blurb-name2">
         
          <div  style={{float: "right"}}>
            <Paper className={classes.paper} elevation={20} >
              <form>
                <div style={{ padding: "48px 40px 36px" }}>
                  <div style={{
                    paddingLeft: "40px",
                    paddingRight: "40px",
                    
                  }}>

                    <h2 className="zoomOutLCorner animated g__paper-title">{translate!("login.title")}</h2>
                  </div>
                  {config.settings.enabledOAuthLogin ? OAuthLogin : ""}
                
                  <Divider style={this.styles.divider} />
                  <TextField
                    className={classes.textField}
                    autoFocus
                    onChange={this.handleInputChange}
                    helperText={this.state.emailInputError}
                    error={this.state.emailInputError.trim() !== ""}
                    name="emailInput"
                    label={translate!("login.emailLabel")}
                    type="email"
                    tabIndex={1}
                  /><br />
                  <TextField
                    className={classes.textField}
                    onChange={this.handleInputChange}
                    helperText={this.state.passwordInputError}
                    error={this.state.passwordInputError.trim() !== ""}
                    name="passwordInput"
                    label={translate!("login.passwordLabel")}
                    type="password"
                    tabIndex={2}
                  /><br />
                  <br />
                  <br />
                  <div className="login__button-box">
                    <div>
                      <Button onClick={this.props.signupPage} tabIndex={4}>{translate!("login.createAccountButton")}</Button>
                    </div>
                    <div >
                      <Button variant="raised" color="secondary" onClick={this.handleForm} tabIndex={3} >{translate!("login.loginButton")}</Button>
                    </div>
                  </div>
                  <span className={classes.bottomPaper}>{translate!("login.forgetPasswordMessage")} <NavLink to="/resetPassword" className={classes.link}>{translate!("login.resetPasswordLabel")}</NavLink></span>
                </div>
              </form>
            </Paper>
            </div>
            <div className="g__blurb-name0">
              <h4> Your data belongs to you. We store only your login credentials - your posts live on you and your friends' devices.</h4>
              <h4> Privacy made simple. We handle encryption and anonymity without any action on your part. </h4>
              <h4> Transparent by design. We are happy to provide all of the data we store on you, at any time, instantly. </h4>
            </div>
            <hr style={{width: "50%"}}/>
            Peterbook is a decentralized social media platform with an emphasis on privacy.
             Your user data belongs to you, not to us. 
            By offering subscriptions to Peterbook, we avoid the predatory practice of selling our users' data to advertisers.
            With Peterbook, you have control over who sees your posts, and for how long. Your data is completely encrypted,
            so it won't fall into the wrong hands. Join us today for a safer, 
            more private social media experience.</p>
            <div>
            <img className="img2" src="https://i.imgur.com/yT6Y8Ub.png"/>
            </div>
          </div>
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
const mapDispatchToProps = (dispatch: any, ownProps: ILoginComponentProps) => {
  return {
    login: (email: string, password: string) => {
      dispatch(authorizeActions.dbLogin(email, password));
    },
    loginWithOAuth: (type: OAuthType) => dispatch(authorizeActions.dbLoginWithOAuth(type)),
    signupPage: () => {
      dispatch(push("/signup"));
    }
  };
};

/**
 * Map state to props
 */
const mapStateToProps = (state: any, ownProps: ILoginComponentProps) => {
  return {
  };
};

// - Connect component to redux store
export default withRouter<any>(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(localize(LoginComponent, "locale", CommonAPI.getStateSlice) as any) as any)) as typeof LoginComponent;
