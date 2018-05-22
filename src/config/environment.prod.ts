import { LanguageType } from 'store/reducers/locale/langugeType'

export const environment = {
	firebase: {
        apiKey: 'AIzaSyDhd2NpQO0_Pmfou_ytcRnphNCq8cMNod8',
        authDomain: 'sprintingjackals.firebaseapp.com',
        databaseURL: 'https://sprintingjackals.firebaseio.com',
        projectId: 'sprintingjackals',
        storageBucket: 'sprintingjackals.appspot.com',
        messagingSenderId: '1046472027563'
	},
	settings: {
		enabledOAuthLogin: true,
		appName: 'Peterbook',
		defaultProfileCover: 'https://firebasestorage.googleapis.com/v0/b/open-social-33d92.appspot.com/o/images%2F751145a1-9488-46fd-a97e-04018665a6d3.JPG?alt=media&token=1a1d5e21-5101-450e-9054-ea4a20e06c57',
		defaultLanguage: LanguageType.English
	},
	theme: {
		primaryColor: '#00b1b3',
		secondaryColor: '#4d545d'
	}
}
