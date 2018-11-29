import Select from 'react-select';

const { __ } = wp.i18n;
const { apiFetch } = wp;

const {
	registerStore,
	withSelect,
} = wp.data;

const {
	Spinner,
	BaseControl,
} = wp.components;

const actions = {
	setUserRoles(userRoles) {
		return {
			type: 'SET_USER_ROLES',
			userRoles,
		};
	},

	fetchFromAPI(path) {
		return {
			type: 'FETCH_FROM_API',
			path,
		};
	},
};

const store = registerStore( 'meceware/block-permissions-user-role-store', {
	reducer( state = { userRoles: {} }, action ) {

		switch ( action.type ) {
			case 'SET_USER_ROLES':
				return {
					...state,
					userRoles: action.userRoles,
				};
		}

		return state;
	},

	actions,

	selectors: {
		getUserRoles( state ) {
			const { userRoles } = state;
			return userRoles;
		},
	},

	controls: {
		FETCH_FROM_API( action ) {
			return apiFetch( {path: action.path} );
		},
	},

	resolvers: {
		* getUserRoles( state ) {
			const userRoles = yield actions.fetchFromAPI( '/meceware/block-permissions/v1/user-roles' );

			return actions.setUserRoles( userRoles );
		},
	},
} );

function UserRoleSelect( props ) {

  const {
    className,
    name,
    selected,
    onChange,
    userRoles,
  } = props;

  if ( ! userRoles.length ) {
    return (
      <p className={ className } >
        <Spinner />
        { __( 'Please wait while loading the user roles!', 'mcw-bp-gutenberg' ) }
      </p>
    );
	}

	let selectedRoles = [];
	if ( null !== selected && selected ) {
		selectedRoles = JSON.parse( selected );
	}

  return (
    <BaseControl>
      <label>
        <Select
          className = { className }
          name = { name }
          value= { selectedRoles }
          onChange = { onChange }
          options = { userRoles }
          isMulti = 'true'
        />
        { __( 'Select user roles which this element will be visible to. Type Administrator, Editor, Author, Contributor, Subscriber or any other user role defined.', 'mcw-bp-gutenberg' ) }
      </label>
    </BaseControl>
  )
}

export default withSelect( ( select ) => {
  return ( {
    userRoles: select('meceware/block-permissions-user-role-store').getUserRoles(),
  } );
} )( UserRoleSelect );
