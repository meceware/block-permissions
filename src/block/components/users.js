import AsyncSelect from "react-select/lib/Async";
import debounce from 'lodash/debounce';

const { __ } = wp.i18n;
const { apiFetch } = wp;

const {
	BaseControl,
} = wp.components;

function UsersSelect( props ) {

  const {
    className,
    name,
    selected,
    onChange,
	} = props;

	const setUsers = users => { return users; };

	const loadUsers = (input, callback) => {
		if ( input && input.length > 1 ) {
			apiFetch( { path: wp.url.addQueryArgs( "/meceware/block-permissions/v1/users?user=" + encodeURIComponent(input) ) } ).then( users => {
				callback( setUsers(users) );
			} ).catch( err => { console.log('ERROR! Block Permissions: Users not loaded!'); console.log(err); } );
		} else {
			callback( setUsers( [] ) );
		}
	};

	let selectedUsers = [];
	if ( null !== selected && selected ) {
		selectedUsers = JSON.parse( selected );
	}

  return (
    <BaseControl>
      <label>
        <AsyncSelect
          className = { className }
          name = { name }
					value= { selectedUsers }
					onChange = { onChange }

					cacheOptions
					loadOptions = { debounce(loadUsers, 800) }
          isMulti = 'true'
        />
        { __( 'Select users which this element will be visible to. Type user name, user login name or user email.', 'mcw-bp-gutenberg' ) }
      </label>
    </BaseControl>
  )
}

export default UsersSelect;
